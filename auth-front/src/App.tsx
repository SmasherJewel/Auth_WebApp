import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Github, KeyRound, LockKeyhole, ShieldCheck, UserRoundCheck } from "lucide-react";
import { Link } from "react-router";

const capabilities = [
  {
    title: "JWT sessions",
    description: "Short-lived access tokens with refresh-token rotation.",
    icon: KeyRound,
  },
  {
    title: "OAuth account linking",
    description: "Google and GitHub sign-in with same-email account merging.",
    icon: UserRoundCheck,
  },
  {
    title: "Role protection",
    description: "USER and ADMIN access rules enforced by Spring Security.",
    icon: ShieldCheck,
  },
];

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
            <LockKeyhole className="h-4 w-4" />
            Production-ready authentication starter
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-normal md:text-6xl">
              Secure sign-in for modern full-stack apps.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              A clean Spring Boot and React authentication system with password login,
              OAuth, protected routes, refresh tokens, and a focused user dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/signup">
                Create account <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">
                Sign in <Github className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {capabilities.map((item) => (
            <Card key={item.title} className="rounded-lg border-border bg-card">
              <CardContent className="flex gap-4 p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
