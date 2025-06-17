import { CssBaseline, ThemeProvider } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import config from "../app.config.json";
import { RootLayout } from "./components/layout/RootLayout";
import Config from "./pages/Config";
import { Home } from "./pages/Home";
import NotFound from "./pages/NotFound";
import { theme } from "./theme";
import type { Ship, Sku } from "./types/backendTypes";

interface ApplicationContextType {
  ships: Ship[];
  skus: { id: number; skus: Sku[] }[];
  shipsLoading: boolean;
  skusLoading: boolean;
}

export const ApplicationContext = createContext<ApplicationContextType>({
  ships: [],
  skus: [],
  shipsLoading: true,
  skusLoading: true,
});

function App() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [skus, setSkus] = useState<{ id: number; skus: Sku[] }[]>([]);
  const [shipsLoading, setShipsLoading] = useState(true);
  const [skusLoading, setSkusLoading] = useState(true);

  useEffect(() => {
    const fetchShips = async () => {
      try {
        const response = await fetch(config.backendBaseUrl + "/ships");
        const data = await response.json();
        setShips(data);
        setShipsLoading(false);
      } catch (error) {
        console.error("Error fetching ships:", error);
      }
    };

    const fetchSkus = async () => {
      try {
        const response = await fetch(config.backendBaseUrl + "/skus");
        const data = await response.json();
        setSkus(data);
        setSkusLoading(false);
      } catch (error) {
        console.error("Error fetching SKUs:", error);
      }
    };

    fetchShips();
    fetchSkus();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ApplicationContext.Provider
        value={{ ships, skus, shipsLoading, skusLoading }}
      >
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/configure" element={<Config />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ApplicationContext.Provider>
    </ThemeProvider>
  );
}

export default App;
