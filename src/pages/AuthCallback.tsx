import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [hasHandled, setHasHandled] = useState(false);

  useEffect(() => {
    if (hasHandled) return;

    const handleAuthCallback = async () => {
      try {
        // First, try to get the current session
        const { data: initialData, error: initialError } = await supabase.auth.getSession();

        if (initialError) {
          console.error("Initial session error:", initialError);
        }

        if (initialData.session) {
          console.log("Session already available");
          setHasHandled(true);
          toast.success("Welcome back!");
          navigate("/", { replace: true });
          return;
        }

        // If no session, listen for the auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth callback state change:", event, session ? "session exists" : "no session");

          if (event === 'SIGNED_IN' && session && !hasHandled) {
            setHasHandled(true);
            toast.success("Welcome back!");
            navigate("/", { replace: true });
          } else if (event === 'SIGNED_OUT' && !hasHandled) {
            setHasHandled(true);
            toast.error("Authentication failed");
            navigate("/login");
          }
        });

        // Also set a timeout in case the auth state change doesn't fire
        const timeout = setTimeout(() => {
          if (!hasHandled) {
            setHasHandled(true);
            console.log("Auth callback timeout - checking session again");
            supabase.auth.getSession().then(({ data, error }) => {
              if (error) {
                console.error("Timeout session error:", error);
                toast.error("Authentication failed");
                navigate("/login");
              } else if (data.session) {
                toast.success("Welcome back!");
                navigate("/", { replace: true });
              } else {
                toast.error("Authentication failed - please try again");
                navigate("/login");
              }
            });
          }
        }, 5000); // 5 second timeout

        return () => {
          subscription.unsubscribe();
          clearTimeout(timeout);
        };
      } catch (err) {
        console.error("Auth callback exception:", err);
        if (!hasHandled) {
          setHasHandled(true);
          toast.error("Authentication failed");
          navigate("/login");
        }
      }
    };

    const cleanup = handleAuthCallback();
    return () => {
      cleanup?.then?.(fn => fn?.());
    };
  }, [navigate, hasHandled]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}