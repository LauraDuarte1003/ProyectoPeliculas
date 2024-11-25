/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Search from "./components/Search";
import MainContent from "./components/MainContent";
import Banner from "./components/Banner";

export default function Home() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showFavorites] = useState(false);

  return (
    <div style={{ position: "relative", background: "black" }}>
      <div
        className="flex min-h-screen bg-black"
        style={{ flexDirection: "column" }}
      >
        <div style={{ width: "100%" }}>
          <Banner />
        </div>

        <div
          className="flex"
          style={{
            display: "flex",
            flexDirection: "row",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "40vh",
              transition: "all 0.3s ease",
            }}
            className="responsive-search"
          >
            <Search onSearchResults={setSearchResults} />
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              backgroundColor: "#454545",
              transition: "margin-top 0.3s ease",
            }}
            className="responsive-maincontent"
          >
            <MainContent
              searchResults={searchResults}
              showFavorites={showFavorites}
            />
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            .flex {
              flex-direction: column;
            }

            .responsive-search {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: auto;
              z-index: 1000;
              width: 100%;
            }

            .responsive-maincontent {
              margin-top: 200px;
              width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
