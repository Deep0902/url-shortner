import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CountUp from "../../Reactbits/CountUp";
import { LinkPreview } from "../../Reactbits/LinkPreview";
import Particles from "../../Reactbits/Particles";
import { API_KEY, API_URL } from "../../shared/constants";
import type { AlertState, UrlStatsResponse } from "../../shared/interfaces";
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
  // Copy button state
  const [copied, setCopied] = useState(false);
  // History state for user's shortened links
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyData, setHistoryData] = useState<UrlStatsResponse | null>(null);
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
  const [username, setUsername] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  // Avatar index state
  const [avatar, setAvatar] = useState<number | null>(null);
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

  //region Shortrn URL
  const handleSubmit = () => {
    let urlToShorten = originalUrl.trim();
    // If missing protocol, add https://
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
    const payload = {
      originalUrl: urlToShorten,
      userId: location.state.loginResponse.userId,
    };

    setLoading(true);
    axios
      .post(`${API_URL}/api/users/shorten`, payload, {
        headers: { "x-api-key": API_KEY },
      })
      .then((response) => {
        setLoading(false);
        if (response.data.shortUrl) {
          setCopied(false); // Reset copy state when new URL is generated
          setShortenedUrl(response.data.shortUrl);
          showAlert("Success!", "success", `URL shortened successfully`);
          if (showHistory) {
            handleViewHistory();
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.status === 429) {
          showAlert(
            "Storage Limit Reached",
            "error",
            "Delete existing URLs to free up space."
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

  // region History
  const handleViewHistory = async () => {
    setHistoryLoading(true);
    // Simulate loading for 1 second

    const payload = {
      userId: location.state.loginResponse.userId,
    };
    axios
      .post(`${API_URL}/api/users/stats`, payload, {
        headers: { "x-api-key": API_KEY },
      })
      .then((response) => {
        setHistoryLoading(false);
        setShowHistory(true);
        console.log(response);
        setHistoryData(response.data);
      })
      .catch((error) => {
        setHistoryLoading(false);
        showAlert("Error", "error", "error");
        console.error("Error in fetching history data", error);
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${API_URL}/${shortenedUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  //region CheckUser
  const checkUser = async () => {
    const payload = {
      userId: location.state.loginResponse.userId,
    };

    axios
      .post(`${API_URL}/api/user`, payload, {
        headers: { "x-api-key": API_KEY },
      })
      .then((response) => {
        // Set avatar index from response
        setAvatar(
          typeof response.data.avatar === "number" ? response.data.avatar : null
        );
        console.log("User check response:", response.data);
        setUsername(response.data.username);
      })
      .catch((error) => {
        setAvatar(null);
        console.error("Error checking user:", error);
      });
  };

  //region Delete short URL
  const handleDeleteShortUrl = async (shortUrl: string) => {
    setLoading(true);

    const payload = {
      userId: location.state.loginResponse.userId,
      shortUrl: shortUrl,
    };

    axios
      .delete(`${API_URL}/api/users/delete-url`, {
        data: payload,
        headers: { "x-api-key": API_KEY },
      })
      .then((response) => {
        if (response.status == 200) {
          setLoading(false);
          showAlert("Success!", "success", `Link Deleted Successfully`);
          handleViewHistory();
        }
      })
      .catch((error) => {
        setLoading(false);
        setAvatar(null);
        console.error("Error checking user:", error);
      });
  };

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

  useEffect(() => {
    try {
      if (location.state.loginResponse) {
        console.log(
          "Login response from Signin:",
          location.state.loginResponse
        );
        checkUser();
      } else {
        navigate(-1);
        console.log("No login response found in location state");
      }
    } catch (error) {
      console.error("Error accessing location.state.loginResponse:", error);
      navigate(-1);
    }
  }, []);

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
      <Navbar avatar={avatar} />
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
              <p>Hello {username}!</p>
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
              <div>
                <div className="history-table-wrapper">
                  {historyData?.urls && historyData.urls.length > 0 ? (
                    <div>
                      <table className="history-table">
                        <thead>
                          <tr>
                            <th>Shortened Link</th>
                            <th>Created On</th>
                            <th>Expires On</th>
                            <th>Clicks</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {historyData?.urls.map((row, idx) => (
                            <tr key={idx}>
                              <td>
                                <LinkPreview
                                  url={`${API_URL}/${row.shortUrl}`}
                                  className="font-bold remove-decorations"
                                >
                                  {`sho-rty.vercel.app/${row.shortUrl}`}
                                </LinkPreview>
                                {/* <a
                            href={`${API_URL}/${row.shortUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Go to original URL: ${row.originalUrl}`}
                          >
                            {row.shortUrl}
                          </a> */}
                              </td>

                              <td>
                                {new Date(row.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </td>
                              <td>
                                {new Date(row.expiresAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </td>

                              <td>{row.clicks}</td>
                              <td>
                                <button
                                  className="btn-secondary"
                                  onClick={() =>
                                    handleDeleteShortUrl(row.shortUrl)
                                  }
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <br />
                      <button
                        className="btn-primary"
                        onClick={handleViewHistory}
                      >
                        Refresh
                      </button>
                      &nbsp;
                      <button
                        className="btn-primary"
                        onClick={() => {
                          setShowHistory(false);
                        }}
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    <div className="no-data-found">
                      No links yet. Shorten one now!
                    </div>
                  )}
                </div>

                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">
                      <CountUp
                        from={0}
                        to={historyData?.urlCount ?? 0}
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
                        to={historyData?.totalClicks ?? 0}
                        separator=","
                        direction="up"
                        duration={1}
                        className="count-up-text"
                      />
                    </div>
                    <div className="stat-label">Total Clicks</div>
                  </div>
                </div>
                <div className="progressbar-wrapper">
                  <div className="progressbar-label">
                    {historyData?.urlCount ?? 0} / 20 URLs Shortened
                  </div>
                  <div className="progressbar-bg">
                    <div
                      className="progressbar-fill"
                      style={{
                        width: `${Math.min(
                          ((historyData?.urlCount ?? 0) / 20) * 100,
                          100
                        )}%`,
                        background:
                          (historyData?.urlCount ?? 0) >= 20
                            ? "var(--color-error)"
                            : (historyData?.urlCount ?? 0) > 17
                            ? "orange"
                            : "var(--color-blue)",
                      }}
                    />
                  </div>
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

export default UrlShortnerUser;
