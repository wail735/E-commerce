import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext.jsx";
import { CardProvider } from "./context/CartContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SearchProvider>
          <CardProvider>
            <App />
          </CardProvider>
        </SearchProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
