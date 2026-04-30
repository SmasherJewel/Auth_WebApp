import useAuth from "@/auth/store";
import { Spinner } from "@/components/ui/spinner";
import { Navigate, Outlet, NavLink } from "react-router";

function Userlayout() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const isBootstrapping = useAuth((state) => state.isBootstrapping);

  if (isBootstrapping) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-lg border border-border bg-card p-3">
        <NavLink to="/dashboard" end className="block rounded-md px-3 py-2 text-sm hover:bg-accent">
          Overview
        </NavLink>
        <NavLink to="/dashboard/profile" className="block rounded-md px-3 py-2 text-sm hover:bg-accent">
          Profile
        </NavLink>
      </aside>
      <Outlet />
    </main>
  );
}

export default Userlayout;
