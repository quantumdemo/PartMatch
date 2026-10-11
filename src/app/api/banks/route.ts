import { NextResponse } from "next/server";

export async function GET() {
  try {
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const res = await fetch("https://api.paystack.co/bank?country=nigeria", {
      headers: {
        Authorization: `Bearer ${paystackSecret || ""}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({
        status: true,
        data: [
          { id: 1, name: "Access Bank", code: "044", active: true },
          { id: 2, name: "Guaranty Trust Bank (GTB)", code: "058", active: true },
          { id: 3, name: "First Bank of Nigeria", code: "011", active: true },
          { id: 4, name: "United Bank for Africa (UBA)", code: "033", active: true },
          { id: 5, name: "Zenith Bank", code: "057", active: true },
          { id: 6, name: "Kuda Bank", code: "50211", active: true },
          { id: 7, name: "OPay Digital Services", code: "999992", active: true },
          { id: 8, name: "Moniepoint MFB", code: "50515", active: true },
        ],
      });
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch {
    return NextResponse.json({
      status: true,
      data: [
        { id: 1, name: "Access Bank", code: "044", active: true },
        { id: 2, name: "Guaranty Trust Bank (GTB)", code: "058", active: true },
      ],
    });
  }
}
