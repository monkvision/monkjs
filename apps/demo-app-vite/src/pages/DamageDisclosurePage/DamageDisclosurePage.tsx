import { useTranslation } from "react-i18next";
import { useMonkAppState } from "@monkvision/common";
import { DamageDisclosure } from "@monkvision/inspection-capture-web";
import { useNavigate } from "react-router-dom";
import { CaptureWorkflow, VehicleType } from "@monkvision/types";
import styles from "./DamageDisclosurePage.module.css";
import { Page } from "../pages";

export function DamageDisclosurePage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { config, authToken, inspectionId, vehicleType } = useMonkAppState({
    requireInspection: true,
    requireWorkflow: CaptureWorkflow.PHOTO,
  });

  return (
    <div className={styles["container"]}>
      <DamageDisclosure
        {...config}
        apiConfig={{
          authToken,
          apiDomain: config.apiDomain,
          thumbnailDomain: config.thumbnailDomain,
        }}
        inspectionId={inspectionId}
        onComplete={() => navigate(Page.PHOTO_CAPTURE)}
        lang={i18n.language}
        vehicleType={vehicleType ?? VehicleType.SEDAN}
      />
    </div>
  );
}
