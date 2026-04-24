import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./MapPage.css";

const KEY    = "xyFqdRnpgyKc6ofUFhAj";
const STYLE  = `https://api.maptiler.com/maps/base-v4/style.json?key=${KEY}`;
const CENTER = [-73.944, 40.716];
const ZOOM   = 10.1;

// NYC borough boundaries (NYC Open Data)
const BOROUGHS_GEOJSON =
  "https://data.cityofnewyork.us/api/geospatial/7t3b-ywvw?method=export&type=GeoJSON";

const BOROUGH_COLORS = {
  Manhattan:     "#4a96b4",
  Brooklyn:      "#4a9e72",
  Queens:        "#6a86c4",
  Bronx:         "#5aaa82",
  "The Bronx":   "#5aaa82",
  "Staten Island": "#8aaa6a",
};

const BOROUGH_ROUTES = {
  Manhattan:       "/manhattan",
  Brooklyn:        "/brooklyn",
  Queens:          "/queens",
  Bronx:           "/bronx",
  "The Bronx":     "/bronx",
  "Staten Island": "/staten-island",
};

export default function MapPage() {
  const navigate   = useNavigate();
  const mapEl      = useRef(null);
  const map        = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [tooltip,  setTooltip]  = useState(null); // { name, tagline, x, y }

  const TAGLINES = {
    Manhattan:       "The Heart of the City",
    Brooklyn:        "City of Makers",
    Queens:          "The World's Borough",
    Bronx:           "Birthplace of Hip-Hop",
    "The Bronx":     "Birthplace of Hip-Hop",
    "Staten Island": "The Forgotten Borough",
  };

  useEffect(() => {
    map.current = new maplibregl.Map({
      container: mapEl.current,
      style: STYLE,
      center: CENTER,
      zoom: ZOOM,
      minZoom: 9,
      maxZoom: 15,
      maxBounds: [[-74.6, 40.35], [-73.3, 41.1]],
      attributionControl: false,
    });

    map.current.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    map.current.on("load", () => {
      // Borough fill layer
      map.current.addSource("boroughs", {
        type: "geojson",
        data: BOROUGHS_GEOJSON,
      });

      map.current.addLayer({
        id: "borough-fill",
        type: "fill",
        source: "boroughs",
        paint: {
          "fill-color": [
            "match",
            ["get", "boro_name"],
            "Manhattan",     BOROUGH_COLORS.Manhattan,
            "Brooklyn",      BOROUGH_COLORS.Brooklyn,
            "Queens",        BOROUGH_COLORS.Queens,
            "Bronx",         BOROUGH_COLORS.Bronx,
            "Staten Island", BOROUGH_COLORS["Staten Island"],
            "#1a3d52",
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hovered"], false],
            0.58,
            0.28,
          ],
        },
      });

      map.current.addLayer({
        id: "borough-border",
        type: "line",
        source: "boroughs",
        paint: {
          "line-color": "rgba(255,255,255,0.55)",
          "line-width": 1.8,
        },
      });

      map.current.addLayer({
        id: "borough-border-glow",
        type: "line",
        source: "boroughs",
        paint: {
          "line-color": [
            "match",
            ["get", "boro_name"],
            "Manhattan",     BOROUGH_COLORS.Manhattan,
            "Brooklyn",      BOROUGH_COLORS.Brooklyn,
            "Queens",        BOROUGH_COLORS.Queens,
            "Bronx",         BOROUGH_COLORS.Bronx,
            "Staten Island", BOROUGH_COLORS["Staten Island"],
            "#4a96b4",
          ],
          "line-opacity": [
            "case",
            ["boolean", ["feature-state", "hovered"], false],
            0.9,
            0,
          ],
          "line-width": 4,
          "line-blur": 3,
        },
      });

      // Clouds fly away once the map is ready
      setTimeout(() => setRevealed(true), 200);
    });

    // Hover
    let hoveredId = null;
    map.current.on("mousemove", "borough-fill", (e) => {
      map.current.getCanvas().style.cursor = "pointer";
      if (e.features.length === 0) return;

      if (hoveredId !== null) {
        map.current.setFeatureState(
          { source: "boroughs", id: hoveredId },
          { hovered: false }
        );
      }
      hoveredId = e.features[0].id;
      map.current.setFeatureState(
        { source: "boroughs", id: hoveredId },
        { hovered: true }
      );

      const name = e.features[0].properties.boro_name;
      setTooltip({
        name,
        tagline: TAGLINES[name] || "",
        color:   BOROUGH_COLORS[name] || "#4a96b4",
        x: e.point.x,
        y: e.point.y,
      });
    });

    map.current.on("mouseleave", "borough-fill", () => {
      map.current.getCanvas().style.cursor = "";
      if (hoveredId !== null) {
        map.current.setFeatureState(
          { source: "boroughs", id: hoveredId },
          { hovered: false }
        );
      }
      hoveredId = null;
      setTooltip(null);
    });

    // Click → navigate
    map.current.on("click", "borough-fill", (e) => {
      const name  = e.features[0]?.properties?.boro_name;
      const route = BOROUGH_ROUTES[name];
      if (route) navigate(route);
    });

    return () => {
      map.current?.remove();
    };
  }, [navigate]);

  return (
    <div className="map-page">
      {/* Cloud overlay */}
      <div className={`map-clouds${revealed ? " map-clouds--away" : ""}`}>
        <div className="mc mc--a" />
        <div className="mc mc--b" />
        <div className="mc mc--c" />
        <div className="mc mc--d" />
      </div>

      {/* Header */}
      <header className={`map-header${revealed ? " map-header--in" : ""}`}>
        <button className="map-back" onClick={() => navigate("/")}>
          ← Back
        </button>
        <div className="map-title-block">
          <p className="map-overline">New York City</p>
          <h1 className="map-title">The Five Boroughs</h1>
        </div>
        <div className="map-header-spacer" />
      </header>

      {/* Map */}
      <div ref={mapEl} className={`map-container${revealed ? " map-container--in" : ""}`} />

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className="map-tooltip"
          style={{
            left: tooltip.x + 16,
            top:  tooltip.y - 48,
            borderColor: tooltip.color,
          }}
        >
          <span className="map-tooltip-name" style={{ color: tooltip.color }}>
            {tooltip.name}
          </span>
          <span className="map-tooltip-tag">{tooltip.tagline}</span>
        </div>
      )}

      <p className={`map-hint${revealed ? " map-hint--in" : ""}`}>
        Click a borough to explore
      </p>
    </div>
  );
}
