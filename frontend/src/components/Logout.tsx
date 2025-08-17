import axios from "axios";
import { useEffect, useState } from "react";
import { API_KEY, API_URL } from "../shared/constants";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader/Loader";
function Logout() {
  const navigate = useNavigate();
    const [historyLoading, setHistoryLoading] = useState(false);
  const logout = async () => {
    setHistoryLoading(true);
    sessionStorage.removeItem("userCredentials");
    await axios
      .post(
        `/api/logout`,
        {},
        {
          withCredentials: true,
          headers: { "x-api-key": API_KEY },
        }
      )
      .then(() => {
        setHistoryLoading(false);
        navigate("/");
    })
    .catch(() => {
        // Optionally handle error, e.g., navigate anyway or show a message
        setHistoryLoading(false);
        navigate("/");
      });
  };
  useEffect(() => {
    logout();
  });
  return (
    <>
      {historyLoading && (
        <div className="loader-fade-wrapper show">
          <Loader />
        </div>
      )}
    </>
  );
}

export default Logout;
