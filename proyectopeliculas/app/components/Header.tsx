import Link from "next/link";
import { User } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header
      style={{
        width: "100%",
        background: "#000000",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
        }}
      >
        <img
          src="/Logo.jpeg"
          alt="QuickBet Movies Logo"
          style={{
            height: "50px",
            objectFit: "contain",
          }}
        />

        <nav
          style={{
            display: "flex",
            gap: "32px",
          }}
        >
          <Link
            href="/"
            style={{
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "14px",
              opacity: 0.8,
              transition: "opacity 0.2s",
              fontWeight: "500",
            }}
          >
            Popular
          </Link>
          <Link
            href="/favorites"
            style={{
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "14px",
              opacity: 0.8,
              transition: "opacity 0.2s",
              fontWeight: "500",
            }}
          >
            Favorites
          </Link>
        </nav>
      </div>

      <button
        style={{
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
        }}
      >
        <User size={20} />
      </button>
    </header>
  );
};

export default Header;
