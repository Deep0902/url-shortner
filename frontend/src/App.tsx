import { useRef, useState } from "react";
import "./App.css";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

function App() {
  const [originalUrl, setOriginalUrl] = useState("https://www.google.com/");
  const [shortenedUrl, setShortenedUrl] = useState("");

  const qrcodeRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    axios
      .post("http://localhost:3000/api/shorten", { originalUrl })
      .then((response) => {
        console.log("Shortened URL:", response.data);
        if (response.data.url.shortUrl) {
          setShortenedUrl(response.data.url.shortUrl);
        }
      })
      .catch((error) => {
        console.error("Error shortening URL:", error);
      });
    // Reset the input field after submission
    setOriginalUrl("");

    console.log("URL submitted:", originalUrl);
  };

  return (
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
  );
}

export default App;
