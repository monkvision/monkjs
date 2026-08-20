import "./App.css";
import { LoginPage } from "./pages";
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
          <LoginPage />
        </AuthProvider>
      </AnalyticsProvider>
    </MonitoringProvider>
  );
}

export default App;
