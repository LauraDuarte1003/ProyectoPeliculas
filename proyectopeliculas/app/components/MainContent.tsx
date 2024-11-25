"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API_KEY = "68b79e4579985b0b418293b7b594d6e8";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface APIMovie {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string;
  vote_average?: number;
}

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

interface MovieResponse {
  results: APIMovie[];
}

interface MainContentProps {
  searchResults: APIMovie[] | undefined;
  showFavorites: boolean;
}

const MainContent: React.FC<MainContentProps> = ({
  searchResults,
  showFavorites,
}) => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formattedResults, setFormattedResults] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("movieFavorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, []);

  const formatMovies = React.useCallback(
    (movies: APIMovie[] = []): Movie[] => {
      if (!Array.isArray(movies)) return [];
      return movies.map((movie) => {
        const releaseDate = movie.release_date
          ? new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(new Date(movie.release_date))
          : "Unknown";

        return {
          id: movie.id,
          title: movie.title || "",
          releaseDate,
          image: movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : "/placeholder.jpg",
          rating: Math.round((movie.vote_average || 0) * 10),
          favorites: favorites.some((fav) => fav.id === movie.id),
        };
      });
    },
    [favorites]
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [popularResponse, nowPlayingResponse, topRatedResponse] =
          await Promise.all([
            axios.get<MovieResponse>(
              `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
            ),
            axios.get<MovieResponse>(
              `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
            ),
            axios.get<MovieResponse>(
              `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
            ),
          ]);

        const allMovies = [
          ...popularResponse.data.results,
          ...nowPlayingResponse.data.results,
          ...topRatedResponse.data.results,
        ];
        const formattedMovies = formatMovies(allMovies);

        const topRatingMovies = formattedMovies.filter(
          (movie) => movie.rating > 80
        );

        setCategories([
          {
            name: "Popular Movies",
            movies: formatMovies(popularResponse.data.results),
          },
          {
            name: "Now Playing",
            movies: formatMovies(nowPlayingResponse.data.results),
          },
          {
            name: "Top Rating",
            movies: topRatingMovies,
          },
          {
            name: "Favorites",
            movies: favorites,
          },
        ]);
      } catch (error) {
        console.error(
          "Error fetching categories:",
          error instanceof Error ? error.message : error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [formatMovies, favorites]);

  useEffect(() => {
    if (searchResults?.length) {
      setFormattedResults(formatMovies(searchResults));
    }
  }, [searchResults, formatMovies]);

  const toggleFavorite = (movie: Movie) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === movie.id);
      const newFavorites = exists
        ? prev.filter((fav) => fav.id !== movie.id)
        : [...prev, { ...movie, favorites: true }];

      try {
        localStorage.setItem("movieFavorites", JSON.stringify(newFavorites));
      } catch (error) {
        console.error("Error saving favorites:", error);
      }
      return newFavorites;
    });
  };

  const getProgressColor = (rating: number) => {
    return rating <= 60 ? "#f44336" : "#4caf50";
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: "#454545",
    color: "white",
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden",
    padding: isMobile ? "10px" : "20px",
  };

  const movieRowStyle: React.CSSProperties = {
    display: "flex",
    overflowX: "auto",
    padding: isMobile ? "10px 0" : "10px 20px",
    scrollBehavior: "smooth",
    WebkitOverflowScrolling: "touch",
    width: "100%",
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    gap: isMobile ? "12px" : "20px",
  };

  const categoryTitleStyle: React.CSSProperties = {
    fontSize: isMobile ? "1.3em" : "1.5em",
    fontWeight: "600",
    color: "#FBBF24",
    padding: isMobile ? "15px 10px 5px" : "20px 20px 0",
    letterSpacing: "0.5px",
  };

  const renderMovieCard = (movie: Movie) => (
    <div
      style={{
        minWidth: isMobile ? "160px" : "250px",
        maxWidth: isMobile ? "160px" : "250px",
        backgroundColor: "#2c2c2c",
        borderRadius: isMobile ? "8px" : "10px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
        marginBottom: isMobile ? "8px" : "10px",
        flex: "0 0 auto",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onClick={() => router.push(`/movie/${movie.id}`)}
      onMouseEnter={(e) => {
        if (!isMobile) {
          const target = e.currentTarget as HTMLDivElement;
          target.style.transform = "translateY(-5px)";
          target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          const target = e.currentTarget as HTMLDivElement;
          target.style.transform = "translateY(0)";
          target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
        }
      }}
    >
      <div
        style={{
          height: isMobile ? "220px" : "300px",
          backgroundColor: "#333",
          position: "relative",
        }}
      >
        <Image
          src={movie.image}
          alt={movie.title}
          fill
          style={{
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          placeholder="blur"
          blurDataURL="/placeholder.jpg"
          onError={(e) => {
            const imgElement = e.target as HTMLImageElement;
            imgElement.src = "/placeholder.jpg";
          }}
        />
      </div>

      <div
        style={{
          padding: isMobile ? "12px" : "15px",
          backgroundColor: "#000",
          height: isMobile ? "140px" : "160px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: isMobile ? "0.9em" : "1.1em",
              fontWeight: "bold",
              color: "white",
              marginBottom: isMobile ? "6px" : "8px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: "1.2em",
              height: "2.4em",
            }}
          >
            {movie.title}
          </h3>
          <p
            style={{
              fontSize: isMobile ? "0.8em" : "0.9em",
              color: "#aaa",
              marginBottom: isMobile ? "8px" : "10px",
            }}
          >
            {movie.releaseDate}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isMobile ? "0 10px" : "0 15px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: isMobile ? "0.7em" : "0.75em",
                color: "white",
                marginBottom: isMobile ? "5px" : "8px",
              }}
            >
              Rating
            </span>
            <svg
              viewBox="0 0 36 36"
              style={{
                width: isMobile ? "30px" : "35px",
                height: isMobile ? "30px" : "35px",
              }}
            >
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
                fontSize={isMobile ? "7" : "8"}
                fill="white"
                textAnchor="middle"
              >
                {movie.rating}%
              </text>
            </svg>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: isMobile ? "0.7em" : "0.75em",
                color: "white",
                marginBottom: isMobile ? "10px" : "13px",
              }}
            >
              Favorite
            </span>
            <button
              onClick={() => toggleFavorite(movie)}
              style={{
                background: "none",
                border: "none",
                color: favorites.some((fav) => fav.id === movie.id)
                  ? "red"
                  : "white",
                fontSize: isMobile ? "1.3em" : "1.5em",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Toggle Favorite"
            >
              <FaHeart size={isMobile ? 24 : 28} />
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

  if (showFavorites) {
    return (
      <div style={{ ...containerStyle, padding: "20px" }}>
        <h2 style={categoryTitleStyle}>My Favorites</h2>
        {favorites.length > 0 ? (
          <div style={movieRowStyle}>
            {favorites.map((movie) => (
              <div key={movie.id}>{renderMovieCard(movie)}</div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "white" }}>
            No favorite movies yet. Start adding some!
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {formattedResults.length > 0 ? (
        <div style={{ marginBottom: isMobile ? "30px" : "40px" }}>
          <h2 style={categoryTitleStyle}>Search Results</h2>
          <div style={movieRowStyle}>
            {formattedResults.map((movie) => (
              <div key={movie.id}>{renderMovieCard(movie)}</div>
            ))}
          </div>
        </div>
      ) : (
        categories.map((category) => (
          <div
            key={category.name}
            style={{ marginBottom: isMobile ? "30px" : "40px" }}
          >
            <h2 style={categoryTitleStyle}>{category.name}</h2>
            <div style={movieRowStyle}>
              {category.movies.map((movie) => (
                <div key={movie.id}>{renderMovieCard(movie)}</div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MainContent;
