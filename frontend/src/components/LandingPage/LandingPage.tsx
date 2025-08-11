import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "../../Reactbits/CountUp";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import "./LandingPage.css";

function LandingPage() {
  //region State
  const [animatedText, setAnimatedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const fullText = "Transform your links into powerful connections";
  const navigate = useNavigate();
  //endregion

  //region Data
  const features = [
    {
      title: "Secure & Reliable",
      description: "Enterprise-grade security with uptime guarantee",
    },
    {
      title: "Free to Use",
      description: "No hidden fees, no subscriptions. Just shorten and share",
    },
    {
      title: "Long-Lasting Links",
      description:
        "Shortened links stay active for 3 months. Share and track easily",
    },
  ];
  //endregion

  //region Effects
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
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target;
        const ratio = entry.intersectionRatio;
        if (ratio === 0) {
          element.classList.remove("visible", "partial");
        } else if (ratio < 0.3) {
          element.classList.remove("visible");
          element.classList.add("partial");
        } else {
          element.classList.add("visible");
          element.classList.remove("partial");
        }
      });
    }, observerOptions);
    const sections = document.querySelectorAll(".fade-on-scroll");
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  //endregion

  //region Handlers
  const handleRedirect = () => {
    console.log("Redirecting to /url");
    navigate("/url");
  };
  //endregion

  //region UI
  return (
    <div>
      <div className="bg">
        {/* <Squares
          speed={0.2}
          squareSize={40}
          direction="diagonal" // up, down, left, right, diagonal
          borderColor="rgba(255, 255, 255, 0.1)"
          hoverFillColor="#222"
        /> */}
      </div>
      <div className="landing-container">
        {/* Navbar */}
        <Navbar />

        {/* Hero Section - Redesigned */}
        <main className="hero-section-redesigned fade-on-scroll">
          <div className="hero-container">
            <div className="hero-left">
              <div className="hero-svg-container">
                <svg
                  className="hero-svg"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="heroGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="var(--color-blue)" />
                      <stop offset="100%" stopColor="var(--color-blue-dark)" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="100"
                    cy="50"
                    r="8"
                    fill="var(--color-blue)"
                    className="svg-animate-1"
                  />
                  <circle
                    cx="150"
                    cy="80"
                    r="6"
                    fill="var(--color-blue-light)"
                    className="svg-animate-2"
                  />
                  <circle
                    cx="50"
                    cy="90"
                    r="4"
                    fill="var(--color-blue)"
                    className="svg-animate-3"
                  />
                  <path
                    d="M20 120 Q100 80 180 120 Q100 160 20 120"
                    fill="none"
                    stroke="url(#heroGradient)"
                    strokeWidth="3"
                    className="svg-path"
                  />
                  <rect
                    x="40"
                    y="140"
                    width="120"
                    height="20"
                    rx="10"
                    fill="var(--color-bg-accent)"
                    className="svg-rect"
                  />
                  <rect
                    x="50"
                    y="145"
                    width="80"
                    height="10"
                    rx="5"
                    fill="var(--color-blue)"
                    className="svg-rect-inner"
                  />
                </svg>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-title-compact">
                <span className="title-highlight">Shorten</span>
                <span className="title-normal">Everything</span>
              </div>
              <p className="hero-subtitle-compact">
                {animatedText}
                <span className="cursor">|</span>
              </p>
              <div className="hero-buttons-compact">
                <button onClick={handleRedirect} className="btn-primary">
                  Try Demo
                </button>
                <button
                  onClick={() => {
                    window.scrollTo(0, 0);
                    navigate("/sign?mode=signin");
                  }}
                  className="btn-secondary"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>

          {/* Eye-catching scroll prompt */}
          <div className="scroll-prompt">
            <span className="scroll-text">
              Discover the power of smart URL shortening
            </span>
            <div className="scroll-arrow">↓</div>
          </div>
        </main>

        {/* What is ChopURL Section */}
        <section className="what-is-section fade-on-scroll">
          <div className="container">
            <h2 className="section-title">What is ChopURL?</h2>
            <div className="what-is-content">
              <p className="what-is-description">
                ChopURL is a powerful, free URL shortening service designed for
                the modern web. Transform long, unwieldy links into clean,
                shareable URLs that look professional and track beautifully.
                Whether you're a marketer, developer, or content creator,
                ChopURL makes link management effortless.
              </p>
              <div className="what-is-features">
                <div className="mini-feature">
                  <span className="mini-feature-icon">⚡</span>
                  <span>Lightning Fast</span>
                </div>
                <div className="mini-feature">
                  <span className="mini-feature-icon">🔒</span>
                  <span>Secure & Reliable</span>
                </div>
                <div className="mini-feature">
                  <span className="mini-feature-icon">📊</span>
                  <span>Analytics Ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose ChopURL Section - Creative Alternating Layout */}
        <section className="why-choose-section fade-on-scroll">
          <div className="container">
            <h2 className="section-title">Why Choose ChopURL?</h2>

            <div className="features-alternating">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`feature-row ${
                    index % 2 === 0 ? "feature-row-left" : "feature-row-right"
                  }`}
                  style={{ animationDelay: `${0.2 * index}s` }}
                >
                  <div className="feature-content">
                    <div className="feature-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="feature-text">
                      <h3 className="feature-title-alt">{feature.title}</h3>
                      <p className="feature-description-alt">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <div className="feature-visual">
                    <div className="feature-icon-large">
                      {index === 0 && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                      )}
                      {index === 1 && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          />
                          <circle cx="12" cy="16" r="1" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      )}
                      {index === 2 && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 3v18h18" />
                          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-showcase fade-on-scroll">
          <div className="container">
            <div className="stats-grid-showcase">
              <div className="stat-card">
                <div className="stat-icon">🔗</div>
                <div className="stat-number-large">
                  <CountUp
                    from={0}
                    to={10}
                    separator=","
                    direction="up"
                    duration={2}
                    className="count-up-text-large"
                  />
                </div>
                <div className="stat-label-large">Links Shortened</div>
                <div className="stat-description">
                  URLs transformed and ready to share
                </div>
              </div>

              <div className="stat-card stat-card-featured">
                <div className="stat-icon">⚡</div>
                <div className="stat-number-large stat-featured">
                  <CountUp
                    from={0}
                    to={90}
                    separator=","
                    direction="up"
                    duration={2}
                    className="count-up-text-large"
                  />
                  <span className="stat-suffix">%+</span>
                </div>
                <div className="stat-label-large">Uptime</div>
                <div className="stat-description">
                  Reliable service you can count on
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">😊</div>
                <div className="stat-number-large">
                  <CountUp
                    from={0}
                    to={100}
                    separator=","
                    direction="up"
                    duration={2}
                    className="count-up-text-large"
                  />
                  <span className="stat-suffix">+</span>
                </div>
                <div className="stat-label-large">Happy Users</div>
                <div className="stat-description">
                  Satisfied customers worldwide
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section fade-on-scroll">
          <div className="container">
            <h2 className="cta-title">Ready to Transform Your Links?</h2>
            <p className="cta-description">
              Join thousands of users who trust ChopURL for their URL shortening
              needs
            </p>
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                navigate("/sign?mode=signup");
              }}
              className="btn-primary"
            >
              Get Started Now
            </button>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
  //endregion
}

export default LandingPage;
