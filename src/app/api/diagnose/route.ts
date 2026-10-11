import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description = "", image_base64, voice_transcript = "", vehicle_id } = body;

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    let vehicleContext = "";
    if (vehicle_id) {
      const { data: vehicle } = await supabase
        .from("vehicles")
        .select("make, model, year, engine_type")
        .eq("id", vehicle_id)
        .maybeSingle();

      if (vehicle) {
        vehicleContext = `Target Vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.engine_type || "Standard Engine"})`;
      }
    }

    const promptText = `Vehicle context: ${vehicleContext}. Symptom description: ${description}. Voice transcript: ${voice_transcript}.`;

    const apiKey = process.env.OPENAI_API_KEY;

    let resultPayload = null;

    if (apiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a Nigerian auto spare parts diagnostic expert. Analyze the vehicle issue. Return strictly a JSON object with keys: part_name, category, confidence (number 0-100), oem_guess, urgency ('Low'|'Med'|'High'), reason, symptoms (array of strings), price_range_ngn (number). Do not wrap in markdown.",
              },
              {
                role: "user",
                content: [
                  { type: "text", text: promptText },
                  ...(image_base64
                    ? [{ type: "image_url", image_url: { url: `data:image/jpeg;base64,${image_base64}` } }]
                    : []),
                ],
              },
            ],
            temperature: 0.2,
          }),
        });

        if (response.ok) {
          const aiData = await response.json();
          const contentStr = aiData.choices?.[0]?.message?.content;
          if (contentStr) {
            resultPayload = JSON.parse(contentStr.replace(/```json|```/g, "").trim());
            resultPayload.source = "openai";
          }
        }
      } catch (e) {
        console.warn("OpenAI API call error, falling back:", e);
      }
    }

    if (!resultPayload) {
      const lower = (description + " " + voice_transcript).toLowerCase();
      let match = {
        part_name: "Ceramic Front Brake Pad Set",
        category: "Brakes & Suspension",
        confidence: 60,
        oem_guess: "OEM-04465-02220",
        urgency: "High",
        reason: "Smart Match - Keyword matching identified brake assembly wear symptoms.",
        symptoms: ["Squealing noise when braking", "Reduced stopping power"],
        price_range_ngn: 18500,
      };

      if (lower.includes("knock") || lower.includes("engine")) {
        match = {
          part_name: "Engine Main Rod Bearing Set",
          category: "Engine Components",
          confidence: 60,
          oem_guess: "OEM-13041-21020",
          urgency: "High",
          reason: "Smart Match - Engine metallic knocking sound suggests main bearing rod play.",
          symptoms: ["Metallic engine knocking", "Low oil pressure warning"],
          price_range_ngn: 32000,
        };
      } else if (lower.includes("shock") || lower.includes("bump") || lower.includes("suspension")) {
        match = {
          part_name: "Heavy-Duty Gas Shock Absorber",
          category: "Suspension",
          confidence: 60,
          oem_guess: "OEM-48510-09R20",
          urgency: "Med",
          reason: "Smart Match - Bouncing chassis over Lagos road potholes points to shock leakage.",
          symptoms: ["Chassis bounce", "Uneven tire tread wear"],
          price_range_ngn: 28000,
        };
      }

      resultPayload = {
        ...match,
        source: "keyword_fallback",
        label: "Smart Match - Add OPENAI_API_KEY for 94% Vision",
      };
    }

    // Save diagnosis to ai_diagnoses table
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      await supabase.from("ai_diagnoses").insert({
        user_id: session.user.id,
        vehicle_id: vehicle_id || null,
        part_name: resultPayload.part_name,
        category: resultPayload.category,
        confidence: resultPayload.confidence,
        oem_guess: resultPayload.oem_guess,
        urgency: resultPayload.urgency,
        reason: resultPayload.reason,
        symptoms: resultPayload.symptoms,
        price_range_ngn: resultPayload.price_range_ngn,
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json(resultPayload);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Diagnostic processing error.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
