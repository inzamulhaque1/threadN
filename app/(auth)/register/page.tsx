"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, User, ArrowLeft, Sparkles, Eye, EyeOff } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    // First register the user
    const result = await authApi.register({ email, password, name });

    if (result.success) {
      // Then sign in with credentials
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Registration successful but login failed. Please login manually.");
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      setError(result.error || "Registration failed");
    }

    setIsLoading(false);
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-20 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-sm relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        <div className="glass-card p-6 sm:p-8 border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-2xl">
          {/* Logo */}
          <div className="text-center mb-5">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="ThreadN"
                width={140}
                height={40}
                className="h-9 w-auto mx-auto"
                priority
              />
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="text-2xl font-bold mb-1 text-white">
              Create account
            </h1>
            <p className="text-gray-400 text-sm">
              Start creating viral content
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 bg-white/[0.03] border-white/10 focus:border-purple-500/50 rounded-lg px-4"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 bg-white/[0.03] border-white/10 focus:border-purple-500/50 rounded-lg px-4"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 bg-white/[0.03] border-white/10 focus:border-purple-500/50 rounded-lg px-4 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 font-semibold rounded-lg group"
              isLoading={isLoading}
            >
              <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              Create Account
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gray-900/80 text-gray-500">or</span>
            </div>
          </div>

          {/* Google Signup Button */}
          <Button
            type="button"
            variant="glass"
            className="w-full h-10 flex items-center justify-center gap-2 rounded-lg border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all"
            onClick={handleGoogleSignup}
            isLoading={isGoogleLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-gray-400 mt-5 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign in
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-4 leading-relaxed">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link>
            {" & "}
            <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
