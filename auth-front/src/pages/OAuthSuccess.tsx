import useAuth from "@/auth/store";
import { Spinner } from "@/components/ui/spinner";
import { refreshToken } from "@/services/AuthService";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

function OAuthSuccess() {
  const setSession = useAuth((state) => state.setSession);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken()
      .then((session) => {
        setSession(session.accessToken, session.user);
        toast.success("Signed in successfully");
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        toast.error("OAuth login could not be completed");
        navigate("/login", { replace: true });
      });
  }, [navigate, setSession]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-3">
      <Spinner />
      <p className="text-sm text-muted-foreground">Completing secure sign-in...</p>
    </div>
  );
}

export default OAuthSuccess;
