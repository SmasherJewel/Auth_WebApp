import useAuth from "@/auth/store";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/services/AuthService";
import { LogOut, Moon, ShieldCheck, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";

function Navbar() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.user);
  const clearSession = useAuth((state) => state.clearSession);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      clearSession();
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </span>
          Auth App
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setDarkMode((value) => !value)} aria-label="Toggle theme">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard/profile" className="hidden text-sm text-muted-foreground sm:block">
                {user?.name || user?.email}
              </NavLink>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <NavLink to="/login">Login</NavLink>
              </Button>
              <Button asChild size="sm">
                <NavLink to="/signup">Signup</NavLink>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
