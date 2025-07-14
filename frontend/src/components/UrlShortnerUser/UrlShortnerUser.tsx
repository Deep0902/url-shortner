import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { LinkPreview } from "../../Reactbits/LinkPreview";
import Particles from "../../Reactbits/Particles";
import { API_KEY, API_URL } from "../../shared/constants";
import type { AlertState } from "../../shared/interfaces";
import Alert from "../Alert/Alert";
import Footer from "../Footer/Footer";
import Loader from "../Loader/Loader";
import Navbar from "../Navbar/Navbar";
import "../UrlShortner/UrlShortner.css";
import "./UrlShortnerUser.css";
function UrlShortnerUser() {
  //region State
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  // History state for user's shortened links
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyData, setHistoryData] = useState<
    Array<{
      shortUrl: string;
      createdAt: string;
      expiredAt: string;
    }>
  >([
    // Dummy data, replace with API response
    {
      shortUrl: "sho-rty.vercel.app/abc123",
      createdAt: "2025-07-01",
      expiredAt: "2025-08-01",
    },
    {
      shortUrl: "sho-rty.vercel.app/xyz789",
      createdAt: "2025-07-10",
      expiredAt: "2025-08-10",
    },
  ]);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "success",
  });
  const [loading, setLoading] = useState(false);
  const [swipe] = useState(false);
  const qrcodeRef = useRef<HTMLDivElement>(null);
  const fullText = "Transform long URLs into clean, shareable links in seconds";
  const [animatedText, setAnimatedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  //endregion

  //region Handlers
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
        setLoading(false);
        if (response.data.shortUrl) {
          setShortenedUrl(response.data.shortUrl);
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
  };

  // Handler for View History button
  const handleViewHistory = () => {
    setHistoryLoading(true);
    // Simulate loading for 1 second
    setTimeout(() => {
      setHistoryLoading(false);
      setShowHistory(true);
    }, 1000);
    // TODO: Replace dummy data with API call to fetch user's link history
  
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${API_URL}/${shortenedUrl}`);
    showAlert("Copied!", "success", "URL copied to clipboard");
  };
  //endregion

  //region Effects
  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`${API_URL}/api/ping`, { headers: { "x-api-key": API_KEY } })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isDeleting && currentIndex < fullText.length) {
      timer = setTimeout(() => {
        setAnimatedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 45);
    } else if (isDeleting && currentIndex > 0) {
      timer = setTimeout(() => {
        setAnimatedText(fullText.slice(0, currentIndex - 1));
        setCurrentIndex(currentIndex - 1);
      }, 25);
    } else if (!isDeleting && currentIndex === fullText.length) {
      timer = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && currentIndex === 0) {
      timer = setTimeout(() => setIsDeleting(false), 700);
    }
    return () => clearTimeout(timer);
  }, [currentIndex, isDeleting, fullText]);
  //endregion

  //region UI
  return (
    <div className="urlshortner-root">
      {swipe && <div className="theme-swipe" />}
      <div className="particles-bg">
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
      {/* Navbar */}
      <Navbar />
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
      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <section className="hero-section-url">
            <h1 className="hero-title">
              <span className="title-highlight">Shorten</span>{" "}
              <span className="title-normal">Your URLs User</span>
            </h1>
            <p className="hero-subtitle">
              {animatedText} <span className="cursor">|</span>
            </p>
          </section>
          <section className="shortener-card">
            <form
              className="shortener-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="input-group">
                <input
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  type="url"
                  className="url-input"
                  placeholder="Enter your long URL here..."
                  required
                />
                <button type="submit" className="btn-primary">
                  Shorten
                </button>
              </div>
            </form>
            {shortenedUrl && (
              <div className="result-section">
                <div className="result-card">
                  <div className="result-content">
                    <div>
                      <span className="result-label">Your shortened URL</span>
                      <button
                        onClick={copyToClipboard}
                        className="copy-btn"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                    </div>
                    <div className="result-url">
                      <LinkPreview
                        url={`${API_URL}/${shortenedUrl}`}
                        className="font-bold remove-decorations"
                      >
                        {`sho-rty.vercel.app/${shortenedUrl}`}
                      </LinkPreview>
                    </div>
                  </div>
                  <div ref={qrcodeRef} className="qr-section">
                    <div className="qr-label">Grab the link!</div>
                    <QRCodeCanvas
                      value={`${API_URL}/${shortenedUrl}`}
                      size={100}
                      bgColor="#23283a"
                      fgColor="#ffffff"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
          <section className="stats-section">
            {!showHistory && !historyLoading && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleViewHistory}
              >
                View History
              </button>
            )}
            {historyLoading && (
              <div className="loader-fade-wrapper show">
                <Loader />
              </div>
            )}
            {showHistory && !historyLoading && (
              <div className="history-table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Shortened Link</th>
                      <th>Created On</th>
                      <th>Expires On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((row, idx) => (
                      <tr key={idx}>
                        <td>
                          <a
                            href={`https://${row.shortUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {row.shortUrl}
                          </a>
                        </td>
                        <td>{row.createdAt}</td>
                        <td>{row.expiredAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* TODO: Replace dummy data with API response */}
              </div>
            )}
          </section>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
  //endregion
}

export default UrlShortnerUser;
