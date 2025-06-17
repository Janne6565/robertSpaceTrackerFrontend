import type { Ship, Sku } from "@/types/backendTypes";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
} from "@mui/material";
import { unstable_ViewTransition as ViewTransition } from "react";

const DiscountCard = (props: {
  discount?: {
    ship: Ship;
    skus: Sku[];
    discountedPrice: number;
    originalPrice: number;
  };
  loading?: boolean;
  key: string;
}) => {
  const loading = props.loading || !props.discount;
  return (
    <ViewTransition key={props.key}>
      <Card sx={{ maxWidth: 345 }}>
        {loading ? (
          <Skeleton
            sx={{ height: "120px" }}
            animation="pulse"
            variant="rectangular"
          />
        ) : (
          <CardMedia
            component="img"
            alt={props.discount!.ship.name}
            height="140px"
            image={props.discount!.ship.medias.slideShow}
          />
        )}
        <CardContent sx={{ pb: "15px !important" }}>
          <Typography gutterBottom variant="h5" component="div">
            {loading ? <Skeleton width="70%" /> : props.discount!.ship.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {loading ? (
              <Skeleton width="50%" animation="pulse" />
            ) : (
              props.discount!.ship.manufacturer.name
            )}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              mt: 2,
            }}
          >
            <Typography
              sx={{
                minWidth: loading ? "30%" : "0%",
                mb: 0.3,
                ...(loading
                  ? {}
                  : {
                      textDecoration: "line-through",
                    }),
              }}
              color="textDisabled"
            >
              {loading ? (
                <Skeleton
                  width="100%"
                  sx={{ display: "inline-block", mr: 0.3 }}
                />
              ) : (
                props.discount!.originalPrice + "€"
              )}
            </Typography>

            <Typography
              color="success"
              variant="h5"
              sx={{ minWidth: loading ? "30%" : "0%", ml: 1 }}
              component="div"
            >
              {loading ? (
                <Skeleton
                  width="100%"
                  animation="pulse"
                  height="100%"
                  sx={{ display: "inline-block", mr: 0.3 }}
                />
              ) : (
                props.discount!.discountedPrice + "€"
              )}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </ViewTransition>
  );
};

export default DiscountCard;
