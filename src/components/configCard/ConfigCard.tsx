import { Info } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import {
  useCallback,
  useEffect,
  useState,
  unstable_ViewTransition as ViewTransition,
} from "react";
import useCookie from "react-use-cookie";
import config from "../../../app.config.json";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import "./configCard.css";

const ConfigCard = () => {
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minPriceApi, setMinPriceApi] = useState<number | null>(null);
  const [maxPriceApi, setMaxPriceApi] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [_email, setEmail] = useState("");
  const [userToken, _setUserToken, removeToken] = useCookie("accessToken", "0");

  const logout = useCallback(() => {
    location.reload();
    removeToken();
  }, [removeToken]);

  const submitChanges = useCallback(async () => {
    const set = async () => {
      setLoading(true);
      await fetch(
        config.backendBaseUrl + "/user/config?accessToken=" + userToken,
        {
          method: "PATCH",
          body: JSON.stringify({
            accessToken: userToken,
            minAmount: minPrice != minPriceApi ? minPrice! * 100 : undefined,
            maxAmount: maxPrice != maxPriceApi ? maxPrice! * 100 : undefined,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      setMaxPriceApi(maxPrice ?? 0);
      setMinPriceApi(minPrice ?? 0);
    };
    set();
  }, [userToken, minPrice, minPriceApi, maxPrice, maxPriceApi]);

  useEffect(() => {
    setLoading(true);
    const fetchConfig = async () => {
      const response = await fetch(
        config.backendBaseUrl + "/user?accessToken=" + userToken,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      if (response.status !== 200) {
        console.error("Error fetching user config:", data);
        setLoading(false);
        removeToken();
        return;
      }
      setEmail(data.email);
      setMinPrice(data.minAmount / 100);
      setMaxPrice(data.maxAmount / 100);
      setMinPriceApi(data.minAmount / 100);
      setMaxPriceApi(data.maxAmount / 100);
      setLoading(false);
    };
    fetchConfig();
  }, [removeToken, userToken]);

  const deleteAccount = useCallback(async () => {
    setLoading(true);
    await fetch(config.backendBaseUrl + "/user?accessToken=" + userToken, {
      method: "DELETE",
    });
    setLoading(false);
    logout();
  }, [userToken, logout]);

  const disabled =
    (minPrice ?? 0) > (maxPrice ?? 0) ||
    loading ||
    (minPrice == minPriceApi && maxPrice == maxPriceApi);

  return (
    <Card
      className="w-full max-w-sm"
      style={{ minWidth: "350px", marginBottom: "40px" }}
    >
      <CardHeader>
        <CardTitle>Configure notifications</CardTitle>
        <CardDescription style={{ maxWidth: "80%" }}>
          Configure what price range you want to be notified about. You can also
          logout from your account here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (disabled) return;
            submitChanges();
          }}
        >
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <label htmlFor="minPrice">
                Minimum Price
                <Tooltip title="Enter the minimum price you want to be notified about. You should set this to a little above the price of the Ship you want to trade in.">
                  <Info
                    style={{
                      fontSize: "18px",
                      transform: "translateY(-4px)",
                      paddingLeft: "5px",
                    }}
                  />
                </Tooltip>
              </label>
              <div className="inputContainer">
                <Input
                  id="minPrice"
                  type="number"
                  className="eurosInput"
                  placeholder="35"
                  required
                  onChange={(e) => {
                    setMinPrice(e.target.value ? parseInt(e.target.value) : 0);
                  }}
                  defaultValue={minPrice}
                />
                <span className="euro">€</span>
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="maxPrice">
                Maximum Price
                <Tooltip title="Enter the maximum price you want to be notified about. You should set this to the price of the Ship you want to buy in the end or below.">
                  <Info
                    style={{
                      fontSize: "18px",
                      transform: "translateY(-4px)",
                      paddingLeft: "5px",
                    }}
                  />
                </Tooltip>
              </label>
              <div className="inputContainer">
                <Input
                  id="maxPrice"
                  type="number"
                  className="eurosInput"
                  placeholder="50"
                  required
                  onChange={(e) => {
                    setMaxPrice(e.target.value ? parseInt(e.target.value) : 0);
                  }}
                  defaultValue={maxPrice}
                />
                <span className="euro">€</span>
              </div>
            </div>
            <Input type="submit" style={{ display: "none" }} />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <ViewTransition>
          <Button
            type="submit"
            className="w-full"
            disabled={disabled}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
            onClick={() => {
              submitChanges();
            }}
          >
            Update Data
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              deleteAccount();
            }}
            style={{ cursor: "pointer" }}
            variant={"destructive"}
          >
            Delete Account
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              logout();
            }}
            variant={"ghost"}
          >
            Logout
          </Button>
        </ViewTransition>
      </CardFooter>
    </Card>
  );
};

export default ConfigCard;
