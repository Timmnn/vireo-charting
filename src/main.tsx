import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/mira/theme.css";

createRoot(document.getElementById("root")!).render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>,
);
