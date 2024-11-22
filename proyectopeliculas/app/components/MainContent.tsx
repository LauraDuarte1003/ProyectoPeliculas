"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";

const API_KEY = "07ae841cba8689091077a34ea07ab14d";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface Movie {
  id: number;
  title: string;
  releaseDate: string;
  image: string;
  rating: number;
  favorites: boolean;
}

interface Category {
  name: string;
  movies: Movie[];
}

interface MainContentProps {
  searchResults: any[];
}

const MainContent: React.FC<MainContentProps> = ({ searchResults }) => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formattedResults, setFormattedResults] = useState<Movie[]>([]);

  const formatMovies = (movies: any[] = []): Movie[] => {
    if (!Array.isArray(movies)) return [];

    return movies.map((movie) => ({
      id: movie.id,
      title: movie.title || "",
      releaseDate: movie.release_date?.split("-")[0] || "",
      image: movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : "/placeholder.jpg",
      rating: Math.round((movie.vote_average || 0) * 10),
      favorites: false,
    }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [popularResponse, nowPlayingResponse] = await Promise.all([
          axios.get(
            `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
          ),
          axios.get(
            `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
          ),
        ]);

        setCategories([
          {
            name: "Popular Movies",
            movies: formatMovies(popularResponse.data.results),
          },
          {
            name: "Now Playing",
            movies: formatMovies(nowPlayingResponse.data.results),
          },
        ]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setFormattedResults(formatMovies(searchResults));
  }, [searchResults]);

  const toggleFavorite = (categoryIndex: number, movieId: number) => {
    setCategories((prev) =>
      prev.map((category, index) => {
        if (index === categoryIndex) {
          return {
            ...category,
            movies: category.movies.map((movie) =>
              movie.id === movieId
                ? { ...movie, favorites: !movie.favorites }
                : movie
            ),
          };
        }
        return category;
      })
    );
  };

  const toggleSearchFavorite = (movieId: number) => {
    setFormattedResults((prev) =>
      prev.map((movie) =>
        movie.id === movieId ? { ...movie, favorites: !movie.favorites } : movie
      )
    );
  };

  const getProgressColor = (rating: number) => {
    return rating <= 60 ? "#f44336" : "#4caf50";
  };

  const renderMovieCard = (
    movie: Movie,
    isCategoryMovie: boolean = false,
    categoryIndex: number = 0
  ) => (
    <div
      key={movie.id}
      style={{
        minWidth: "250px",
        maxWidth: "200px",
        backgroundColor: "#2c2c2c",
        borderRadius: "10px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
      }}
      onClick={() => router.push(`/movie/${movie.id}`)}
    >
      <div style={{ height: "300px", backgroundColor: "#333" }}>
        <img
          src={movie.image}
          alt={movie.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.jpg";
          }}
        />
      </div>

      <div
        style={{
          padding: "15px 10px",
          textAlign: "left",
          flex: "1",
          backgroundColor: "#000",
        }}
      >
        <h3
          style={{
            fontSize: "1.2em",
            marginBottom: "10px",
            fontWeight: "bold",
            color: "white",
          }}
        >
          {movie.title}
        </h3>
        <p style={{ fontSize: "0.9em", color: "#aaa" }}>{movie.releaseDate}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: "15px",
          }}
        >
          <div style={{ position: "relative" }}>
            <h3
              style={{
                fontSize: "0.8em",
                marginBottom: "10px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Rating
            </h3>
            <svg viewBox="0 0 36 36" style={{ width: "40px", height: "40px" }}>
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
                fontSize="7"
                fill="white"
                textAnchor="middle"
              >
                {movie.rating}%
              </text>
            </svg>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <h3
              style={{
                fontSize: "0.8em",
                marginBottom: "10px",
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
              }}
            >
              Favorite
            </h3>
            <button
              onClick={() =>
                isCategoryMovie
                  ? toggleFavorite(categoryIndex, movie.id)
                  : toggleSearchFavorite(movie.id)
              }
              style={{
                background: "none",
                border: "none",
                color: movie.favorites ? "red" : "white",
                fontSize: "1.5em",
                cursor: "pointer",
              }}
              aria-label="Toggle Favorite"
            >
              <FaHeart />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div style={{ padding: "20px", color: "white" }}>Loading movies...</div>
    );
  }

  return (
    <div style={{ backgroundColor: "#454545", color: "white" }}>
      {formattedResults.length > 0 ? (
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ marginBottom: "20px", fontSize: "1.5em" }}>
            Search Results
          </h2>
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "20px",
              padding: "10px 0",
              scrollBehavior: "smooth",
            }}
          >
            {formattedResults.map((movie) => renderMovieCard(movie))}
          </div>
        </div>
      ) : (
        categories.map((category, categoryIndex) => (
          <div key={category.name} style={{ marginBottom: "40px" }}>
            <h2 style={{ marginBottom: "20px", fontSize: "1.5em" }}>
              {category.name}
            </h2>
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "20px",
                padding: "10px 0",
                scrollBehavior: "smooth",
              }}
            >
              {category.movies.map((movie) =>
                renderMovieCard(movie, true, categoryIndex)
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MainContent;
