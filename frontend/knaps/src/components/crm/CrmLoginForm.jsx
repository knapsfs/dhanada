import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faSpinner,
  faCube,
  faCircleExclamation,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { crmService } from "../../services/crmService";

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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Decorative Element */}
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white py-10 px-8 sm:px-10 rounded-2xl shadow-xl shadow-slate-200/60 border border-gray-100">
          {/* Top Logo / Icon */}
          <div className="mb-6 flex justify-start">
            <div className="w-11 h-11 rounded-xl bg-slate-800 text-white flex items-center justify-center text-lg shadow-sm">
              <FontAwesomeIcon icon={faCube} />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-left">
            Sign In
          </h2>
          <p className="text-sm text-gray-500 mt-1 mb-7 text-left">
            Welcome! Please sign in to continue.
          </p>

          {/* Error Message */}
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
                  className="w-full bg-[#f4f7fb] border border-gray-200/90 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all"
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
                  className="w-full bg-[#f4f7fb] border border-gray-200/90 rounded-xl pl-9 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
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
                className="text-xs font-medium text-gray-500 hover:text-[#032e92] transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#111827] hover:bg-black text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
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
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <a
              href="/"
              className="flex items-center gap-1.5 hover:text-gray-800 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" />
              <span>Back to Website</span>
            </a>
            <span className="text-gray-400 font-medium">KNAPS Advisor Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
