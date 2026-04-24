import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import MapPage from "./pages/MapPage";
import PageWrapper from "./components/PageWrapper";

const placeholder = (label) => (
  <PageWrapper>
    <div style={{ padding: "80px 32px", textAlign: "center", fontSize: "2rem", color: "#3a7a96" }}>
      {label}
    </div>
  </PageWrapper>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Landing />} />
        <Route path="/map"           element={<MapPage />} />
        <Route path="/manhattan"     element={placeholder("Manhattan")} />
        <Route path="/brooklyn"      element={placeholder("Brooklyn")} />
        <Route path="/queens"        element={placeholder("Queens")} />
        <Route path="/bronx"         element={placeholder("The Bronx")} />
        <Route path="/staten-island" element={placeholder("Staten Island")} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
