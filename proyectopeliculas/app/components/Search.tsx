"use client";
import React, { useState, useEffect, CSSProperties } from "react";
import axios from "axios";

const API_KEY = "07ae841cba8689091077a34ea07ab14d";
const BASE_URL = "https://api.themoviedb.org/3";

interface Genre {
  id: number;
  name: string;
}

interface SearchProps {
  onSearchResults: (movies: any[]) => void;
}

const Search: React.FC<SearchProps> = ({ onSearchResults }) => {
  const [isGenresOpen, setIsGenresOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All Genres");
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".genres-dropdown")) {
        setIsGenresOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchMovies = async (query: string) => {
    try {
      if (!query.trim()) {
        onSearchResults([]);
        return;
      }
      const response = await axios.get(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=1`
      );
      onSearchResults(response.data.results);
    } catch (error) {
      console.error("Error searching movies:", error);
      onSearchResults([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    const debounceTimeout = setTimeout(() => searchMovies(query), 500);
    return () => clearTimeout(debounceTimeout);
  };

  const handleGenreSelect = async (genreId: number, genreName: string) => {
    try {
      setSelectedGenre(genreName);
      setIsGenresOpen(false);

      if (genreId === 0) {
        onSearchResults([]);
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=1`
      );
      onSearchResults(response.data.results);
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
      onSearchResults([]);
    }
  };

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#1a1a1a",
      height: "100%",
    } as CSSProperties,
    title: {
      color: "white",
      fontSize: "16px",
      marginBottom: "10px",
      fontWeight: "500",
    } as CSSProperties,
    searchSection: {
      marginBottom: "20px",
    } as CSSProperties,
    searchInput: {
      width: "100%",
      padding: "8px 12px",
      backgroundColor: "#121212",
      border: "1px solid #232323",
      borderRadius: "4px",
      color: "white",
      fontSize: "14px",
    } as CSSProperties,
    genresContainer: {
      position: "relative",
      width: "100%",
    } as CSSProperties,
    genresButton: {
      width: "100%",
      padding: "8px 12px",
      backgroundColor: "#121212",
      border: "1px solid #232323",
      borderRadius: "4px",
      color: "#999",
      textAlign: "left",
      cursor: "pointer",
    } as CSSProperties,
    dropdownContent: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: "#121212",
      border: "1px solid #232323",
      borderRadius: "4px",
      maxHeight: "300px",
      overflowY: "auto",
      zIndex: 1000,
    } as CSSProperties,
    genreOption: {
      width: "100%",
      padding: "8px 12px",
      backgroundColor: "transparent",
      border: "none",
      color: "white",
      textAlign: "left",
      cursor: "pointer",
      transition: "background-color 0.2s",
    } as CSSProperties,
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchSection}>
        <h2 style={styles.title}>Search</h2>
        <input
          type="text"
          placeholder="Keywords"
          value={searchQuery}
          onChange={handleSearchChange}
          style={styles.searchInput}
        />
      </div>

      <div>
        <h2 style={styles.title}>Genres</h2>
        <div style={styles.genresContainer} className="genres-dropdown">
          <button
            onClick={() => setIsGenresOpen(!isGenresOpen)}
            style={styles.genresButton}
          >
            {selectedGenre}
          </button>

          {isGenresOpen && (
            <div style={styles.dropdownContent}>
              <button
                style={styles.genreOption}
                onClick={() => handleGenreSelect(0, "All Genres")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#2a2a2a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                All Genres
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  style={styles.genreOption}
                  onClick={() => handleGenreSelect(genre.id, genre.name)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2a2a2a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {genre.name}
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
