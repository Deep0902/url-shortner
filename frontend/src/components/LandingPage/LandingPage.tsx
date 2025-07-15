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

        {/* Hero Section */}
        <main className="hero-section fade-on-scroll">
          <div className="hero-content">
            <div className="hero-title">
              <span className="title-highlight">Shorten</span>
              <br />
              <span className="title-normal">Everything</span>
            </div>

            <p className="hero-subtitle">
              {animatedText}
              <span className="cursor">|</span>
            </p>

            <div className="hero-button-container">
              <button onClick={handleRedirect} className="btn-primary">
                Start Shortening
              </button>
              <button
                onClick={() => {
                  navigate("/encrypt");
                }}
                className="btn-primary"
              >
                Encrypt Manager
              </button>
            </div>

            {/* Stats */}
            <div className="stats-grid-landing">
              <div
                className="stat-item"
                style={{ animationDelay: `${0.3 * 0}s` }}
              >
                <div className="stat-number stat-blue">
                  <CountUp
                    from={0}
                    to={10}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />
                </div>
                <div className="stat-label">Links Shortened</div>
              </div>
              <div
                className="stat-item"
                style={{ animationDelay: `${0.3 * 1}s` }}
              >
                <div className="stat-number stat-dark">
                  <CountUp
                    from={0}
                    to={90}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />
                  %+
                </div>
                <div className="stat-label">Uptime</div>
              </div>
              <div
                className="stat-item"
                style={{ animationDelay: `${0.3 * 2}s` }}
              >
                <div className="stat-number stat-gray">
                  <CountUp
                    from={0}
                    to={100}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />
                  +
                </div>
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
                <div
                  key={index}
                  className="feature-card"
                  style={{ animationDelay: `${0.6 * index}s` }}
                >
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
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                navigate("/sign");
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
