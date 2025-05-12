import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { LandSimulator } from "./home";
import Aos from "aos";
import "aos/dist/aos.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LandSimulator />
  </StrictMode>
);

Aos.init({ passive: true });
