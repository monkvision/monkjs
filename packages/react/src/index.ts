import React from "react";
import MonkCore, { getBaseQuery } from "../../corejs/src/index"; // Should i use babel to import @monkvision/corejs/src ?
import Constants from "expo-constants";

const config = Constants?.manifest?.extra;
const customHeaders = config?.CUSTOM_ACCESS_TOKEN
  ? [["authorization", `Bearer ${config?.CUSTOM_ACCESS_TOKEN}`]]
  : [];

export const MonkProvider = React.createContext<MonkCore>(
  new MonkCore(
    getBaseQuery({
      baseUrl: `https://${config?.MONK_DOMAIN}/`,
      customHeaders,
    })
  )
);
export default MonkProvider;
