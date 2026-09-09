import {
  Eye,
  EyeOff,
  Loader2,
  LockIcon,
  MailIcon,
  MessageSquare,
  User,
} from "lucide-react";
import React from "react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [forms, setForms] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isSigningUp, signup } = useAuthStore();

  const validateForms = () => {
    if (!forms.fullName.trim()) return toast.error("Full name is required");
    if (!forms.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(forms.email))
      return toast.error("Invalid email format");
    if (!forms.password) return toast.error("Password is required");
    if (forms.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleChange = (e) => {
    setForms((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForms();

    if (success === true) signup(forms);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="size-5 text-base-content/40" />
                </div>

                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="John Doe"
                  value={forms.fullName}
                  name="fullName"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <MailIcon className="size-5 text-base-content/40" />
                </div>

                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="you@email.com"
                  value={forms.email}
                  name="email"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <LockIcon className="size-5 text-base-content/40" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  value={forms.password}
                  placeholder="******"
                  name="password"
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => {
                    setShowPassword((pre) => !pre);
                  }}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
}

export default SignupPage;
