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
  const [showAllLinks, setShowAllLinks] = useState(false);
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
    setShowAllLinks(false);
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

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    showAlert("Copied to clipboard!", "success", "");
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
        setUsername(response.data.username);
      })
      .catch((error) => {
        navigate(-1);
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
  const shareUrl = async (shortUrl: string, originalUrl: string) => {
    const fullUrl = `${API_URL}/${shortUrl}`;
    const shareText = `Check out this shortened link: ${fullUrl}`;

    // Check if Web Share API is supported (mainly on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Shortened URL",
          text: shareText,
          url: fullUrl,
        });
      } catch (error) {
        // User cancelled or error occurred, fallback to copy
        navigator.clipboard.writeText(`${shareText}\nOriginal: ${originalUrl}`);
        showAlert(
          "Copied to clipboard!",
          "success",
          "Share menu not available, copied instead"
        );
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`${shareText}\nOriginal: ${originalUrl}`);
      showAlert(
        "Copied to clipboard!",
        "success",
        "Share functionality copied to clipboard"
      );
    }
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

  const getDaysRemaining = (expiresAt: string): number => {
    const today = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
  };
  const getExpiryProgressPercent = (expiresAt: string): number => {
    const daysRemaining = getDaysRemaining(expiresAt);
    return (daysRemaining / 90) * 100;
  };

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
      <Navbar
        avatar={avatar}
        userId={location.state.loginResponse.userId}
        username={username}
        onUsernameChange={() => checkUser()} // <-- This will re-fetch user data
      />
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
              <div className="text">
                <span className="title-highlight">Shorten</span>{" "}
                <span className="title-normal">Your URLs</span>
              </div>
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
                      <img
                        src="./Copy.svg"
                        alt=""
                        onClick={() =>
                          copyToClipboard(`${API_URL}/${shortenedUrl}`)
                        }
                      />
                      <img
                        src="./Share.svg"
                        alt=""
                        onClick={() =>
                          shareUrl(`${API_URL}/${shortenedUrl}`, originalUrl)
                        }
                      />
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
                      <div className="cards-container">
                        {(showAllLinks
                          ? historyData?.urls
                          : historyData?.urls.slice(0, 3)
                        )?.map((row, idx) => (
                          <div key={idx} className="card">
                            <div className="card-info">
                              <div className="clicks-info">
                                <img src="./click.svg" alt="" />
                                <span className="number">
                                  {row.clicks > 10 ? "10+" : row.clicks}
                                </span>
                                <span className="">Clicks</span>
                              </div>
                              <div className="url-info">
                                <div className="shorty">
                                  <span>
                                    <LinkPreview
                                      url={`${API_URL}/${row.shortUrl}`}
                                      className="font-bold remove-decorations"
                                    >
                                      {`sho-rty.vercel.app/${row.shortUrl}`}
                                    </LinkPreview>
                                  </span>
                                  <img
                                    src="./Copy.svg"
                                    alt=""
                                    onClick={() =>
                                      copyToClipboard(
                                        `${API_URL}/${row.shortUrl}`
                                      )
                                    }
                                  />
                                  <img
                                    src="./Share.svg"
                                    alt=""
                                    onClick={() =>
                                      shareUrl(row.shortUrl, row.originalUrl)
                                    }
                                  />
                                </div>
                                <span>{row.originalUrl}</span>
                              </div>
                              <div
                                className="delete-icon"
                                onClick={() =>
                                  handleDeleteShortUrl(row.shortUrl)
                                }
                              >
                                <img src="./delete.svg" alt="" />
                              </div>
                            </div>
                            <div className="progress">
                              <span className="day-countdown">
                                {getDaysRemaining(row.expiresAt)} Days Remaining
                              </span>
                              <div
                                className="progress-bar"
                                style={{
                                  width: `${getExpiryProgressPercent(
                                    row.expiresAt
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <br />
                      <button
                        className="btn-primary"
                        onClick={handleViewHistory}
                      >
                        Refresh
                      </button>
                      &nbsp;
                      {historyData?.urls && historyData.urls.length > 3 && (
                        <button
                          className="btn-secondary close-btn"
                          onClick={() => setShowAllLinks(!showAllLinks)}
                        >
                          {showAllLinks
                            ? "Show Less"
                            : `View All (${historyData.urls.length})`}
                        </button>
                      )}
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
