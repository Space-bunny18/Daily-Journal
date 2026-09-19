import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import "./auth.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) {
        throw updateError;
      }

      setMessage(
  "Your password has been updated successfully."
);

setPassword("");
setConfirmPassword("");

setTimeout(() => {
  window.location.href = "/";
}, 1500);
    } catch (updateError) {
      setError(
        updateError?.message ||
          "Could not update your password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-background">
        <div className="auth-orb auth-orb-one" />
        <div className="auth-orb auth-orb-two" />
        <div className="auth-grid" />
      </div>

      <section className="auth-shell">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <Sparkles size={18} strokeWidth={1.8} />
          </div>

          <span>MYWORLD</span>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-eyebrow">
              <span />
              SECURE YOUR WORLD
            </div>

            <h1>
              Create a new
              <em> password.</em>
            </h1>

            <p>
              Choose a new password to get back into
              your private world.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="auth-field">
              <label htmlFor="reset-password">
                New password
              </label>

              <div className="auth-input-wrap">
                <LockKeyhole size={17} />

                <input
                  id="reset-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reset-confirm-password">
                Confirm new password
              </label>

              <div className="auth-input-wrap">
                <LockKeyhole size={17} />

                <input
                  id="reset-confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-message auth-message-error">
                {error}
              </div>
            )}

            {message && (
              <div className="auth-message auth-message-success">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="auth-primary-button"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Updating..."
                  : "Update password"}
              </span>

              {!loading && (
                <ArrowRight size={18} />
              )}
            </button>
          </form>
        </div>

        <p className="auth-footer">
          Your diary. Your world. <span>✦</span>{" "}
          Yours alone.
        </p>
      </section>
    </main>
  );
}

export default ResetPassword;