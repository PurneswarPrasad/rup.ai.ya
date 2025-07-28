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
      try {
        // Get the authorization code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");

        if (error) {
          setError("Authentication was cancelled or failed");
          setTimeout(() => navigate("/"), 3000);
          return;
        }

        if (!code) {
          setError("No authorization code received");
          setTimeout(() => navigate("/"), 3000);
          return;
        }

        // Here you would typically exchange the code for tokens
        // For now, we'll simulate a successful login
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Store user session (replace with actual user data from your backend)
        const userData = {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          picture:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        };

        localStorage.setItem("user", JSON.stringify(userData));

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
