import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      // Get the authorization code from URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const returnedState = urlParams.get("state");
      const storedState = sessionStorage.getItem("oauth_state");
      const error = urlParams.get("error");
      
      if (error || returnedState !== storedState) {
        setError("Authentication was cancelled or failed");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      if (!code) {
        setError("No authorization code received");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      const code_verifier = sessionStorage.getItem("code_verifier");

      const body = new URLSearchParams({
        code,
        client_id:
          import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "YOUR_GOOGLE_CLIENT_SECRET", //this is dangerous, but for testing purposes. You can use a secret manager in production
        redirect_uri:
          import.meta.env.VITE_REDIRECT_URI ||
          `${window.location.origin}/auth/callback`,
        grant_type: "authorization_code",
        code_verifier: code_verifier || "",
      });

      try {
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        });

        const tokenData = await tokenRes.json();

        if (tokenData.error) throw new Error(tokenData.error_description);

        // Optional: fetch user info using access token
        const userRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
            },
          }
        );

        const user = await userRes.json();

        // Store token & user securely
        sessionStorage.setItem("google_token", tokenData.access_token);
        sessionStorage.setItem("user", JSON.stringify(user));

        // Redirect to Index
        navigate("/index");
      } catch (err) {
        setError("Authentication failed. Please try again.");
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl text-white mb-2">Signing you in...</h2>
          <p className="text-gray-400">
            Please wait while we set up your account
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-red-400 text-xl mb-4">Authentication Error</div>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Redirecting you back to the home page...
          </p>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default GoogleAuthCallback;
