import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Beef, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    // Also check hash for type=recovery
    if (window.location.hash.includes("type=recovery") || window.location.href.includes("type=recovery")) {
      setReady(true);
    }
    return () => subscription.unsubscribe();
  }, []);

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    
    return {
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
      checks: { minLength, hasUpper, hasLower, hasNumber, hasSpecial }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid } = validatePassword(password);
    if (!isValid) {
      toast.error("Password does not meet security requirements");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated! Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordQuality = validatePassword(password);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Verifying reset link...</p>
          <Button variant="ghost" onClick={() => navigate("/login")}>Back to login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-primary rounded-full p-3">
              <Beef className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Set New Password</CardTitle>
          <p className="text-muted-foreground text-sm">Enter your new password below</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="New password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="Confirm new password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />

            <div className="bg-muted/50 p-3 rounded-md text-xs space-y-1">
              <p className="font-semibold mb-1 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Password Requirements:
              </p>
              <div className="grid grid-cols-2 gap-x-2">
                <p className={passwordQuality.checks.minLength ? "text-success" : "text-muted-foreground"}>
                  • At least 8 characters
                </p>
                <p className={passwordQuality.checks.hasUpper ? "text-success" : "text-muted-foreground"}>
                  • One uppercase letter
                </p>
                <p className={passwordQuality.checks.hasLower ? "text-success" : "text-muted-foreground"}>
                  • One lowercase letter
                </p>
                <p className={passwordQuality.checks.hasNumber ? "text-success" : "text-muted-foreground"}>
                  • One number
                </p>
                <p className={passwordQuality.checks.hasSpecial ? "text-success" : "text-muted-foreground"}>
                  • One special character
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
