"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CircleUserRound } from "lucide-react";
import SignUpModal from "../pages/auth/login";
import SignUpComponent from "../pages/auth/signup";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onToggleFavorites: () => void;
  showFavorites: boolean;
}

// Separamos los estilos en un objeto fuera del componente
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
    position: "relative",
    height: "50px", // Altura fija para el contenedor del logo
    width: "auto",
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
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
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
  dropdownMenu: {
    position: "absolute" as const,
    top: "100%",
    right: "0",
    backgroundColor: "#18181B",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "8px 0",
    marginTop: "8px",
    minWidth: "150px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  menuItem: {
    display: "block",
    width: "100%",
    padding: "8px 16px",
    border: "none",
    background: "none",
    color: "white",
    textAlign: "left" as const,
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  menuEmail: {
    padding: "8px 16px",
    color: "#999",
    fontSize: "12px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
} as const;

const Header: React.FC<HeaderProps> = ({
  onToggleFavorites,
  showFavorites,
}) => {
  const { user, signOut } = useAuth();
  const [currentModal, setCurrentModal] = useState<"none" | "login" | "signup">(
    "none"
  );
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCloseModal = () => setCurrentModal("none");
  const handleSwitchToSignUp = () => setCurrentModal("signup");
  const handleSwitchToLogin = () => setCurrentModal("login");
  const handleButtonClick = () => setShowMenu(!showMenu);

  const handleLogin = () => {
    setShowMenu(false);
    setCurrentModal("login");
  };

  const handleLogout = async () => {
    if (window.confirm("¿Estás seguro que deseas cerrar sesión?")) {
      await signOut();
      setShowMenu(false);
    }
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <Link href="/">
            <div
              style={{ position: "relative", width: "150px", height: "50px" }}
            >
              <Image
                src="/Logo.jpeg"
                alt="QuickBet Movies Logo"
                fill
                sizes="150px"
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </Link>

          <nav style={styles.nav}>
            <Link
              href="/"
              style={{
                ...styles.link,
                opacity: !showFavorites ? 1 : 0.8,
                color: !showFavorites ? "#FBBF24" : "#ffffff",
              }}
            >
              Popular
            </Link>
            <button
              onClick={onToggleFavorites}
              style={{
                ...styles.link,
                opacity: showFavorites ? 1 : 0.8,
                color: showFavorites ? "#FBBF24" : "#ffffff",
              }}
            >
              Favorites
            </button>
          </nav>
        </div>

        <div style={{ position: "relative" }}>
          <button
            ref={buttonRef}
            onClick={handleButtonClick}
            style={{
              ...styles.userButton,
              borderColor: user ? "#FBBF24" : "white",
              color: user ? "#FBBF24" : "white",
            }}
          >
            <CircleUserRound size={50} />
          </button>

          {showMenu && (
            <div ref={menuRef} style={styles.dropdownMenu}>
              {user ? (
                <>
                  <div style={styles.menuEmail}>{user.email}</div>
                  <button
                    onClick={handleLogout}
                    style={{
                      ...styles.menuItem,
                      color: "#ff4444",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 68, 68, 0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  style={styles.menuItem}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>
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
