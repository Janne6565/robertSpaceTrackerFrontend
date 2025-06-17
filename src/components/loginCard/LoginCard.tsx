import {
  useCallback,
  useState,
  unstable_ViewTransition as ViewTransition,
} from "react";
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

const LoginCard = () => {
  const [mailSend, setMailSend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const loginCallback = useCallback(async () => {
    setLoading(true);
    await fetch(config.backendBaseUrl + "/user/" + email, {
      method: "POST",
    });
    const response = await fetch(config.backendBaseUrl + "/login/" + email, {
      method: "POST",
    });
    if (response.ok) {
      setLoading(false);
      setMailSend(true);
    }
  }, [email]);

  return (
    <Card
      className="w-full max-w-sm"
      style={{ minWidth: "350px", marginBottom: "40px" }}
    >
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription style={{ maxWidth: "80%" }}>
          Enter your email below to get a magic link to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            if (mailSend || loading) return;
            e.preventDefault();
            loginCallback();
          }}
        >
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMailSend(false);
                }}
              />
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
            disabled={mailSend || loading}
            onClick={loginCallback}
          >
            {mailSend
              ? "Successfully sent mail!"
              : loading
              ? "Sending..."
              : "Send Magic Link"}
          </Button>
        </ViewTransition>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
