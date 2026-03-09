import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, X, Loader2, ShieldCheck, BarChart3, Users } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

interface ApprovalRequest {
  id: string;
  user_id: string;
  email: string;
  display_name: string | null;
  status: string;
  requested_at: string;
}

type AdminTab = "contributors" | "analytics";

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("contributors");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/auth");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) navigate("/auth");
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdmin = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");
    const admin = (data?.length ?? 0) > 0;
    setIsAdmin(admin);
    if (!admin) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);

  const fetchRequests = useCallback(async () => {
    const { data } = await supabase
      .from("contributor_approvals")
      .select("*")
      .order("requested_at", { ascending: false });
    if (data) setRequests(data as unknown as ApprovalRequest[]);
  }, []);

  useEffect(() => {
    if (isAdmin) fetchRequests();
  }, [isAdmin, fetchRequests]);

  const handleDecision = async (requestId: string, status: "approved" | "rejected") => {
    if (!user) return;
    setProcessing(requestId);
    try {
      const { error } = await supabase
        .from("contributor_approvals")
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq("id", requestId);
      if (error) throw error;
      await fetchRequests();
      toast({ title: `Request ${status}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setProcessing(null);
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status !== "pending");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6">
        <button
          onClick={() => navigate("/contribute")}
          className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          Back to contribute
        </button>
      </div>

      <div className="flex-1 px-6 pb-20 max-w-4xl mx-auto w-full">
        <div className="mb-6">
          <p className="text-sm font-body text-accent tracking-wide mb-1">
            Administration
          </p>
          <h1 className="text-3xl md:text-4xl font-display text-foreground">
            Admin Dashboard
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("contributors")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-body border-b-2 transition-colors ${
              activeTab === "contributors"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users size={14} />
            Contributors
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-body border-b-2 transition-colors ${
              activeTab === "analytics"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 size={14} />
            Analytics
          </button>
        </div>

        {activeTab === "analytics" ? (
          <AnalyticsDashboard />
        ) : (
          <>
            {/* Pending requests */}
            {pending.length > 0 ? (
              <div className="space-y-3">
                <h2 className="text-sm font-body font-medium text-foreground mb-3">
                  Pending ({pending.length})
                </h2>
                {pending.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between gap-4 p-4 rounded-lg bg-card border border-border"
              >
                <div className="min-w-0">
                  <p className="text-sm font-body font-medium text-foreground truncate">
                    {req.display_name || req.email}
                  </p>
                  <p className="text-xs font-body text-muted-foreground truncate">
                    {req.email}
                  </p>
                  <p className="text-[10px] font-body text-muted-foreground mt-1">
                    {new Date(req.requested_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDecision(req.id, "rejected")}
                    disabled={processing === req.id}
                    className="font-body text-xs h-8"
                  >
                    <X size={12} className="mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDecision(req.id, "approved")}
                    disabled={processing === req.id}
                    className="font-body text-xs h-8"
                  >
                    {processing === req.id ? (
                      <Loader2 size={12} className="animate-spin mr-1" />
                    ) : (
                      <Check size={12} className="mr-1" />
                    )}
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-border rounded-lg p-8 text-center">
            <ShieldCheck className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-body text-muted-foreground">
              No pending requests
            </p>
          </div>
        )}

        {/* Resolved requests */}
        {resolved.length > 0 && (
          <div className="mt-10">
            <h2 className="text-sm font-body font-medium text-foreground mb-3">
              History
            </h2>
            <div className="space-y-2">
              {resolved.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-lg bg-card/50 border border-border/50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-body text-foreground truncate">
                      {req.display_name || req.email}
                    </p>
                    <p className="text-xs font-body text-muted-foreground truncate">
                      {req.email}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-body px-2 py-0.5 rounded-full flex-shrink-0 ${
                      req.status === "approved"
                        ? "bg-accent/10 text-accent"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
