import Search from "./components/Search";
import MainContent from "./components/MainContent";

export default function Home() {
  return (
    <div
      className="flex min-h-screen bg-black"
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* Sidebar (20% del ancho de la pantalla) */}
      <div
        style={{
          width: "20%",
          maxWidth: "250px", // Limita el ancho máximo del sidebar.
          backgroundColor: "#1e1e1e",
        }}
      >
        <Search />
      </div>

      {/* Main Content Area (80% del ancho de la pantalla) */}
      <div
        style={{
          width: "90%",
          overflowY: "auto",
          padding: "20px",
          backgroundColor: "#454545",
        }}
      >
        <MainContent />
      </div>
    </div>
  );
}
