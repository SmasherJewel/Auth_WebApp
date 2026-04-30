import useAuth from "@/auth/store";
import Navbar from "@/components/Navbar";
import { refreshToken } from "@/services/AuthService";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";

function RootLayout() {
  const setSession = useAuth((state) => state.setSession);
  const setBootstrapping = useAuth((state) => state.setBootstrapping);

  useEffect(() => {
    let mounted = true;

    refreshToken()
      .then((session) => {
        if (mounted) {
          setSession(session.accessToken, session.user);
        }
      })
      .catch(() => {
        // Anonymous visitors are expected on public pages.
      })
      .finally(() => {
        if (mounted) {
          setBootstrapping(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [setBootstrapping, setSession]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-right" />
      <Navbar />
      <Outlet />
    </div>
  );
}

export default RootLayout;
