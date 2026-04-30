import useAuth from "@/auth/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, KeyRound, ShieldCheck } from "lucide-react";

function Userhome() {
  const user = useAuth((state) => state.user);
  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <section className="space-y-6">
      <Card className="rounded-lg">
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user?.image} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold">Welcome, {user?.name || "User"}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <span className="w-fit rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
            {user?.provider || "LOCAL"} account
          </span>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Token policy", "Access tokens are short-lived and refreshed safely.", KeyRound],
          ["Role guard", "Protected routes are available only after sign-in.", ShieldCheck],
          ["Session state", "Logout revokes refresh tokens and blacklists access tokens.", Activity],
        ].map(([title, description, Icon]) => (
          <Card key={title as string} className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Icon className="h-5 w-5" />
                {title as string}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">{description as string}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default Userhome;
