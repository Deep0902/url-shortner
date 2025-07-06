import axios from "axios";
import { useEffect, useState } from "react";
import Squares from "../../Reactbits/Squares";
import "./LandingPage.css";

// Import API key from environment variables
const API_KEY = import.meta.env.VITE_API_SECRET_KEY;
const API_URL = import.meta.env.VITE_API_URL;

function LandingPage() {
  const [animatedText, setAnimatedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const fullText = "Transform your links into powerful connections";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < fullText.length) {
        setAnimatedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentIndex, fullText]);

  const handleRedirect = () => {
    console.log("Redirecting to /url");
    window.location.href = "/url";
  };

  const features = [
    {
      title: "Lightning Fast",
      description: "Instant URL shortening with seconds response times",
    },
    {
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee",
    },
    {
      title: "Free to Use",
      description: "No hidden fees, no subscriptions. Just shorten and share",
    },
  ];

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
          // Completely out of view
          element.classList.remove("visible", "partial");
        } else if (ratio < 0.3) {
          // Partially visible
          element.classList.remove("visible");
          element.classList.add("partial");
        } else {
          // Mostly visible
          element.classList.add("visible");
          element.classList.remove("partial");
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll(".fade-on-scroll");
    sections.forEach((section) => observer.observe(section));
    handleGetStatus();
    return () => observer.disconnect();
  }, []);
  const [stats, setStats] = useState<{
    totalUrls: number | null;
    totalClicks: number | null;
  }>();
  const handleGetStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stats`, {
        headers: { "x-api-key": API_KEY },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };
  return (
    <>
      <div className="bg">
        {/* <Squares
          speed={0.2}
          squareSize={40}
          direction="diagonal" // up, down, left, right, diagonal
          borderColor="rgba(255, 255, 255, 0.1)"
          hoverFillColor="#222"
        /> */}
      </div>
      <div>
        <div className="landing-container">
          {/* Header */}
          <header className="header">
            <div className="header-content">
              <div className="logo">
                <img src="./url-short.svg" alt="" />
                <span className="logo-text">ChopURL</span>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <main className="hero-section fade-on-scroll">
            <div className="hero-content">
              <h1 className="hero-title">
                <span className="title-highlight">Shorten</span>
                <br />
                <span className="title-normal">Everything</span>
              </h1>

              <p className="hero-subtitle">
                {animatedText}
                <span className="cursor">|</span>
              </p>

              <div className="hero-button-container">
                <button onClick={handleRedirect} className="btn-primary">
                  Start Shortening
                </button>
              </div>

              {/* Stats */}
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number stat-blue">
                    {stats?.totalUrls}
                  </div>
                  <div className="stat-label">Links Shortened</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number stat-dark">90%+</div>
                  <div className="stat-label">Uptime</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number stat-gray">100+</div>
                  <div className="stat-label">Happy Users</div>
                </div>
              </div>
            </div>
          </main>

          {/* Features Section */}
          <section className="features-section fade-on-scroll">
            <div className="container">
              <h2 className="section-title">Why Choose ChopURL?</h2>

              <div className="features-grid">
                {features.map((feature, index) => (
                  <div key={index} className="feature-card">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section fade-on-scroll">
            <div className="container">
              <h2 className="cta-title">Ready to Transform Your Links?</h2>
              <p className="cta-description">
                Join thousands of users who trust ChopURL for their URL
                shortening needs
              </p>
              <button onClick={handleRedirect} className="btn-primary">
                Get Started Now
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer className="footer">
            <div className="container">
              <div className="footer-logo">
                <img src="./url-short.svg" alt="" />
                <span className="footer-logo-text">ChopURL</span>
              </div>
              <p className="footer-text">
                © 2024 ChopURL. Forging connections, one link at a time.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
