import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6">
        <button
          onClick={() => navigate("/auth")}
          className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <p className="text-sm font-body text-accent tracking-wide mb-1">
              Account Recovery
            </p>
            <h1 className="text-3xl font-display text-foreground">
              {sent ? "Check Your\nEmail" : "Forgot\nPassword"}
            </h1>
            <p className="mt-3 text-sm font-body text-muted-foreground">
              {sent
                ? `We sent a reset link to ${email}. Check your inbox and follow the link to set a new password.`
                : "Enter your email and we'll send you a link to reset your password."}
            </p>
          </div>

          {!sent && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-body text-muted-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 h-12 font-body text-sm"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 font-body text-sm"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}

          {sent && (
            <Button
              variant="outline"
              className="w-full h-12 font-body text-sm"
              onClick={() => navigate("/auth")}
            >
              Back to Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
