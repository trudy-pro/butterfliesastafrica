import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Upload, Shield, Settings } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface UserMenuProps {
  user: SupabaseUser;
}

const UserMenu = ({ user }: UserMenuProps) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    };
    checkAdmin();
  }, [user.id]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 font-body text-sm">
          <User size={14} />
          {displayName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-body">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{displayName}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium w-fit">
                <Shield size={10} />
                Admin
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/contribute")} className="font-body cursor-pointer">
          <Upload size={14} className="mr-2" />
          Contribute
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate("/admin")} className="font-body cursor-pointer">
            <Settings size={14} className="mr-2" />
            Admin Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="font-body cursor-pointer text-destructive">
          <LogOut size={14} className="mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
