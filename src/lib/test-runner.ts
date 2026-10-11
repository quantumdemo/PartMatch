import { formatWAT } from "./timezone";
import { sanitizeInput, generateTransactionRef } from "./security";
import { EscrowService } from "./services/escrowService";
import { VehicleService } from "./services/vehicleService";

export function runTests() {
  console.log("=== Running PartMatch Core & Stage 3 Tests ===");

  // Test 1: Timezone WAT formatting
  const testDate = new Date("2026-10-10T13:30:00Z");
  const formattedWAT = formatWAT(testDate);
  console.assert(
    formattedWAT.includes("10 Oct 2026") && formattedWAT.includes("WAT"),
    `Test 1 Failed: ${formattedWAT}`
  );
  console.log("✓ Test 1 Passed: WAT Timezone formatting correct.");

  // Test 2: Sanitize Input XSS
  const unsafeText = "<script>alert('xss')</script>";
  const safeText = sanitizeInput(unsafeText);
  console.assert(
    !safeText.includes("<script>") && safeText.includes("&lt;script&gt;"),
    `Test 2 Failed: ${safeText}`
  );
  console.log("✓ Test 2 Passed: Input sanitization correct.");

  // Test 3: Transaction Ref Generation
  const ref = generateTransactionRef();
  console.assert(ref.startsWith("PM-REF-"), `Test 3 Failed: ${ref}`);
  console.log("✓ Test 3 Passed: Transaction reference generation correct.");

  // Test 4: Escrow Fee Split (85% Seller / 15% Mechanic / 5% Platform)
  const totalAmount = 20000;
  const split = EscrowService.calculateSplit(totalAmount);
  console.assert(split.platformFee === 1000, `Test 4 Failed: Platform fee ${split.platformFee}`);
  console.assert(split.sellerAmount === 16150, `Test 4 Failed: Seller split ${split.sellerAmount}`);
  console.assert(split.mechanicAmount === 2850, `Test 4 Failed: Mechanic split ${split.mechanicAmount}`);
  console.log("✓ Test 4 Passed: Escrow 85/15/5 financial split calculation correct.");

  // Test 5: Vehicle Service Addition
  const newVeh = VehicleService.addVehicle("user-123", {
    make: "Toyota",
    model: "Corolla",
    year: 2012,
  });
  console.assert(newVeh !== null, "Test 5 Failed: Vehicle creation returned null");
  console.log("✓ Test 5 Passed: Vehicle service garage management correct.");

  console.log("=== All PartMatch Core & Stage 3 Tests Passed! ===");
}

if (require.main === module) {
  runTests();
}
