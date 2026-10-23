import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faSpinner,
  faCircleExclamation,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { crmService } from "../../services/crmService";
import knapsLogo from "../../assets/knaps-logo.webp";

export default function CrmLoginForm({ onLoginSuccess }) {
  const [usr, setUsr] = useState("Administrator");
  const [pwd, setPwd] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usr.trim() || !pwd) {
      setError("Please enter both email/username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await crmService.login(usr.trim(), pwd);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid login credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f7fc] via-[#eef3fb] to-[#e6edf9] flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient decorative brand glows matching website */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#032e92]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#2490ef]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-sm py-9 px-8 sm:px-10 rounded-3xl shadow-xl shadow-blue-950/10 border border-slate-200/80 relative overflow-hidden">
          {/* Top Brand Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#032e92] via-[#2490ef] to-[#021d63]" />

          {/* KNAPS Logo directly above Sign In */}
          <div className="mb-5 flex justify-center">
            <img
              src={knapsLogo}
              alt="KNAPS Logo"
              className="h-10 sm:h-11 w-auto object-contain"
            />
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 text-left">
            Sign In
          </h2>
          <p className="text-sm text-gray-500 mt-1 mb-6 text-left">
            Welcome! Please sign in to continue.
          </p>

          {/* Error Message Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-fadeIn">
              <FontAwesomeIcon icon={faCircleExclamation} className="text-red-500 shrink-0 text-sm" />
              <span className="leading-tight">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-left">
                Email
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"
                />
                <input
                  type="text"
                  value={usr}
                  onChange={(e) => setUsr(e.target.value)}
                  placeholder="Administrator or email"
                  required
                  autoFocus
                  className="w-full bg-[#f8fafc] border border-gray-200/90 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-left">
                Password
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#f8fafc] border border-gray-200/90 rounded-xl pl-9 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#032e92] cursor-pointer p-0.5 transition-colors"
                  tabIndex={-1}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-xs" />
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-0.5">
              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Please contact your Frappe System Administrator to reset your password.");
                }}
                className="text-xs font-semibold text-[#032e92] hover:text-[#021d63] transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-ripple w-full bg-gradient-to-r from-[#032e92] to-[#021d63] hover:from-[#021d63] hover:to-[#011442] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-lg hover:shadow-[#032e92]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </div>
          </form>

          {/* Quick Help / Desk Link */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center text-xs text-gray-500">
            <a
              href="/"
              className="flex items-center gap-1.5 font-medium text-gray-600 hover:text-[#032e92] transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" />
              <span>Back to Website</span>
            </a>

          </div>
        </div>
      </div>
    </div>
  );
}
