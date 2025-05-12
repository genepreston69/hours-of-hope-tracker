
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './hooks/use-auth.tsx'

// We're removing AppProvider from here because we're now including it in the App component
// to make sure it's available to all routes, including Reports

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
