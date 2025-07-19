import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import CountUp from "../../Reactbits/CountUp";
import { LinkPreview } from "../../Reactbits/LinkPreview";
import Particles from "../../Reactbits/Particles";
import { API_KEY, API_URL } from "../../shared/constants";
import type { AlertState } from "../../shared/interfaces";
import Alert from "../Alert/Alert";
import Footer from "../Footer/Footer";
import Loader from "../Loader/Loader";
import Navbar from "../Navbar/Navbar";
import "./UrlShortner.css";

function UrlShortner() {
  //region State
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
  const [swipe] = useState(false);
  const qrcodeRef = useRef<HTMLDivElement>(null);
  const fullText = "Transform long URLs into clean, shareable links in seconds";
  const [animatedText, setAnimatedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const canShorten = localStorage.getItem("canShorten");
  const [copied, setCopied] = useState(false);

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
    // In handleSubmit, update the normalization and regex for edge cases:
    let urlToShorten = originalUrl.trim();
    if (
      !/^https?:\/\//i.test(urlToShorten) &&
      !/^ftp:\/\//i.test(urlToShorten) &&
      !/^sftp:\/\//i.test(urlToShorten)
    ) {
      urlToShorten = "https://" + urlToShorten;
    }
    const websiteRegex =
      /^(https?|ftp|sftp):\/\/((([\w-]+\.)+[\w-]{2,}|localhost|\d{1,3}(\.\d{1,3}){3})(:\d+)?)(\/[\w\-./?%&=]*)?$/i;
    if (!websiteRegex.test(urlToShorten)) {
      showAlert(
        "Invalid URL",
        "error",
        "Please enter a valid URL (supports http, https, ftp, sftp, localhost, IPs)"
      );
      return;
    }
    if (canShorten !== null && canShorten === "false") {
      showAlert(
        "Sign In Required",
        "error",
        "You need to sign in to shorten more links."
      );
      return;
    }
    setLoading(true);
    axios
      .post(
        `${API_URL}/api/shorten`,
        { originalUrl: urlToShorten },
        { headers: { "x-api-key": API_KEY } }
      )
      .then((response) => {
        setLoading(false);
        if (response.data.shortUrl) {
          setShortenedUrl(response.data.shortUrl);
          showAlert("Success!", "success", `URL shortened successfully`);
          localStorage.setItem("canShorten", "false"); // Set boolean to false
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${API_URL}/${shortenedUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  //endregion

  //region Effects
  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`${API_URL}/api/ping`, { headers: { "x-api-key": API_KEY } })
      .catch(() => {});
    if (canShorten !== null && canShorten === "false") {
      showAlert(
        "Sign In Required",
        "error",
        "You need to sign in to shorten more links."
      );
    }
    // Check localStorage for canShorten
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
              <span className="title-normal">Your URLs</span>
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
                  type="text"
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
                        {copied ? "✔️" : "🔗"}
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
            <button
              type="button"
              className="btn-secondary"
              onClick={handleGetStatus}
            >
              View Statistics
            </button>
            {stats && (
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">
                    <CountUp
                      from={0}
                      to={stats.totalUrls ?? 0}
                      separator=","
                      direction="up"
                      duration={1}
                      className="count-up-text"
                    />
                  </div>
                  <div className="stat-label">Total URLs</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">
                    <CountUp
                      from={0}
                      to={stats.totalClicks ?? 0}
                      separator=","
                      direction="up"
                      duration={1}
                      className="count-up-text"
                    />
                  </div>
                  <div className="stat-label">Total Clicks</div>
                </div>
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

export default UrlShortner;
