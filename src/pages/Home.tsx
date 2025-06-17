import { ApplicationContext } from "@/App";
import DiscountCard from "@/components/discountCard/DiscountCard";
import type { Ship, Sku } from "@/types/backendTypes";
import { Box, Typography } from "@mui/material";
import {
  startTransition,
  useContext,
  useEffect,
  useState,
  unstable_ViewTransition as ViewTransition,
} from "react";

export function Home() {
  const context = useContext(ApplicationContext);
  const [discounted, setDiscounted] = useState<
    {
      ship: Ship;
      skus: Sku[];
      discountedPrice: number;
      originalPrice: number;
    }[]
  >([]);
  useEffect(() => {
    startTransition(() =>
      setDiscounted(
        context.ships
          .map((ship) => {
            return {
              ship,
              skus: context.skus.find((s) => s.id == ship.id)?.skus || [],
            };
          })
          .filter(({ skus }) => {
            if (!skus) return false;
            if (skus.length > 1) return true;
            return false;
          })
          .map(({ ship, skus }) => {
            const discountedPrice =
              Math.min(...skus.map((skus) => skus.price)) / 100;
            const originalPrice = ship.msrp / 100;
            return { ship, skus, discountedPrice, originalPrice };
          })
          .sort((a, b) => a.discountedPrice - b.discountedPrice)
      )
    );
  }, [context.ships, context.skus]);

  return (
    <Box sx={{ height: "80vh" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Currently On Sale
      </Typography>
      <Box
        sx={{
          flexDirection: "column",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
          gap: 2,
        }}
      >
        <ViewTransition>
          {[...Array(Math.max(15, discounted.length))].map((_number, index) => {
            const discount = discounted[index] ?? null;
            const isLoading = context.shipsLoading || context.skusLoading;
            return (
              <ViewTransition
                key={`ship-${index}-transition`}
                default="slow-fade"
              >
                {(isLoading || index < discounted.length) && (
                  <DiscountCard
                    key={`ship-${index}`} // key matters!
                    loading={isLoading}
                    discount={discount}
                  />
                )}
              </ViewTransition>
            );
          })}
        </ViewTransition>
      </Box>
    </Box>
  );
}
