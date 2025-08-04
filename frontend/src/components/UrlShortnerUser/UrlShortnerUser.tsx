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

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
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
                      <button
                        onClick={() =>
                          copyToClipboard(`${API_URL}/${shortenedUrl}`)
                        }
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
                      {/*<table className="history-table">
                        <thead>
                          <tr>
                            <th>Shortened Link</th>
                            <th>Original Link</th>
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
                              </td>
                              <td>
                                <LinkPreview
                                  url={`${row.originalUrl}`}
                                  className="font-bold remove-decorations"
                                >
                                  {`${row.originalUrl}`}
                                </LinkPreview>
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
                                <svg
                                  className="delete-icon"
                                  viewBox="0 0 76 75"
                                  fill="none"
                                  onClick={() =>
                                    handleDeleteShortUrl(row.shortUrl)
                                  }
                                >
                                  <g className="delete-icon-border">
                                    <path
                                      d="M73.2984 18.2C71.6984 9.8 65.1984 3.4 56.8984 1.8C44.3984 -0.6 31.5984 -0.6 19.0984 1.8C10.6984 3.4 4.29844 9.9 2.69844 18.2C0.298437 30.7 0.298437 43.5 2.69844 56C4.29844 64.4 10.7984 70.8 19.0984 72.4C25.3984 73.6 31.6984 74.2 37.9984 74.2C44.2984 74.2 50.5984 73.6 56.8984 72.4C65.2984 70.8 71.6984 64.3 73.2984 56C75.7984 43.5 75.7984 30.7 73.2984 18.2ZM69.7984 55.3C68.4984 62.2 63.0984 67.5 56.1984 68.9C44.0984 71.2 31.8984 71.2 19.7984 68.9C12.8984 67.6 7.59844 62.2 6.19844 55.3C3.89844 43.2 3.89844 31 6.19844 18.9C7.49844 12 12.8984 6.7 19.7984 5.3C25.7984 4.1 31.8984 3.6 37.9984 3.6C44.0984 3.6 50.1984 4.2 56.1984 5.3C63.0984 6.6 68.3984 12 69.7984 18.9C72.0984 31 72.0984 43.2 69.7984 55.3Z"
                                      fill="#EF4444"
                                    />
                                  </g>

                                  <g className="delete-icon-center">
                                    <path
                                      d="M53.5977 27.0001H43.9977V25.3001C43.9977 23.0001 42.0977 21.1001 39.7977 21.1001H36.1977C33.8977 21.1001 31.9977 23.0001 31.9977 25.3001V27.0001H22.3977C21.3977 27.0001 20.5977 27.8001 20.5977 28.8001C20.5977 29.8001 21.3977 30.6001 22.3977 30.6001H23.6977L27.5977 51.5001C27.7977 52.4001 28.4977 53.0001 29.3977 53.0001H46.6977C47.5977 53.0001 48.2977 52.4001 48.4977 51.5001L52.3977 30.6001H53.6977C54.6977 30.6001 55.4977 29.8001 55.4977 28.8001C55.4977 27.9001 54.5977 27.0001 53.5977 27.0001ZM35.5977 25.3001C35.5977 25.0001 35.8977 24.8001 36.1977 24.8001H39.7977C40.0977 24.8001 40.3977 25.0001 40.3977 25.3001V27.0001H35.5977V25.3001ZM45.0977 49.4001H30.8977L27.3977 30.6001H48.6977L45.0977 49.4001Z"
                                      fill="#EF4444"
                                    />
                                    <path
                                      d="M33.8999 33.4999C32.8999 33.5999 32.0999 34.3999 32.1999 35.3999L32.6999 44.0999C32.7999 45.0999 33.5999 45.7999 34.4999 45.7999H34.5999C35.5999 45.6999 36.3999 44.8999 36.2999 43.8999L35.7999 35.1999C35.6999 34.1999 34.8999 33.3999 33.8999 33.4999Z"
                                      fill="#EF4444"
                                    />
                                    <path
                                      d="M40.1999 35.1999L39.6999 43.8999C39.5999 44.8999 40.3999 45.7999 41.3999 45.7999H41.4999C42.4999 45.7999 43.2999 45.0999 43.2999 44.0999L43.7999 35.3999C43.8999 34.3999 43.0999 33.4999 42.0999 33.4999C41.0999 33.3999 40.2999 34.1999 40.1999 35.1999Z"
                                      fill="#EF4444"
                                    />
                                  </g>
                                </svg>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>*/}
                      <div className="cards-container">
                        {historyData?.urls.map((row, idx) => (
                          <div key={idx} className="card">
                            <div className="card-info">
                              <div className="clicks-info">
                                <img src="./click.svg" alt="" />
                                <span className="number">{row.clicks}</span>
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
                                  <img src="./Share.svg" alt="" />
                                </div>
                                <span>{row.originalUrl}</span>
                              </div>
                              <div className="delete-icon">
                                <svg
                                  className="delete-icon"
                                  // viewBox="0 0 76 75"
                                  fill="none"
                                  onClick={() =>
                                    handleDeleteShortUrl(row.shortUrl)
                                  }
                                >
                                  <g className="delete-icon-border">
                                    <path
                                      d="M73.2984 18.2C71.6984 9.8 65.1984 3.4 56.8984 1.8C44.3984 -0.6 31.5984 -0.6 19.0984 1.8C10.6984 3.4 4.29844 9.9 2.69844 18.2C0.298437 30.7 0.298437 43.5 2.69844 56C4.29844 64.4 10.7984 70.8 19.0984 72.4C25.3984 73.6 31.6984 74.2 37.9984 74.2C44.2984 74.2 50.5984 73.6 56.8984 72.4C65.2984 70.8 71.6984 64.3 73.2984 56C75.7984 43.5 75.7984 30.7 73.2984 18.2ZM69.7984 55.3C68.4984 62.2 63.0984 67.5 56.1984 68.9C44.0984 71.2 31.8984 71.2 19.7984 68.9C12.8984 67.6 7.59844 62.2 6.19844 55.3C3.89844 43.2 3.89844 31 6.19844 18.9C7.49844 12 12.8984 6.7 19.7984 5.3C25.7984 4.1 31.8984 3.6 37.9984 3.6C44.0984 3.6 50.1984 4.2 56.1984 5.3C63.0984 6.6 68.3984 12 69.7984 18.9C72.0984 31 72.0984 43.2 69.7984 55.3Z"
                                      fill="#EF4444"
                                    />
                                  </g>
                                  <g className="delete-icon-center">
                                    <path
                                      d="M53.5977 27.0001H43.9977V25.3001C43.9977 23.0001 42.0977 21.1001 39.7977 21.1001H36.1977C33.8977 21.1001 31.9977 23.0001 31.9977 25.3001V27.0001H22.3977C21.3977 27.0001 20.5977 27.8001 20.5977 28.8001C20.5977 29.8001 21.3977 30.6001 22.3977 30.6001H23.6977L27.5977 51.5001C27.7977 52.4001 28.4977 53.0001 29.3977 53.0001H46.6977C47.5977 53.0001 48.2977 52.4001 48.4977 51.5001L52.3977 30.6001H53.6977C54.6977 30.6001 55.4977 29.8001 55.4977 28.8001C55.4977 27.9001 54.5977 27.0001 53.5977 27.0001ZM35.5977 25.3001C35.5977 25.0001 35.8977 24.8001 36.1977 24.8001H39.7977C40.0977 24.8001 40.3977 25.0001 40.3977 25.3001V27.0001H35.5977V25.3001ZM45.0977 49.4001H30.8977L27.3977 30.6001H48.6977L45.0977 49.4001Z"
                                      fill="#EF4444"
                                    />
                                    <path
                                      d="M33.8999 33.4999C32.8999 33.5999 32.0999 34.3999 32.1999 35.3999L32.6999 44.0999C32.7999 45.0999 33.5999 45.7999 34.4999 45.7999H34.5999C35.5999 45.6999 36.3999 44.8999 36.2999 43.8999L35.7999 35.1999C35.6999 34.1999 34.8999 33.3999 33.8999 33.4999Z"
                                      fill="#EF4444"
                                    />
                                    <path
                                      d="M40.1999 35.1999L39.6999 43.8999C39.5999 44.8999 40.3999 45.7999 41.3999 45.7999H41.4999C42.4999 45.7999 43.2999 45.0999 43.2999 44.0999L43.7999 35.3999C43.8999 34.3999 43.0999 33.4999 42.0999 33.4999C41.0999 33.3999 40.2999 34.1999 40.1999 35.1999Z"
                                      fill="#EF4444"
                                    />
                                  </g>
                                </svg>
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
                      <button
                        className="btn-secondary close-btn"
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
