import { MonkE2eId } from "@monkvision/types";
import { BasePage } from "../../../shared/pages/BasePage";

export class VehicleTypeSelectionPage extends BasePage {
  readonly confirmButton = this.e2eLocator(MonkE2eId.VEHICLE_TYPE_CONFIRM);

  vehicleTypeCard(vehicleType: string) {
    return this.e2eLocator(`${MonkE2eId.VEHICLE_TYPE_CARD_PREFIX}${vehicleType}`);
  }

  async confirmDefaultVehicleType() {
    await this.confirmButton.waitFor({ state: "visible", timeout: 15_000 });
    await this.confirmButton.click();
  }

  async confirmVehicleType(vehicleType: string) {
    const card = this.vehicleTypeCard(vehicleType);
    await card.waitFor({ state: "visible", timeout: 15_000 });
    await card.click();
    await this.confirmDefaultVehicleType();
  }
}
