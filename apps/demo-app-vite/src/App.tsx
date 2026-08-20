import "./App.css";
import { CreateInspectionPage, LoginPage } from "./pages";
import { MonitoringProvider } from "@monkvision/monitoring";
import { AnalyticsProvider } from "@monkvision/analytics";
import { AuthProvider } from "@monkvision/network";
import { sentryMonitoringAdapter } from "./sentry";
import { posthogAnalyticsAdapter } from "./posthog";
import { authConfigs } from "./auth";
import { useMonkState } from "@monkvision/common";

function App() {
  const state = useMonkState();
  console.log(process.env, { state });
  return (
    <MonitoringProvider adapter={sentryMonitoringAdapter}>
      <AnalyticsProvider adapter={posthogAnalyticsAdapter}>
        <AuthProvider configs={authConfigs}>
          {/* <div>hey</div> */}
          <LoginPage />
          {/* <CreateInspectionPage /> */}
        </AuthProvider>
      </AnalyticsProvider>
    </MonitoringProvider>
  );
}

export default App;
