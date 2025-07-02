import { useRef, useState } from "react";
import "./App.css";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import Alert from "./components/Alert";
import Particles from "./Reactbits/Particles";

interface AlertState {
  show: boolean;
  message: string;
  subMessage?: string;
  type: "success" | "error" | "warning";
}

// Import API key from environment variables
const API_KEY = import.meta.env.VITE_API_SECRET_KEY;

function App() {
  const [originalUrl, setOriginalUrl] = useState("https://www.google.com/");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [stats, setStats] = useState<{
    totalUrls: number;
    totalClicks: number;
  } | null>(null);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "success",
  });

  const qrcodeRef = useRef<HTMLDivElement>(null);

  // Helper function to show alerts
  const showAlert = (
    message: string,
    type: "success" | "error" | "warning",
    subMessage?: string
  ) => {
    setAlert({
      show: true,
      message,
      type,
      subMessage,
    });
  };

  // Helper function to hide alerts
  const hideAlert = () => {
    setAlert({
      show: false,
      message: "",
      type: "success",
    });
  };

  const handleSubmit = () => {
    const websiteRegex =
      /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/i;
    if (!websiteRegex.test(originalUrl)) {
      showAlert("Invalid URL", "error", "Please enter a valid website URL");
      return;
    }

    showAlert("Processing...", "warning", "Shortening your URL");

    axios
      .post(
        "http://localhost:3000/api/shorten",
        { originalUrl },
        { headers: { "x-api-key": API_KEY } }
      )
      .then((response) => {
        console.log("Shortened URL:", response.data);
        if (response.data.url.shortUrl) {
          setShortenedUrl(response.data.url.shortUrl);
          showAlert(
            "Success!",
            "success",
            `URL shortened successfully: ${response.data.url.shortUrl}`
          );
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 429) {
          showAlert(
            "Memory Full",
            "error",
            "URL limit reached. Please delete existing URLs or try again later."
          );
        } else {
          showAlert(
            "Error",
            "error",
            "Failed to shorten URL. Please try again."
          );
          console.error("Error shortening URL:", error);
        }
      });
    // Reset the input field after submission
    setOriginalUrl("");

    console.log("URL submitted:", originalUrl);
  };

  const handleGetStatus = async () => {
    try {
      showAlert("Loading...", "warning", "Fetching statistics");
      const response = await axios.get(
        "http://localhost:3000/api/stats",
        { headers: { "x-api-key": API_KEY } }
      );
      setStats(response.data);
      showAlert(
        "Stats Updated",
        "success",
        `Found ${response.data.totalUrls} URLs with ${response.data.totalClicks} total clicks`
      );
    } catch (error) {
      showAlert(
        "Error",
        "error",
        "Failed to fetch statistics. Please try again."
      );
      console.error("Error fetching stats:", error);
    }
  };
  
  return (
    <>
      <div className="particles-container">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      {alert.show && (
        <Alert
          message={alert.message}
          subMessage={alert.subMessage}
          type={alert.type}
          timeout={5000}
          onClose={hideAlert}
        />
      )}
      <div className="main-container">
        <div className="container">
          <h1 className="title">URL Shortener</h1>
          <form className="shorten-form">
            <input
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              type="url"
              className="url-input"
              placeholder="Enter your URL"
              required
            />
            <button
              type="submit"
              className="btn shorten-btn"
              onClick={handleSubmit}
            >
              Shorten
            </button>
            {shortenedUrl && (
              <div className="result">
                Shortened URL:{" "}
                <a
                  href={`http://localhost:3000/${shortenedUrl}`}
                  target="_blank"
                >
                  {`http://localhost:3000/${shortenedUrl}`}
                </a>
              </div>
            )}
            {shortenedUrl && (
              <div ref={qrcodeRef} className="qrcode-container">
                <QRCodeCanvas
                  value={`http://localhost:3000/${shortenedUrl}`}
                  size={128}
                />
              </div>
            )}
          </form>
        </div>
        <button type="button" className="btn status-btn" onClick={handleGetStatus}>
          Get Status
        </button>
        {stats && (
          <div className="status">
            <div>Total URLs: {stats.totalUrls}</div>
            <div>Total Clicks: {stats.totalClicks}</div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
