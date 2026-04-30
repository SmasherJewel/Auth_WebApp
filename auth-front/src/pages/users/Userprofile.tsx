import useAuth from "@/auth/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { updateCurrentUser } from "@/services/AuthService";
import { Check, Pencil, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";

function Userprofile() {
  const user = useAuth((state) => state.user);
  const updateUser = useAuth((state) => state.updateUser);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    try {
      setSaving(true);
      const updatedUser = await updateCurrentUser({ name: trimmedName });
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setName(user?.name || "");
    setIsEditing(false);
  };

  return (
    <section className="space-y-6">
      <Card className="rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Profile</CardTitle>
          {!isEditing && (
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
              Edit name
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.image} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.name || "Unnamed user"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  readOnly={!isEditing}
                  onChange={(event) => setName(event.target.value)}
                  autoFocus={isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ""} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Input id="provider" value={user?.provider || "LOCAL"} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Input id="status" value={user?.enable ? "Enabled" : "Disabled"} readOnly />
              </div>
            </div>

            {isEditing && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" disabled={saving}>
                  {saving ? <Spinner /> : <Check className="h-4 w-4" />}
                  Save changes
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit} disabled={saving}>
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

export default Userprofile;
