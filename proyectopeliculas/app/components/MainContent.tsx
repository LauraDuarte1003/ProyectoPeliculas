"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "07ae841cba8689091077a34ea07ab14d"; // Coloca tu clave de TMDb aquí
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface Movie {
  id: number;
  title: string;
  releaseDate: string;
  image: string;
}

const MainContent: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Llama a la API de TMDb
  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
      );

      const fetchedMovies = response.data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        releaseDate: movie.release_date.split("-")[0], // Extrae el año
        image: movie.poster_path
          ? `${IMAGE_BASE_URL}${movie.poster_path}`
          : "/placeholder.jpg", // Póster por defecto si falta
      }));

      setMovies(fetchedMovies);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#454545",
        color: "white",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "20px", fontSize: "1.5em" }}>
        Popular Movies
      </h2>

      {isLoading ? (
        <p>Loading movies...</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              style={{
                width: "200px",
                backgroundColor: "#2c2c2c",
                borderRadius: "10px",
                overflow: "hidden",
                textAlign: "center",
              }}
            >
              {/* Imagen de la película */}
              <div
                style={{
                  height: "300px",
                  backgroundColor: "#333",
                }}
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg"; // Imagen por defecto si falla
                  }}
                />
              </div>

              {/* Título y año */}
              <div
                style={{
                  padding: "10px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.2em",
                    color: "white",
                  }}
                >
                  {movie.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9em",
                    color: "#aaa",
                  }}
                >
                  {movie.releaseDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainContent;
