interface AppEnvironment {
  baseUrl: string;
}

interface Environment {
  demoApp: AppEnvironment;
  demoVideoApp: AppEnvironment;
}

export function getEnvironment(): Environment {
  return {
    demoApp: {
      baseUrl: process.env["DEMO_APP_URL"] ?? "https://localhost:17200",
    },
    demoVideoApp: {
      baseUrl: process.env["DEMO_VIDEO_APP_URL"] ?? "https://localhost:17201",
    },
  };
}
