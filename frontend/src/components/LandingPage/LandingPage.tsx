import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../ThemeContext";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import "./LandingPage.css";

function LandingPage() {
  const [animatedText, setAnimatedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const { theme } = useContext(ThemeContext);

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
      description: "Instant URL shortening with quick response times",
    },
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
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current || document.body;
    if (theme === "light") {
      root.classList.add("light-theme");
      root.classList.remove("dark-theme");
    } else {
      root.classList.remove("light-theme");
      root.classList.add("dark-theme");
    }
  }, [theme]);

  return (
    <div ref={rootRef}>
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
            <div className="stats-grid-landing">
              <div className="stat-item">
                <div className="stat-number stat-blue">10</div>
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
              Join thousands of users who trust ChopURL for their URL shortening
              needs
            </p>
            <button onClick={handleRedirect} className="btn-primary">
              Get Started Now
            </button>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
