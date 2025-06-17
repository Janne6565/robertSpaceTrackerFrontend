import ConfigCard from "@/components/configCard/ConfigCard";
import LoginCard from "@/components/loginCard/LoginCard";
import { Box, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import useCookie from "react-use-cookie";

const Config = () => {
  const [userToken, setUserToken] = useCookie("accessToken", "0");
  const loggedIn = useMemo(() => userToken !== "0", [userToken]);

  useEffect(() => {
    const jwt = document.location.search.match(/jwt=([^&]+)/);
    if (jwt && jwt[1] != userToken) {
      setUserToken(jwt[1]);
      document.location.search = "";
    }
  }, [userToken, setUserToken]);

  return (
    <Box sx={{ height: "80vh" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Configuration
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        {!loggedIn ? <LoginCard /> : <ConfigCard />}
      </Box>
    </Box>
  );
};

export default Config;
