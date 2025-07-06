import "./LandingPage.css";

function LandingPage() {
  return (
    <>
      <h1 className="heading">
        This is the landing page. Click the button to redirect to the URL shortener.
      </h1>
      <button
        onClick={() => {
          window.location.href = "/url";
        }}
      >
        URL Page
      </button>
    </>
  );
}

export default LandingPage;
