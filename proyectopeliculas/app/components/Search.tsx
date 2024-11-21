"use client";
import React, { useState } from "react";

const Search: React.FC = () => {
  const [isGenresOpen, setIsGenresOpen] = useState(false);

  return (
    <div
      style={{
        padding: "15px",
        height: "100vh",
        width: "100%", // El ancho ahora se ajusta al contenedor padre
        backgroundColor: "#1e1e1e", // Fondo oscuro
        borderRight: "1px solid rgba(255, 255, 255, 0.1)", // Borde derecho
        overflowY: "auto", // Habilitar desplazamiento vertical si es necesario
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{
            color: "white",
            fontSize: "16px",
            marginBottom: "10px",
          }}
        >
          Search
        </h2>

        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Keywords"
            style={{
              flex: 1,
              backgroundColor: "#121212",
              border: "none",
              padding: "8px",
              color: "white",
              height: "32px",
            }}
          />
          <button
            style={{
              backgroundColor: "#232323",
              border: "none",
              padding: "8px",
              cursor: "pointer",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </div>

      <div>
        <h2
          style={{
            color: "white",
            fontSize: "16px",
            marginBottom: "10px",
          }}
        >
          Genres
        </h2>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setIsGenresOpen(!isGenresOpen)}
            style={{
              width: "100%",
              backgroundColor: "#121212",
              border: "none",
              padding: "8px",
              color: "#999999",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "32px",
            }}
          >
            <span>Select Genre</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                transform: isGenresOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {isGenresOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "#121212",
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 10,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              {[
                "Action",
                "Adventure",
                "Animation",
                "Comedy",
                "Crime",
                "Documentary",
                "Drama",
                "Family",
                "Fantasy",
                "History",
                "Horror",
                "Music",
                "Mystery",
              ].map((genre) => (
                <button
                  key={genre}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "none",
                    backgroundColor: "transparent",
                    color: "white",
                    textAlign: "left",
                    cursor: "pointer",
                    height: "32px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#333333";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
