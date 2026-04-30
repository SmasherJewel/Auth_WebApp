import { Button } from "@/components/ui/button";
import { Chrome, Github } from "lucide-react";

function OAuth2Buttons() {
  const backendBaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8082";

  return (
    <div className="grid gap-3">
      <Button type="button" variant="outline" className="w-full" asChild>
        <a href={`${backendBaseUrl}/oauth2/authorization/google`}>
          <Chrome className="h-5 w-5" />
          Continue with Google
        </a>
      </Button>

      <Button type="button" variant="outline" className="w-full" asChild>
        <a href={`${backendBaseUrl}/oauth2/authorization/github`}>
          <Github className="h-5 w-5" />
          Continue with GitHub
        </a>
      </Button>
    </div>
  );
}

export default OAuth2Buttons;
