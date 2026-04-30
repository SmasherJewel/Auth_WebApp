import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

function OAuthFailure() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
      <Card className="w-full max-w-md rounded-lg">
        <CardHeader>
          <CardTitle>OAuth sign-in failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The provider did not complete the login. Try again or use email and password.
          </p>
          <Button asChild>
            <Link to="/login">Back to login</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

export default OAuthFailure;
