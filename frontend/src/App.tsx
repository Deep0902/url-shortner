import { useRef, useState } from "react";
import "./App.css";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

function App() {
  const [originalUrl, setOriginalUrl] = useState("https://www.google.com/");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [stats, setStats] = useState<{
    totalUrls: number;
    totalClicks: number;
  } | null>(null);

  const qrcodeRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    const websiteRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/i;
    if (!websiteRegex.test(originalUrl)) {
      window.alert("Enter a valid website");
      return;
    }
    axios
      .post("http://localhost:3000/api/shorten", { originalUrl })
      .then((response) => {
        console.log("Shortened URL:", response.data);
        if (response.data.url.shortUrl) {
          setShortenedUrl(response.data.url.shortUrl);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 429) {
          window.alert("Memory full: URL limit reached. Please delete existing URLs or try again later.");
        } else {
          console.error("Error shortening URL:", error);
        }
      });
    // Reset the input field after submission
    setOriginalUrl("");

    console.log("URL submitted:", originalUrl);
  };

  const handleGetStatus = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };
  return (
    <>
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
          <button type="submit" className="shorten-btn" onClick={handleSubmit}>
            Shorten
          </button>
          {shortenedUrl && (
            <div className="result">
              Shortened URL:
              <a href={`http://localhost:3000/${shortenedUrl}`} target="_blank">
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
      <button type="button" className="status-btn" onClick={handleGetStatus}>
        Get Status
      </button>
      {stats && (
        <div className="status">
          <div>Total URLs: {stats.totalUrls}</div>
          <div>Total Clicks: {stats.totalClicks}</div>
        </div>
      )}
    </>
  );
}

export default App;
