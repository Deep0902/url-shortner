import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";
import "./App.css";
import Alert from "./components/Alert/Alert";
import Particles from "./Reactbits/Particles";
import Loader from "./components/Loader/Loader";

interface AlertState {
  show: boolean;
  message: string;
  subMessage?: string;
  type: "success" | "error" | "warning";
}

// Import API key from environment variables
const API_KEY = import.meta.env.VITE_API_SECRET_KEY;
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [stats, setStats] = useState<{
    totalUrls: number | null;
    totalClicks: number | null;
  }>();
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "success",
  });
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    axios
      .post(
        `${API_URL}/api/shorten`,
        { originalUrl },
        { headers: { "x-api-key": API_KEY } }
      )
      .then((response) => {
        console.log("Shortened URL:", response.data);
        setLoading(false);
        if (response.data.url.shortUrl) {
          setShortenedUrl(response.data.url.shortUrl);
          showAlert("Success!", "success", `URL shortened successfully`);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.status === 429) {
          showAlert(
            "Service Unavailable",
            "error",
            "Storage limit reached. Contact admin."
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
    // setOriginalUrl("");

    console.log("URL submitted:", originalUrl);
  };

  const handleGetStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/stats`, {
        headers: { "x-api-key": API_KEY },
      });
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

      <div className={`loader-fade-wrapper${loading ? " show" : ""}`}>
        <Loader />
      </div>
      <div className="main-container">
        <div className="container">
          <h1 className="title">URL Shortener</h1>
          <form
            className="shorten-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              type="url"
              className="url-input"
              placeholder="Enter your URL"
              required
            />
            <button type="submit" className="btn shorten-btn">
              Shorten
            </button>
            {shortenedUrl && (
              <div className="result">
                Shortened URL:{" "}
                <a href={`${API_URL}/${shortenedUrl}`} target="_blank">
                  {`${API_URL}/${shortenedUrl}`}
                </a>
              </div>
            )}
            {shortenedUrl && (
              <div ref={qrcodeRef} className="qrcode-container">
                <QRCodeCanvas value={`${API_URL}/${shortenedUrl}`} size={128} />
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="status-container">
        <button
          type="button"
          className="btn status-btn"
          onClick={handleGetStatus}
        >
          Get Status
        </button>
        {stats && (
          <div className="status">
            <span>Total URLs: {stats?.totalUrls}</span>
            <span>Total Clicks: {stats?.totalClicks}</span>
          </div>
        )}{" "}
      </div>
    </>
  );
}

export default App;
