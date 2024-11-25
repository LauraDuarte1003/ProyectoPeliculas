"use client";
import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
//import Image from "next/image";

const API_KEY = "68b79e4579985b0b418293b7b594d6e8";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

interface APIMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
}

interface MovieResponse {
  results: APIMovie[];
}

interface BannerMovie {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
  releaseDate: string;
}

const Banner = (): JSX.Element => {
  const [movie, setMovie] = useState<BannerMovie | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get<MovieResponse>(
          `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        );

        const movieData = response.data.results[0];
        if (!movieData) {
          throw new Error("No movie data available");
        }

        const releaseDate = new Date(movieData.release_date).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );

        setMovie({
          id: movieData.id,
          title: movieData.title,
          description: movieData.overview,
          image: `${IMAGE_BASE_URL}${movieData.backdrop_path}`,
          rating: Math.round(movieData.vote_average * 10),
          releaseDate,
        });

        const savedFavorites = localStorage.getItem("movieFavorites");
        if (savedFavorites) {
          const favorites = JSON.parse(savedFavorites) as { id: number }[];
          setIsFavorite(favorites.some((fav) => fav.id === movieData.id));
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch movie";
        console.error("Error fetching movie:", err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMovie();
  }, []);

  const toggleFavorite = (): void => {
    if (!movie) return;

    setIsFavorite((prev) => !prev);
    try {
      const savedFavorites = localStorage.getItem("movieFavorites");
      let favorites = savedFavorites
        ? (JSON.parse(savedFavorites) as BannerMovie[])
        : [];

      if (isFavorite) {
        favorites = favorites.filter((fav) => fav.id !== movie.id);
      } else {
        favorites.push({
          id: movie.id,
          title: movie.title,
          image: movie.image,
          rating: movie.rating,
          releaseDate: movie.releaseDate,
          description: movie.description,
        });
      }

      localStorage.setItem("movieFavorites", JSON.stringify(favorites));
    } catch (err) {
      console.error("Error managing favorites:", err);
    }
  };

  const getProgressColor = (rating: number): string => {
    return rating <= 60 ? "#f44336" : "#4caf50";
  };

  if (isLoading) {
    return (
      <div
        style={{
          height: "400px",
          backgroundColor: "#1a1a1a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        Loading featured movie...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: "400px",
          backgroundColor: "#1a1a1a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        Error: {error}
      </div>
    );
  }

  if (!movie) {
    return (
      <div
        style={{
          height: "400px",
          backgroundColor: "#1a1a1a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        No movie available
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        height: "400px",
        backgroundImage: `url(${movie.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        padding: "20px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "20px",
          zIndex: 1,
          maxWidth: "50%",
        }}
      >
        <h2
          style={{
            fontSize: "2em",
            fontWeight: "bold",
            margin: "0",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
          }}
        >
          {movie.title}
        </h2>
        <p
          style={{
            fontSize: "1.1em",
            color: "#FBBF24",
            margin: "8px 0",
          }}
        >
          {movie.releaseDate}
        </p>
        <p
          style={{
            fontSize: "1em",
            marginTop: "10px",
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
            lineHeight: "1.5",
          }}
        >
          {movie.description}
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <button
          onClick={toggleFavorite}
          style={{
            background: "none",
            border: "none",
            color: isFavorite ? "#f44336" : "white",
            fontSize: "1.5em",
            cursor: "pointer",
            marginRight: "10px",
          }}
          aria-label="Toggle Favorite"
        >
          <FaHeart />
        </button>

        <div style={{ position: "relative" }}>
          <svg viewBox="0 0 36 36" style={{ width: "100px", height: "100px" }}>
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={getProgressColor(movie.rating)}
              strokeWidth="2"
              strokeDasharray={`${movie.rating}, 100`}
            />
            <text
              x="18"
              y="20.35"
              fontSize="9"
              fill="white"
              textAnchor="middle"
            >
              {movie.rating}%
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Banner;
