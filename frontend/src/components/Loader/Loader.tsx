import "./Loader.css";

// Add a key to the root element to force remount on show/hide:
function Loader() {
  return (
    <div className="loader">
      <div className="cupcakeCircle box">
        <div className="cupcakeInner box">
          <div className="cupcakeCore box"></div>
        </div>
      </div>
    </div>
  );
}
export default Loader;
