import { Outlet } from 'react-router-dom';
import { AppContainer } from './AppContainer';

export function App() {
  return (
    <AppContainer>
      <Outlet />
    </AppContainer>
  );
}
