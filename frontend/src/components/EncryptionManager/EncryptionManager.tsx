import { useState } from "react";
const DEFAULT_SECRET_KEY = import.meta.env.VITE_API_SECRET_KEY || "";
import CryptoJS from "crypto-js";
import Navbar from "../Navbar/Navbar";
import "./EncryptionManager.css";

function EncryptionManager() {
  const [encryptInput, setEncryptInput] = useState("");
  const [decryptInput, setDecryptInput] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");

  const handleEncrypt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!encryptInput || !DEFAULT_SECRET_KEY) return;
    const encrypted = CryptoJS.AES.encrypt(encryptInput, DEFAULT_SECRET_KEY).toString();
    setEncryptedText(encrypted);
  };

  const handleDecrypt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decryptInput || !DEFAULT_SECRET_KEY) return;
    try {
      const bytes = CryptoJS.AES.decrypt(decryptInput, DEFAULT_SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      setDecryptedText(decrypted || "Invalid key or ciphertext");
    } catch {
      setDecryptedText("Invalid key or ciphertext");
    }
  };

  return (
      <div className="encrypt-main">
        <Navbar />
        <div className="encrypt-page">
          <section className="encrypt-content">
            <h2 style={{ color: "var(--color-blue)", textAlign: "center" }}>
              Encryption / Decryption Utility
            </h2>
            <br />
            <div className="encrypt-row">
              <div className="encrypt-col">
                <form onSubmit={handleEncrypt}>
                  <label
                    htmlFor="encrypt-input"
                    style={{ color: "var(--color-text-main)" }}
                  >
                    Text to Encrypt
                  </label>
                  <input
                    id="encrypt-input"
                    type="text"
                    value={encryptInput}
                    onChange={(e) => setEncryptInput(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      marginBottom: "0.5rem",
                      background: "var(--color-bg-accent)",
                      color: "var(--color-text-main)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 6,
                    }}
                    placeholder="Enter text"
                  />
                  <button
                    type="submit"
                    style={{
                      background: "var(--color-blue)",
                      color: "var(--color-white)",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: 6,
                      cursor: "pointer",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Encrypt
                  </button>
                  {encryptedText && (
                    <div
                      style={{
                        marginTop: "1rem",
                        background: "var(--color-bg-accent)",
                        color: "var(--color-success)",
                        padding: "0.5rem",
                        borderRadius: 6,
                        wordBreak: "break-all",
                      }}
                    >
                      <strong>Encrypted:</strong> {encryptedText}
                    </div>
                  )}
                </form>
              </div>
              <div className="encrypt-col">
                <form onSubmit={handleDecrypt}>
                  <label
                    htmlFor="decrypt-input"
                    style={{ color: "var(--color-text-main)" }}
                  >
                    Text to Decrypt
                  </label>
                  <input
                    id="decrypt-input"
                    type="text"
                    value={decryptInput}
                    onChange={(e) => setDecryptInput(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      marginBottom: "0.5rem",
                      background: "var(--color-bg-accent)",
                      color: "var(--color-text-main)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 6,
                    }}
                    placeholder="Enter encrypted text"
                  />
                  <button
                    type="submit"
                    style={{
                      background: "var(--color-blue)",
                      color: "var(--color-white)",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: 6,
                      cursor: "pointer",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Decrypt
                  </button>
                  {decryptedText && (
                    <div
                      style={{
                        marginTop: "1rem",
                        background: "var(--color-bg-accent)",
                        color: "var(--color-success)",
                        padding: "0.5rem",
                        borderRadius: 6,
                        wordBreak: "break-all",
                      }}
                    >
                      <strong>Decrypted:</strong> {decryptedText}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
  );
}

export default EncryptionManager;
