import "./Atlas.css";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useRef } from "react"; // ✅ Add useRef
import { MapContainer, TileLayer, GeoJSON, Popup, useMap, useMapEvents } from "react-leaflet";
import provinceBoundaries from "./data/provinceBoundaries.json"; 
import axios from "axios";  // Import Axios

const API_KEY = "8b8a90beebac9973b9ed1fa4db559ca8";


// Function to send data to Flask and get prediction
const getPrediction = async (modelType, featureData) => {
  try {
    const response = await axios.post("http://localhost:5000/predict", {
      model: modelType,
      ...featureData
    });

    console.log("Prediction Result:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching prediction:", error);
    return { error: "Failed to fetch prediction" };
  }
};

// Example Usage:
getPrediction("flood", {
  preFloodPrecip: 1.2,
  duringFloodPrecip: 3.5,
  avgTemp: 25.0,
  laggedAvgTemp: 24.0,
  laggedDuringFloodPrecip: 2.0
});

// Expanded province colors to ensure unique colors for each province
// Added more distinct colors to avoid similar shades
const provinceColors = {
  "Azad Kashmir": "#795548",    // Brown
  "Baluchistan": "#8E24AA",     // Purple
  // "F.A.T.A.": "#43A047",        // Green
  "F.C.T.": "#009688",          // Teal
  "N.W.F.P.": "#FDD835",        // Yellow
  "Northern Areas": "#1E88E5",  // Blue
  "Sind": "#26A69A",            // Different shade of green to distinguish from F.A.T.A.
  "Punjab": "#1565C0",          // Slightly darker blue to distinguish from Northern Areas
  // Add more specific mappings for any subregions or alternative names
  "Balochistan": "#8E24AA",     // Alternative spelling
  "Sindh": "#26A69A",           // Alternative spelling
  "Islamabad": "#009688",       // In case F.C.T. is also referred to as Islamabad
  "Khyber Pakhtunkhwa": "#FDD835", // Alternative name for N.W.F.P.
  "Gilgit-Baltistan": "#1E88E5", // Alternative name for Northern Areas
  "Azad Jammu and Kashmir": "#795548" // Alternative name for Azad Kashmir
};

// Weather Popup Component
const WeatherPopup = ({ position, weatherData, floodRisk, onClose }) => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (position) {
      setTimeout(() => setShowPopup(true), 100); // Small delay for smooth transition
    }
  }, [position]);

  if (!position || !weatherData) return null;

  return (
    <Popup position={[position.lat, position.lng]} onClose={onClose} className="custom-popup">
      <div className={`weather-popup ${showPopup ? "show" : ""}`}>
        <h3 className="weather-title">{weatherData.name || "Unknown Location"}</h3>
        <p className="weather-detail">🌡 <b>Temperature:</b> {weatherData.main.temp}°C</p>
        <p className="weather-detail">💨 <b>Wind:</b> {weatherData.wind.speed} m/s</p>
        <p className="weather-detail">💧 <b>Humidity:</b> {weatherData.main.humidity}%</p>
        <p className={`weather-risk ${floodRisk === "High Risk" ? "high-risk" : floodRisk === "Medium Risk" ? "medium-risk" : "low-risk"}`}>
          ⚠ <b>Flood Risk:</b> {floodRisk}
        </p>
      </div>
    </Popup>
  );
};


// Right-Click to Get Weather
const ClickHandler = ({ setWeatherPosition, setWeatherData, setFloodRisk, randomRiskMode, randomRiskData }) => {
  useMapEvents({
    contextmenu: async (e) => {
      console.log("🖱 Right-click detected at:", e.latlng);

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      try {
        // ✅ Fetch Weather Data
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
        );
        const weatherData = await weatherResponse.json();
        console.log("☁ Weather Data:", weatherData);

        if (!weatherData.main) {
          console.error("❌ Weather data unavailable");
          return;
        }

        let riskLevel = "Unknown";

        // Check if we're in random risk mode
        if (randomRiskMode) {
          // Find the containing province by checking which polygon contains the clicked point
          const containingProvince = findContainingProvince(lat, lng);
          if (containingProvince && randomRiskData[containingProvince]) {
            riskLevel = randomRiskData[containingProvince];
            console.log(`🎲 Using random risk level for ${containingProvince}: ${riskLevel}`);
          } else {
            // If we can't determine the province, generate a random risk
            const random = Math.random();
            if (random < 0.8) riskLevel = "Low Risk";
            else if (random < 0.95) riskLevel = "Medium Risk";
            else riskLevel = "High Risk";
            console.log(`🎲 Using fallback random risk level: ${riskLevel}`);
          }
          
          // Set the data
          setWeatherPosition({ lat, lng });
          setWeatherData(weatherData);
          setFloodRisk(riskLevel);
        } else {
          // Original functionality - use the ML model
          // ✅ Extract Required Weather Features for Prediction
          const weatherFeatures = {
            preFloodPrecip: weatherData.rain?.["1h"] || 0,
            duringFloodPrecip: weatherData.rain?.["3h"] || 0,
            avgTemp: weatherData.main.temp,
            laggedAvgTemp: weatherData.main.temp - 1,
            laggedDuringFloodPrecip: (weatherData.rain?.["3h"] || 0) * 0.9
          };

          console.log("📊 Weather Features for Prediction:", weatherFeatures);

          // ✅ Send Weather Data to Backend for Flood Risk Prediction
          const predictionResponse = await axios.post("http://localhost:5000/predict", {
            model: "flood",  // Ensuring we specify the model type
            ...weatherFeatures
          });

          console.log("🚨 Flood Prediction Response:", predictionResponse.data);
          riskLevel = predictionResponse.data.prediction || "Unknown";

          // ✅ Store Weather & Flood Risk Data
          setWeatherPosition({ lat, lng });
          setWeatherData(weatherData);
          setFloodRisk(riskLevel);
        }
      } catch (error) {
        console.error("❌ Error fetching weather or flood risk data:", error);
      }
    },
  });

  return null;
};

