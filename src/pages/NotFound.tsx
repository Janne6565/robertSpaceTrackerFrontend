import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      className="flex flex-col items-center justify-center"
      sx={{ height: "80vh", gap: 2 }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h5" color="textSecondary" className="mt-4">
        Page Not Found
      </Typography>
      <Link to="/" className="text-blue-500 hover:underline">
        Go back to Home
      </Link>
    </Box>
  );
};

export default NotFound;
