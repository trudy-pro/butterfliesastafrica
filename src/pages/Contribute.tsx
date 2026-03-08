import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, Camera, Loader2, X, Trash2, Clock, ShieldCheck } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Submission {
  id: string;
  image_path: string;
  status: string;
  common_name: string | null;
  scientific_name: string | null;
  family: string | null;
  colors: string[] | null;
  pattern: string | null;
  wing_shape: string | null;
  habitat: string | null;
  description: string | null;
  confidence: string | null;
  created_at: string;
}

type ApprovalStatus = "none" | "pending" | "approved" | "rejected" | "admin";

const Contribute = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>("none");
  const [requesting, setRequesting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkApprovalStatus = useCallback(async (userId: string) => {
    // Check if admin
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (roles?.some((r: any) => r.role === "admin")) {
      setApprovalStatus("admin");
      return;
    }
    // Check contributor approval
    const { data: approval } = await supabase
      .from("contributor_approvals")
      .select("status")
      .eq("user_id", userId)
      .maybeSingle();
    if (!approval) {
      setApprovalStatus("none");
    } else {
      setApprovalStatus(approval.status as ApprovalStatus);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) navigate("/auth");
      else checkApprovalStatus(u.id);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) { navigate("/auth"); return; }
      checkApprovalStatus(u.id);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [navigate, checkApprovalStatus]);

  const fetchSubmissions = useCallback(async () => {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setSubmissions(data as unknown as Submission[]);
  }, []);

  useEffect(() => {
    if (user && (approvalStatus === "approved" || approvalStatus === "admin")) fetchSubmissions();
  }, [user, approvalStatus, fetchSubmissions]);

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
      setApprovalStatus("pending");
      toast({ title: "Request submitted", description: "An admin will review your request." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setRequesting(false);
    }
  };

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from("specimen-photos").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleUploadAndAnalyze = async (file: File) => {
    if (!user) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please upload an image file", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Image must be under 10MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("specimen-photos")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: submission, error: insertError } = await supabase
        .from("submissions")
        .insert({ user_id: user.id, image_path: filePath, status: "analyzing" })
        .select()
        .single();
      if (insertError) throw insertError;

      await fetchSubmissions();

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const { data: result, error: fnError } = await supabase.functions.invoke(
            "identify-butterfly",
            { body: { imageBase64: base64 } }
          );
          if (fnError) throw fnError;

          const updateData: Record<string, unknown> = {
            status: result.identified ? "completed" : "failed",
            common_name: result.commonName,
            scientific_name: result.scientificName,
            family: result.family,
            colors: result.colors,
            pattern: result.pattern,
            wing_shape: result.wingShape,
            habitat: result.habitat,
            description: result.description,
            confidence: result.confidence,
          };

          await supabase
            .from("submissions")
            .update(updateData)
            .eq("id", (submission as unknown as Submission).id);

          await fetchSubmissions();
          toast({ title: result.identified ? "Butterfly identified!" : "Could not identify", description: result.description?.slice(0, 100) });
        } catch (err: any) {
          await supabase
            .from("submissions")
            .update({ status: "failed", description: err.message })
            .eq("id", (submission as unknown as Submission).id);
          await fetchSubmissions();
          toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUploadAndAnalyze(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUploadAndAnalyze(file);
  };

  const handleDelete = async (sub: Submission) => {
    await supabase.storage.from("specimen-photos").remove([sub.image_path]);
    await supabase.from("submissions").delete().eq("id", sub.id);
    await fetchSubmissions();
    toast({ title: "Submission deleted" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const canUpload = approvalStatus === "approved" || approvalStatus === "admin";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          Back to archive
        </button>
        {approvalStatus === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="text-sm font-body text-foreground hover:text-muted-foreground transition-colors flex items-center gap-1"
          >
            <ShieldCheck size={14} />
            Admin Panel
          </button>
        )}
      </div>

      <div className="flex-1 px-6 pb-20 max-w-3xl mx-auto w-full">
        <div className="mb-10">
          <p className="text-sm font-body text-accent tracking-wide mb-1">
            Contributor Portal
          </p>
          <h1 className="text-3xl md:text-4xl font-display text-foreground">
            Submit a Specimen
          </h1>
          <p className="mt-2 text-sm font-body text-muted-foreground">
            Upload a butterfly photo for AI-powered identification and analysis.
          </p>
        </div>

        {/* Approval gate */}
        {!canUpload && (
          <div className="border border-border rounded-lg p-8 text-center space-y-4">
            {approvalStatus === "none" && (
              <>
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-body font-medium text-foreground">
                    Contributor access required
                  </p>
                  <p className="text-xs font-body text-muted-foreground mt-1">
                    Request access to upload and analyze butterfly specimens. An admin will review your request.
                  </p>
                </div>
                <Button
                  onClick={requestApproval}
                  disabled={requesting}
                  className="font-body text-sm"
                >
                  {requesting ? "Submitting..." : "Request Contributor Access"}
                </Button>
              </>
            )}
            {approvalStatus === "pending" && (
              <>
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto">
                  <Clock className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-body font-medium text-foreground">
                    Request pending
                  </p>
                  <p className="text-xs font-body text-muted-foreground mt-1">
                    Your contributor request is being reviewed by an admin. You'll be able to upload once approved.
                  </p>
                </div>
              </>
            )}
            {approvalStatus === "rejected" && (
              <>
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                  <X className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-body font-medium text-foreground">
                    Request declined
                  </p>
                  <p className="text-xs font-body text-muted-foreground mt-1">
                    Your contributor access request was not approved. Please contact the archive administrator.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Upload zone — only for approved */}
        {canUpload && (
          <>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragOver
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  <p className="text-sm font-body text-muted-foreground">
                    Uploading & analyzing...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <Camera className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-body text-foreground font-medium">
                      Drop a photo here or click to browse
                    </p>
                    <p className="text-xs font-body text-muted-foreground mt-1">
                      JPG, PNG, or WebP — max 10MB
                    </p>
                  </div>
                  <label>
                    <Button variant="outline" size="sm" className="font-body text-xs cursor-pointer" asChild>
                      <span>
                        <Upload size={12} className="mr-1" />
                        Choose File
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Submissions list */}
            {submissions.length > 0 && (
              <div className="mt-12">
                <h2 className="text-lg font-display text-foreground mb-4">
                  Your Submissions
                </h2>
                <div className="space-y-3">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex gap-4 p-4 rounded-lg bg-card border border-border"
                    >
                      <img
                        src={getPublicUrl(sub.image_path)}
                        alt={sub.common_name || "Specimen"}
                        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            {sub.status === "analyzing" && (
                              <div className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                                <Loader2 size={12} className="animate-spin" />
                                Analyzing...
                              </div>
                            )}
                            {sub.status === "completed" && (
                              <>
                                <p className="text-sm font-body font-medium text-foreground">
                                  {sub.common_name || "Unknown"}
                                </p>
                                <p className="text-xs font-body text-muted-foreground italic">
                                  {sub.scientific_name}
                                </p>
                              </>
                            )}
                            {sub.status === "failed" && (
                              <div className="flex items-center gap-1.5 text-xs font-body text-destructive">
                                <X size={12} />
                                Could not identify
                              </div>
                            )}
                            {sub.status === "pending" && (
                              <p className="text-xs font-body text-muted-foreground">Pending</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDelete(sub)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {sub.status === "completed" && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {sub.family && (
                              <span className="text-[10px] font-body px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                                {sub.family}
                              </span>
                            )}
                            {sub.pattern && (
                              <span className="text-[10px] font-body px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                                {sub.pattern}
                              </span>
                            )}
                            {sub.confidence && (
                              <span className={`text-[10px] font-body px-2 py-0.5 rounded-full ${
                                sub.confidence === "high"
                                  ? "bg-accent/10 text-accent"
                                  : "bg-secondary text-secondary-foreground"
                              }`}>
                                {sub.confidence} confidence
                              </span>
                            )}
                          </div>
                        )}
                        {sub.description && sub.status === "completed" && (
                          <p className="mt-2 text-xs font-body text-muted-foreground line-clamp-2">
                            {sub.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Contribute;
