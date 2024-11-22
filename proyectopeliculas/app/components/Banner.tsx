"use client";
import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";

interface BannerProps {
  title: string;
  description: string;
  image: string;
  rating: number;
}

const Banner: React.FC = () => {
  const [movie, setMovie] = useState<BannerProps | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const fetchMovie = async () => {
      const apiKey = "07ae841cba8689091077a34ea07ab14d";
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
      );
      const data = await response.json();
      const movieData = data.results[0];
      setMovie({
        title: movieData.title,
        description: movieData.overview,
        image: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
        rating: movieData.vote_average * 10,
      });
    };

    fetchMovie();
  }, []);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  if (!movie) return <div>Loading...</div>;

  const getProgressColor = (rating: number) => {
    return rating <= 60 ? "#f44336" : "#4caf50";
  };

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