// Helper function to determine which province contains a point
const findContainingProvince = (lat, lng) => {
  if (!provinceBoundaries || !provinceBoundaries.features) return null;
  
  for (const feature of provinceBoundaries.features) {
    if (feature.geometry && feature.properties && feature.properties.NAME_1) {
      // Simple point-in-polygon check could be implemented here
      // For now, we'll use a simplification based on bounding box
      if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
        // This is a simplification - a real implementation would use a point-in-polygon algorithm
        // We're just checking if the point is in the general area of the province
        const bounds = getBounds(feature.geometry);
        if (bounds && 
            lat >= bounds.minLat && lat <= bounds.maxLat && 
            lng >= bounds.minLng && lng <= bounds.maxLng) {
          return feature.properties.NAME_1;
        }
      }
    }
  }
  return null;
};

// Helper to get bounds of a geometry
const getBounds = (geometry) => {
  try {
    let coordinates = [];
    if (geometry.type === "Polygon") {
      coordinates = geometry.coordinates[0]; // Outer ring
    } else if (geometry.type === "MultiPolygon") {
      // Flatten all polygons
      coordinates = geometry.coordinates.flatMap(poly => poly[0]);
    } else {
      return null;
    }
    
    // Find min/max coordinates
    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    for (const [lng, lat] of coordinates) {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    }
    
    return { minLat, maxLat, minLng, maxLng };
  } catch (error) {
    console.error("Error calculating bounds:", error);
    return null;
  }
};

// Search Handler Component
const SearchHandler = ({ searchPosition }) => {
  const map = useMap();

  useEffect(() => {
    if (searchPosition) {
      map.flyTo([searchPosition.lat, searchPosition.lng], 10, { duration: 1.5 });
    }
  }, [searchPosition, map]);

  return null;
};

// Search Bar Component
const SearchBar = ({ setSearchPosition }) => {
  const [searchInput, setSearchInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef(null);

  // Handle input changes
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchInput}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setSearchPosition({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        alert("City not found. Try another search.");
      }

      // ✅ Clear input on Enter
      setSearchInput("");
      setIsExpanded(false); // ✅ Shrink back on Enter
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  // ✅ Shrink search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form className="search" ref={searchRef} onSubmit={handleSearch}>
      <div className={`search__wrapper ${isExpanded ? "active" : ""}`}>
        <input
          type="text"
          placeholder="Search"
          className="search__field"
          value={searchInput}
          onChange={handleInputChange}
          onFocus={() => setIsExpanded(true)}
        />
        <button type="submit" className="fa fa-search search__icon"></button>
      </div>
    </form>
  );
};

// Random Risk Generation Button
const RandomRiskButton = ({ onClick, active }) => {
  return (
    <button 
      className={`random-risk-button ${active ? 'active' : ''}`}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        padding: '10px 15px',
        backgroundColor: active ? '#F44336' : '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}
    >
      {active ? 'Disable Random Mode' : 'Enable Random Risk Mode'}
    </button>
  );
};

