import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import "./auth.css";

function Auth({ onAuthenticated }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resetMessages = () => {
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    resetMessages();

    const cleanEmail = email.trim();
    const cleanName = name.trim();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (isSignUp && !cleanName) {
      setError("Please enter your name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } =
          await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                full_name: cleanName,
              },
            },
          });

        if (signUpError) {
            throw signUpError;
            }

            if (
            data.user &&
            Array.isArray(data.user.identities) &&
            data.user.identities.length === 0
            ) {
            setError(
                "An account with this email already exists. Please sign in instead."
            );
            return;
            }

            if (data.session) {
            setMessage("Your account has been created.");

            if (onAuthenticated) {
                onAuthenticated(data.session.user);
            }
            } else {
            setMessage(
                "Account created. Check your email to confirm your account."
            );
            }
      } else {
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

        if (signInError) {
          throw signInError;
        }

        setMessage("Welcome back.");

        if (onAuthenticated) {
          onAuthenticated(data.user);
        }
      }
    } catch (authError) {
      setError(
        authError?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    resetMessages();
    setIsSignUp((current) => !current);
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
              YOUR PRIVATE WORLD
            </div>

            <h1>
              {isSignUp ? (
                <>
                  Create your
                  <em> world.</em>
                </>
              ) : (
                <>
                  Welcome
                  <em> back.</em>
                </>
              )}
            </h1>

            <p>
              {isSignUp
                ? "Start keeping the moments, thoughts, and little things that make you who you are."
                : "Your memories, your moments, your world — waiting for you."}
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            {isSignUp && (
              <div className="auth-field">
                <label htmlFor="auth-name">
                  Your name
                </label>

                <div className="auth-input-wrap">
                  <input
                    id="auth-name"
                    type="text"
                    placeholder="What should we call you?"
                    autoComplete="name"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="auth-email">
                Email address
              </label>

              <div className="auth-input-wrap">
                <Mail size={17} />

                <input
                  id="auth-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="auth-password">
                  Password
                </label>

                {!isSignUp && (
                  <button
                    type="button"
                    className="auth-forgot"
                    onClick={async () => {
                    resetMessages();

                    const cleanEmail = email.trim();

                    if (!cleanEmail) {
                        setError(
                        "Enter your email address first."
                        );
                        return;
                    }

                    setLoading(true);

                    try {
                        const { error: resetError } =
                        await supabase.auth.resetPasswordForEmail(
                            cleanEmail,
                            {
                            redirectTo:
                                `${window.location.origin}/`,
                            }
                        );

                        if (resetError) {
                        throw resetError;
                        }

                        setMessage(
                        "Password reset email sent. Check your inbox."
                        );
                    } catch (resetError) {
                        setError(
                        resetError?.message ||
                            "Could not send the password reset email."
                        );
                    } finally {
                        setLoading(false);
                    }
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div className="auth-input-wrap">
                <LockKeyhole size={17} />

                <input
                  id="auth-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  autoComplete={
                    isSignUp
                      ? "new-password"
                      : "current-password"
                  }
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

            {isSignUp && (
              <label className="auth-checkbox">
                <input type="checkbox" />

                <span>
                  I understand that my diary is
                  private to my account.
                </span>
              </label>
            )}

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
                  ? isSignUp
                    ? "Creating..."
                    : "Signing in..."
                  : isSignUp
                    ? "Create my world"
                    : "Enter my world"}
              </span>

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="auth-google-button"
            onClick={async () => {
              resetMessages();
              setLoading(true);

              try {
                const { error } =
                  await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                      redirectTo: window.location.origin,
                    },
                  });

                if (error) {
                  throw error;
                }
              } catch (oauthError) {
                setError(
                  oauthError?.message ||
                    "Could not continue with Google."
                );
                setLoading(false);
              }
            }}
          >
            <span className="google-mark">
              G
            </span>

            <span>Continue with Google</span>
          </button>

          <div className="auth-switch">
            <span>
              {isSignUp
                ? "Already have a world?"
                : "New to MyWorld?"}
            </span>

            <button
              type="button"
              onClick={switchMode}
            >
              {isSignUp
                ? "Sign in"
                : "Create an account"}
            </button>
          </div>
        </div>

        <p className="auth-footer">
          Your diary. Your world. <span>✦</span>{" "}
          Yours alone.
        </p>
      </section>
    </main>
  );
}

export default Auth;