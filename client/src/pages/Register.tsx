import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const [, navigate] = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register({ email, password, firstName: firstName || undefined, lastName: lastName || undefined });
      navigate("/account");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-md">
        <h1 data-testid="text-register-title" className="text-3xl md:text-4xl font-serif mb-2 text-center">Create Account</h1>
        <p className="text-white/60 text-center mb-10">Join us for an exclusive experience</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div data-testid="text-register-error" className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm uppercase tracking-wider text-white/60 mb-2">First Name</label>
              <Input
                data-testid="input-first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="bg-zinc-900 border-white/10 text-white rounded-none py-6 focus-visible:border-primary focus-visible:ring-0"
              />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-wider text-white/60 mb-2">Last Name</label>
              <Input
                data-testid="input-last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="bg-zinc-900 border-white/10 text-white rounded-none py-6 focus-visible:border-primary focus-visible:ring-0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm uppercase tracking-wider text-white/60 mb-2">Email *</label>
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
            <label className="block text-sm uppercase tracking-wider text-white/60 mb-2">Password *</label>
            <div className="relative">
              <Input
                data-testid="input-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
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

          <div>
            <label className="block text-sm uppercase tracking-wider text-white/60 mb-2">Confirm Password *</label>
            <Input
              data-testid="input-confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="bg-zinc-900 border-white/10 text-white rounded-none py-6 focus-visible:border-primary focus-visible:ring-0"
              required
            />
          </div>

          <Button
            data-testid="button-register"
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-zinc-200 rounded-none py-6 uppercase tracking-widest font-medium"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          <p className="text-center text-white/60 text-sm">
            Already have an account?{" "}
            <Link href="/login">
              <a data-testid="link-login" className="text-primary hover:underline">Sign in</a>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
