import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clock, ShieldCheck, X, LogOut, ArrowRight, Loader2, UserPlus } from "lucide-react";
import type { User } from "@supabase/supabase-js";

type ApprovalStatus = "none" | "pending" | "approved" | "rejected" | "admin";

const PendingApproval = () => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<ApprovalStatus>("none");
  const [requesting, setRequesting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkStatus = useCallback(async (userId: string) => {
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    if (roles?.some((r: any) => r.role === "admin")) {
      navigate("/");
      return;
    }
    const { data: approval } = await supabase.from("contributor_approvals").select("status").eq("user_id", userId).maybeSingle();
    if (!approval) {
      setStatus("none");
    } else {
      const s = approval.status as ApprovalStatus;
      if (s === "approved") {
        navigate("/");
      } else {
        setStatus(s);
      }
    }
  }, [navigate]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      if (!u) {
        navigate("/auth");
      } else {
        setUser(u);
        checkStatus(u.id);
      }
    });
  }, [checkStatus, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const requestApproval = async () => {
    if (!user) return;
    setRequesting(true);
    try {
      const { error } = await supabase.from("contributor_approvals").insert({
        user_id: user.id,
        email: user.email || "",
        display_name: user.user_metadata?.full_name || user.email,
      });
      if (error) throw error;
      setStatus("pending");
      toast({ title: "Request submitted", description: "An admin will review your request shortly." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setRequesting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full border border-border rounded-lg p-8 text-center space-y-6 bg-card shadow-sm">
        {status === "none" && (
          <>
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display text-foreground">Contributor Access Required</h1>
              <p className="text-sm font-body text-muted-foreground mt-2">
                Your account is active, but you need approval to access the platform.
              </p>
            </div>
          </>
        )}
        {status === "pending" && (
          <>
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display text-foreground">Request Pending</h1>
              <p className="text-sm font-body text-muted-foreground mt-2">
                Your contributor request is being reviewed by an admin. We'll notify you once approved.
              </p>
            </div>
          </>
        )}
        {status === "rejected" && (
          <>
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <X className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-display text-foreground">Request Declined</h1>
              <p className="text-sm font-body text-muted-foreground mt-2">
                Your contributor access request was not approved. Please contact the administrator for more information.
              </p>
            </div>
          </>
        )}

        <div className="pt-4 flex flex-col gap-3">
          {status === "none" && (
            <Button onClick={requestApproval} disabled={requesting} className="w-full font-body">
              {requesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
              {requesting ? "Submitting..." : "Request Contributor Access"}
            </Button>
          )}
          {status === "pending" && (
            <Button onClick={() => navigate("/contribute")} className="w-full font-body">
              Go to Contribute Flow
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          <Button variant="outline" onClick={handleSignOut} className="w-full font-body">
            <LogOut className="w-4 h-4 mr-2" />
            Sign out & browse archive
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
