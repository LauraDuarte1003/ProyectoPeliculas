"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import SignUpModal from "../pages/auth/login";
import SignUpComponent from "../pages/auth/signup";

const styles = {
  header: {
    width: "100%",
    background: "#000000",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "12px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative" as const,
    zIndex: 1,
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },

  logo: {
    height: "50px",
    objectFit: "contain" as const,
  },

  nav: {
    display: "flex",
    gap: "32px",
  },

  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "14px",
    opacity: 0.8,
    transition: "opacity 0.2s",
    fontWeight: "500",
  },

  userButton: {
    background: "none",
    border: "2px solid white",
    borderRadius: "50%",
    cursor: "pointer",
    padding: "8px",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    transition: "all 0.2s",
  },
} as const;

const Header: React.FC = () => {
  const [currentModal, setCurrentModal] = useState<"none" | "login" | "signup">(
    "none"
  );

  const handleCloseModal = () => {
    setCurrentModal("none");
  };

  const handleSwitchToSignUp = () => {
    setCurrentModal("signup");
  };

  const handleSwitchToLogin = () => {
    setCurrentModal("login");
  };

  const handleOpenModal = () => {
    setCurrentModal("login");
  };

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "transparent";
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img
            src="/Logo.jpeg"
            alt="QuickBet Movies Logo"
            style={styles.logo}
          />

          <nav style={styles.nav}>
            <Link href="/" style={styles.link}>
              Popular
            </Link>
            <Link href="/favorites" style={styles.link}>
              Favorites
            </Link>
          </nav>
        </div>

        <button
          onClick={handleOpenModal}
          style={styles.userButton}
          onMouseOver={handleButtonHover}
          onMouseOut={handleButtonLeave}
        >
          <User size={20} />
        </button>
      </header>

      {currentModal === "login" && (
        <SignUpModal
          onClose={handleCloseModal}
          onSwitchToSignUp={handleSwitchToSignUp}
        />
      )}

      {currentModal === "signup" && (
        <SignUpComponent
          onClose={handleCloseModal}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </>
  );
};

export default Header;
