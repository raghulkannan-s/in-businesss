import { AuthProvider } from './app/contexts/AuthContext';
import AppNavigator from './app/navigation/AppNavigator';

import "./global.css"

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
