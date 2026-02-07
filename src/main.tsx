import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ✅ Register Service Worker for caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ SW registered:', registration.scope);
      })
      .catch((error) => {
        console.warn('⚠️ SW registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);