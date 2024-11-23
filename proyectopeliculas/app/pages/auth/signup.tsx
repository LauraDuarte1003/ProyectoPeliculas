"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { CircleArrowLeft, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

// Crear el cliente de Supabase directamente
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SignUpProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

interface AuthError {
  message: string;
}

const SignUpComponent: React.FC<SignUpProps> = ({
  onClose,
  onSwitchToLogin,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      alert("Check your email for the confirmation link!");
      onClose();
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: isMobile ? "20px" : 0,
      background: "rgba(0, 0, 0, 0.5)",
    },

    modal: {
      width: isMobile ? "100%" : "90%",
      maxWidth: isMobile ? "400px" : "1152px",
      maxHeight: isMobile ? "600px" : "none",
      backdropFilter: "blur(15px)",
      borderRadius: "24px",
      overflow: "hidden",
      border: "1px solid white",
      margin: "auto",
    },

    content: {
      display: "flex",
      width: "100%",
      flexDirection: isMobile ? ("column" as const) : ("row" as const),
      height: isMobile ? "100%" : "auto",
    },

    leftSide: {
      width: isMobile ? "100%" : "70%",
      minHeight: isMobile ? "560px" : "600px",
      padding: isMobile ? "20px" : "32px",
      position: "relative" as const,
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
    },

    rightSide: {
      display: isMobile ? "none" : "flex",
      width: "calc(50% - 8px)",
      minHeight: "600px",
      margin: "15px 15px 15px 15px",
      padding: "48px 48px 0 48px",
      background: "#18181B",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "flex-start",
      borderRadius: "16px 16px 0 0",
      position: "relative" as const,
      overflow: "hidden",
    },

    backButton: {
      position: "absolute" as const,
      top: isMobile ? "16px" : "36px",
      left: isMobile ? "16px" : "36px",
      background: "none",
      border: "none",
      color: "white",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      fontSize: isMobile ? "14px" : "16px",
    },

    buttonsTop: {
      position: "absolute" as const,
      top: isMobile ? "60px" : "100px",
      display: "flex",
      gap: "0",
      justifyContent: "center",
      width: "100%",
      background: "rgba(255, 255, 255, 0.1)",
      maxWidth: isMobile ? "180px" : "200px",
      padding: "4px",
      borderRadius: "8px",
    },

    buttonYellow: {
      padding: "8px 24px",
      background: "#FBBF24",
      border: "none",
      borderRadius: "6px",
      color: "black",
      cursor: "pointer",
      fontWeight: 500,
      fontSize: "12px",
      flex: 1,
      transition: "all 0.2s ease",
    },

    buttonTransparent: {
      padding: "8px 24px",
      background: "transparent",
      border: "none",
      borderRadius: "6px",
      color: "white",
      cursor: "pointer",
      fontWeight: 500,
      fontSize: "12px",
      flex: 1,
      transition: "all 0.2s ease",
    },

    formContainer: {
      width: "100%",
      maxWidth: "350px",
      marginTop: isMobile ? "140px" : "240px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "16px",
      alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? "0 20px" : "0",
    },

    inputContainer: {
      position: "relative" as const,
      width: "100%",
      display: "flex",
      justifyContent: "center",
    },

    input: {
      width: "90%",
      padding: "11px",
      backgroundColor: "white",
      border: "1px solid #ccc",
      borderRadius: "8px 8px 0 0",
      fontSize: "12px",
      color: "black",
    },

    passwordToggle: {
      position: "absolute" as const,
      right: "10%",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#6B7280",
    },

    registerButton: {
      width: "90%",
      padding: "11px",
      backgroundColor: "#FBBF24",
      border: "none",
      borderRadius: "4px",
      color: "black",
      fontSize: "12px",
      fontWeight: 600,
      cursor: "pointer",
      marginTop: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },

    title: {
      color: "white",
      fontSize: isMobile ? "28px" : "36px",
      fontWeight: "bold",
      marginBottom: "16px",
      textAlign: "center" as const,
    },

    description: {
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: isMobile ? "16px" : "18px",
      textAlign: "center" as const,
      marginBottom: "32px",
      maxWidth: "400px",
      lineHeight: "1.5",
    },

    footerText: {
      position: "absolute" as const,
      bottom: isMobile ? "16px" : "24px",
      fontSize: "12px",
      left: 0,
      right: 0,
      textAlign: "center" as const,
      color: "rgba(255, 255, 255, 0.6)",
      marginBottom: isMobile ? "0" : "80px",
    },

    errorText: {
      color: "red",
      textAlign: "center" as const,
      marginBottom: "10px",
      fontSize: "12px",
    },

    avatarContainer: {
      position: "relative" as const,
      width: isMobile ? "280px" : "380px",
      height: isMobile ? "280px" : "380px",
      marginTop: "auto",
    },
  };

  return (
    <div
      style={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={styles.modal}>
        <div style={styles.content}>
          <div style={styles.leftSide}>
            <button style={styles.backButton} onClick={onClose}>
              <CircleArrowLeft size={20} />
              <span>Back</span>
            </button>

            <div style={styles.buttonsTop}>
              <button
                style={styles.buttonTransparent}
                onClick={onSwitchToLogin}
              >
                Log In
              </button>
              <button style={styles.buttonYellow}>Sign up</button>
            </div>

            {!showForm ? (
              <div style={styles.formContainer}>
                <button
                  style={styles.registerButton}
                  onClick={() => setShowForm(true)}
                >
                  Register with your Email ✉
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignUp} style={styles.formContainer}>
                {error && <div style={styles.errorText}>{error}</div>}

                <div style={styles.inputContainer}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.inputContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                  />
                  <button
                    type="button"
                    style={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  style={{
                    ...styles.registerButton,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Register with Email"} ✉
                </button>
              </form>
            )}

            <div style={styles.footerText}>
              For any questions, reach out to support@quickbetmovies.com
            </div>
          </div>

          <div style={styles.rightSide}>
            <div>
              <h1 style={styles.title}>Welcome to Quickbet Movies!</h1>
              <p style={styles.description}>
                🎬 Ready to unlock a universe of cinematic delights? Sign up now
                and start your journey with us!
              </p>
            </div>

            <div style={styles.avatarContainer}>
              <Image
                src="/signup.png"
                alt="3D Avatar"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpComponent;
