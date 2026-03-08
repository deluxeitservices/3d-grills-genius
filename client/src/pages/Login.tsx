import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/account");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-md">
        <h1 data-testid="text-login-title" className="text-3xl md:text-4xl font-serif mb-2 text-center">Login</h1>
        <p className="text-white/60 text-center mb-10">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div data-testid="text-login-error" className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm uppercase tracking-wider text-white/60 mb-2">Email</label>
            <Input
              data-testid="input-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-zinc-900 border-white/10 text-white rounded-none py-6 focus-visible:border-primary focus-visible:ring-0"
              required
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-wider text-white/60 mb-2">Password</label>
            <div className="relative">
              <Input
                data-testid="input-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-zinc-900 border-white/10 text-white rounded-none py-6 pr-12 focus-visible:border-primary focus-visible:ring-0"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            data-testid="button-login"
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-zinc-200 rounded-none py-6 uppercase tracking-widest font-medium"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-center text-white/60 text-sm">
            Don't have an account?{" "}
            <Link href="/register">
              <a data-testid="link-register" className="text-primary hover:underline">Create one</a>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
