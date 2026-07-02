import type { CreateInspectionPage } from "../../apps/demo-app/pages/CreateInspectionPage";
import type { VehicleTypeSelectionPage } from "../../apps/demo-app/pages/VehicleTypeSelectionPage";

export async function completeInspectionSetup(
  createInspectionPage: CreateInspectionPage,
  vehicleTypeSelectionPage: VehicleTypeSelectionPage
): Promise<void> {
  await createInspectionPage.waitForInspectionCreated();
  await vehicleTypeSelectionPage.confirmVehicleType("sedan");
}