// Main Map Component
export default function Atlas() {
  const [provinceData, setProvinceData] = useState([]);
  const [provinceRisk, setProvinceRisk] = useState({});
  const [lowRiskProvinces, setLowRiskProvinces] = useState(new Set());
  const [weatherPosition, setWeatherPosition] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [floodRisk, setFloodRisk] = useState("Unknown");  
  const [searchPosition, setSearchPosition] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(5.5);
  
  // New state for random risk mode
  const [randomRiskMode, setRandomRiskMode] = useState(false);
  const [randomRiskData, setRandomRiskData] = useState({});
  const [geoJsonKey, setGeoJsonKey] = useState(0); // Add a key to force GeoJSON re-render

  // Retrieve state from localStorage on mount
  useEffect(() => {
    const savedRandomRiskMode = JSON.parse(localStorage.getItem("randomRiskMode"));
    const savedRandomRiskData = JSON.parse(localStorage.getItem("randomRiskData"));

    if (savedRandomRiskMode !== null) setRandomRiskMode(savedRandomRiskMode);
    if (savedRandomRiskData !== null) setRandomRiskData(savedRandomRiskData);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("randomRiskMode", JSON.stringify(randomRiskMode));
    localStorage.setItem("randomRiskData", JSON.stringify(randomRiskData));
  }, [randomRiskMode, randomRiskData]);

  const updateMapStyles = () => {
    document.querySelectorAll(".leaflet-interactive").forEach((element) => {
      element.style.fillOpacity = "0.7"; // Ensure transparency is reset
    });
  };

  // Function to generate random risk levels for all provinces
  const generateRandomRiskLevels = () => {
    if (!provinceData.length) return {};
    
    const newProvinceRisk = {};
    
    provinceData.forEach(province => {
      const random = Math.random();
      if (random < 0.6) {
        newProvinceRisk[province] = "Low Risk";
      } else if (random < 0.75) {
        newProvinceRisk[province] = "Medium Risk";
      } else {
        newProvinceRisk[province] = "High Risk";
      }
    });
    
    console.log("🎲 Generated random risk levels:", newProvinceRisk);
    return newProvinceRisk;
  };

  // Toggle random risk mode
  const toggleRandomRiskMode = () => {
    const newRandomMode = !randomRiskMode;
    setRandomRiskMode(newRandomMode);
    
    if (newRandomMode) {
      // Generate and apply random risk levels
      const randomRisk = generateRandomRiskLevels();
      setRandomRiskData(randomRisk);
      setProvinceRisk(randomRisk);
      // Force GeoJSON to re-render with new styles
      setGeoJsonKey(prevKey => prevKey + 1);
      
      // Inform user
      import("sweetalert2").then((Swal) => {
        Swal.default.fire({
          title: "Random Mode Activated",
          html: "Map is now showing randomly generated risk levels:<br>ow Risk (Green)<br>Medium Risk (Orange)<br>High Risk (Red)",
          icon: "info",
          confirmButtonText: "OK"
        });
      });
    } else {
      // Revert to original risk data
      fetchRiskData();
      // Force GeoJSON to re-render with new styles
      setGeoJsonKey(prevKey => prevKey + 1);
    }
  };

  const fetchRiskData = async () => {
    if (!provinceData.length) return;
    
    const newProvinceRisk = {};
    const lowRiskSet = new Set(); 

    for (const province of provinceData) {
      try {
        const response = await getPrediction("flood", {
          preFloodPrecip: 0.5, 
          duringFloodPrecip: 1.5,
          avgTemp: 22.0,
          laggedAvgTemp: 21.0,
          laggedDuringFloodPrecip: 1.0
        });

        newProvinceRisk[province] = response.prediction || "Unknown";

        if (response.prediction === "Low Risk") {
          lowRiskSet.add(province);
        }
      } catch (error) {
        console.error(`Error fetching prediction for ${province}:`, error);
        newProvinceRisk[province] = "Unknown";
      }
    }

    setProvinceRisk(newProvinceRisk);
    setLowRiskProvinces(lowRiskSet);

    // Track high-risk provinces
    const currentHighRisk = new Set(
      Object.keys(newProvinceRisk).filter(province => newProvinceRisk[province] === "High Risk")
    );

    // Show alert for high risk areas
    if (currentHighRisk.size > 0) {
      import("sweetalert2").then((Swal) => {
        Swal.default.fire({
          title: "🚨 Flood Alert!",
          html: `<b>High Flood Risk Detected in:</b> ${[...currentHighRisk].join(", ")} <br> 
                 <b>Take Precautionary Measures!</b>`,
          icon: "error",
          confirmButtonText: "OK"
        });
      });
    }

    console.log("Updated province risk levels:", newProvinceRisk);

    // Schedule reversion of low-risk provinces after 2 seconds
    setTimeout(() => {
      if (!randomRiskMode) { // Only reset if not in random mode
        setLowRiskProvinces(new Set()); // Reset low-risk coloring
        setGeoJsonKey(prevKey => prevKey + 1); // Force re-render
      }
    }, 2000);
  };

  useEffect(() => {
    if (provinceBoundaries.features && provinceBoundaries.features.length > 0) {
      const provinceNames = new Set();
      provinceBoundaries.features.forEach(feature => {
        if (feature.properties && feature.properties.NAME_1) {
          provinceNames.add(feature.properties.NAME_1);
        }
      });

      const provinceList = Array.from(provinceNames);
      setProvinceData(provinceList);

      console.log("All province names in GeoJSON:", provinceList);

      // Initial fetch of risk data
      fetchRiskData();
      
      // Set up interval for regular updates (only when not in random mode)
      const interval = setInterval(() => {
        if (!randomRiskMode) {
          fetchRiskData();
        }
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, []); // Run only on initial mount

  useEffect(() => {
    document.body.style.overflowX = "visible";
  
    return () => {
      document.body.style.overflowX = "hidden"; 
    };
  }, []);


  // Get province style based on risk level
  const getProvinceStyle = (feature) => {
    const provinceName = feature.properties.NAME_1;

    if (!provinceColors[provinceName]) {
      console.log("Unmatched province name:", provinceName);
    }

    // Get the risk level
    const riskLevel = provinceRisk?.[provinceName] || "Unknown";

    // Define risk colors
    const riskColors = {
      "Low Risk": "#4CAF50", // Green for low risk
      "Medium Risk": "#FFC107", // Yellow/orange for medium risk
      "High Risk": "#F44336", // Red for high risk
      "Unknown": provinceColors[provinceName] || "#607D8B" // Default to province color or gray
    };

    // In random mode, always use risk colors
    // In normal mode, only highlight low risk if in the lowRiskProvinces set
    const fillColor = randomRiskMode ? 
      riskColors[riskLevel] : 
      (riskLevel === "Low Risk" && lowRiskProvinces.has(provinceName)) ? 
        riskColors["Low Risk"] : 
        (riskLevel === "Medium Risk" || riskLevel === "High Risk") ? 
          riskColors[riskLevel] : 
          provinceColors[provinceName] || "#607D8B";

    return {
      fillColor: fillColor,
      color: "#FFFFFF", 
      weight: 1.1,
      fillOpacity: 0.7  
    };
  };

  // Define hover styles for provinces
  const getHoverStyle = (riskLevel) => {
    // In random mode, use a transparent version of the risk color
    return {
      fillOpacity: 0,
      fillColor: "transparent",
      color: "black",
      weight: 3
    };
  };

  // Handle province interactions
  const onEachProvince = (feature, layer) => {
    const provinceName = feature.properties.NAME_1;
    const riskLevel = provinceRisk[provinceName] || "Unknown";
    
    // Calculate original style based on current state
    const getOriginalStyle = () => {
      return getProvinceStyle(feature);
    };

    // Create popup content
    const getPopupContent = () => {
      return `
        <b>${provinceName}</b>
        ${randomRiskMode ? `<br>Risk Level: <span style="color: ${
          riskLevel === "High Risk" ? "red" : 
          riskLevel === "Medium Risk" ? "orange" : 
          "green"
        };">${riskLevel}</span>` : ''}
      `;
    };

    // Bind a popup to the layer but do not open it immediately
    layer.bindPopup(getPopupContent(), { autoClose: false });

    layer.on({
      mouseover: (e) => {
        e.target.setStyle(getHoverStyle(riskLevel));
      },
      mouseout: (e) => {
        // Correctly restore the original style when mouse leaves
        e.target.setStyle(getOriginalStyle());
      },
      click: (e) => {
        // Update popup content
        e.target.getPopup().setContent(getPopupContent());
        
        // Show at clicked location
        e.target.getPopup().setLatLng(e.latlng).openOn(e.target._map);
        
        // Auto-close after delay
        setTimeout(() => {
          e.target.closePopup();
        }, 1500);
      }
    });
  };

  return (
    <MapContainer
      center={[30.3753, 69.3451]}
      zoom={zoomLevel}
      whenCreated={(map) => {
        map.on("zoomend", () => setZoomLevel(map.getZoom()));
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <SearchBar setSearchPosition={setSearchPosition} />
      <SearchHandler searchPosition={searchPosition} />
      
      {/* Random Risk Button */}
      <RandomRiskButton 
        onClick={toggleRandomRiskMode} 
        active={randomRiskMode} 
      />

      {/* Using the key prop to force re-render when risk data changes */}
      <GeoJSON 
        key={geoJsonKey}
        data={provinceBoundaries} 
        style={getProvinceStyle}
        onEachFeature={onEachProvince} 
        zIndex={10}
      />

      <ClickHandler 
        setWeatherPosition={setWeatherPosition} 
        setWeatherData={setWeatherData} 
        setFloodRisk={setFloodRisk}
        randomRiskMode={randomRiskMode}
        randomRiskData={randomRiskData}
      />
      
      {weatherPosition && (
        <WeatherPopup 
          position={weatherPosition} 
          weatherData={weatherData} 
          floodRisk={floodRisk} 
          onClose={() => {
            setWeatherPosition(null);
            setWeatherData(null);
            setFloodRisk("Unknown");
          }} 
        />
      )}

    </MapContainer>
  );
}