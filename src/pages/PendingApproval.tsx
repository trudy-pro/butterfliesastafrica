import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clock, ShieldCheck, X, LogOut, Loader2, Camera, Upload, ArrowRight } from "lucide-react";
import type { User } from "@supabase/supabase-js";

type ApprovalStatus = "none" | "pending" | "approved" | "rejected" | "admin";
type UserIntent = "contributor" | "analyst" | null;

const PendingApproval = () => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<ApprovalStatus>("none");
  const [intent, setIntent] = useState<UserIntent>(null);
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
      <div className="max-w-lg w-full border border-border rounded-lg p-8 bg-card shadow-sm">
        {/* Status display */}
        {status === "none" && !intent && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display text-foreground">Welcome to Afro Wingspan</h1>
              <p className="text-sm font-body text-muted-foreground mt-2">
                What would you like to do?
              </p>
            </div>
            <div className="grid gap-3 pt-4">
              <button
                onClick={() => setIntent("analyst")}
                className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Camera className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-body font-medium text-foreground">Identify Butterflies</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload photos to identify species. Request to add discoveries to the archive.
                  </p>
                </div>
              </button>
              <button
                onClick={() => setIntent("contributor")}
                className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-body font-medium text-foreground">Become a Contributor</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get approval to directly add specimens to the archive collection.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Analyst intent */}
        {status === "none" && intent === "analyst" && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display text-foreground">Identify Butterflies</h1>
              <p className="text-sm font-body text-muted-foreground mt-2">
                Upload photos to identify species using AI. When you find something interesting, you can request to add it to the archive for review.
              </p>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <Button onClick={() => navigate("/")} className="w-full font-body">
                Browse Archive & Identify
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={() => setIntent(null)} className="w-full font-body">
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Contributor intent */}
        {status === "none" && intent === "contributor" && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display text-foreground">Request Contributor Access</h1>
              <p className="text-sm font-body text-muted-foreground mt-2">
                Contributors can directly add specimens to the archive. An admin will review your request.
              </p>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <Button onClick={requestApproval} disabled={requesting} className="w-full font-body">
                {requesting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {requesting ? "Submitting..." : "Submit Request"}
              </Button>
              <Button variant="outline" onClick={() => setIntent(null)} className="w-full font-body">
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Pending status */}
        {status === "pending" && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display text-foreground">Request Pending</h1>
              <p className="text-sm font-body text-muted-foreground mt-2">
                Your contributor request is being reviewed by an admin. In the meantime, you can still browse the archive and identify butterflies.
              </p>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <Button onClick={() => navigate("/")} className="w-full font-body">
                Browse Archive
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Rejected status */}
        {status === "rejected" && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <X className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-display text-foreground">Request Declined</h1>
              <p className="text-sm font-body text-muted-foreground mt-2">
                Your contributor access request was not approved. You can still use the archive to identify butterflies.
              </p>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <Button onClick={() => navigate("/")} className="w-full font-body">
                Browse Archive
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Sign out button (always visible) */}
        <div className="mt-6 pt-4 border-t border-border">
          <Button variant="ghost" onClick={handleSignOut} className="w-full font-body text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Sign out & browse as guest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
