import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Beef, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CowSlideshow from "@/components/CowSlideshow";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return toast.error(`Please wait ${cooldown}s before trying again`);
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Password reset link sent! Check your email.");
      setCooldown(60); // 1 minute cooldown for password reset
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return toast.error(`Please wait ${cooldown}s before trying again`);

    if (isSignUp) {
      const { isValid } = validatePassword(password);
      if (!isValid) {
        return toast.error("Password does not meet security requirements");
      }
      if (password !== confirmPassword) {
        return toast.error("Passwords do not match");
      }
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Account created! Check your email to verify.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setCooldown(5); // Small cooldown on failed login
          throw error;
        }
        toast.success("Welcome back!");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordQuality = validatePassword(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <CowSlideshow />
      <Card className="w-full max-w-md relative z-20 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-primary rounded-full p-3">
              <Beef className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Godwin Dairy Farm</CardTitle>
          <p className="text-muted-foreground text-sm">{isForgot ? "Enter your email to reset your password" : isSignUp ? "Create your account" : "Sign in to your account"}</p>
        </CardHeader>
        <CardContent>
          {isForgot ? (
            <>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Button type="submit" className="w-full" disabled={loading || cooldown > 0}>
                  {loading ? "Sending..." : cooldown > 0 ? `Wait ${cooldown}s` : "Send Reset Link"}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-4">
                <button className="text-primary underline" onClick={() => setIsForgot(false)}>Back to Sign In</button>
              </p>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
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

                {isSignUp && (
                  <>
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Confirm Password" 
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
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-email"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label htmlFor="remember-email" className="text-sm text-muted-foreground">
                    Remember me
                  </label>
                </div>

                <Button type="submit" className="w-full" disabled={loading || cooldown > 0}>
                  {loading ? "Loading..." : cooldown > 0 ? `Wait ${cooldown}s` : (isSignUp ? "Sign Up" : "Sign In")}
                </Button>

                {cooldown > 0 && (
                  <p className="text-[10px] text-center text-destructive flex items-center justify-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Rate limit active. Please wait.
                  </p>
                )}
              </form>
              <div className="text-center text-sm text-muted-foreground mt-4 space-y-2">
                {!isSignUp && (
                  <p><button className="text-primary underline" onClick={() => setIsForgot(true)}>Forgot password?</button></p>
                )}
                <p>
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button className="text-primary underline" onClick={() => {
                    setIsSignUp(!isSignUp);
                    setPassword("");
                    setConfirmPassword("");
                  }}>
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
