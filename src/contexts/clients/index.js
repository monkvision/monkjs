import React, { createContext, useContext, useMemo, useState } from 'react';
import Clients from './clients';
import getClientTheme from './palettes';
import ClientInfo from './info';
import ClientSights from './sights';
import ClientWorkflows from './workflows';

function getClientAttr(dictionary, client) {
  return dictionary[client] ?? dictionary[Clients.DEFAULT];
}

export const ClientContext = createContext({
  client: Clients.DEFAULT,
  setClient: () => {},
  theme: getClientTheme(Clients.DEFAULT),
  info: ClientInfo[Clients.DEFAULT],
  workflow: ClientWorkflows[Clients.DEFAULT],
  sights: ClientSights[Clients.DEFAULT],
});

export function ClientProvider({ children }) {
  const [client, setClient] = useState(Clients.DEFAULT);

  const clientContextValue = useMemo(() => ({
    client,
    setClient,
    theme: getClientTheme(client),
    info: getClientAttr(ClientInfo, client),
    workflow: getClientAttr(ClientWorkflows, client),
    sights: getClientAttr(ClientSights, client),
  }), [client, setClient]);

  return (
    <ClientContext.Provider value={clientContextValue}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  return useContext(ClientContext);
}

export { default as Clients } from './clients';
export { Workflows } from './workflows';
