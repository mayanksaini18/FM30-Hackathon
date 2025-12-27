import { useState, useEffect, useRef } from "react";

const TEXT =
  "The quick brown fox jumps over the lazy dog and tests your typing speed.";

const TOTAL_TIME = 10; // seconds

export default function App() {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const indexRef = useRef(0);

  /* -------------------- WPM & Accuracy -------------------- */

  const timeSpent = (TOTAL_TIME - timeLeft) / 60 || 1 / 60;
  const wpm = Math.round((typed.length / 5) / timeSpent);

  const correctChars = typed.length - errors;
  const accuracy =
    typed.length === 0
      ? 100
      : Math.round((correctChars / typed.length) * 100);

  /* -------------------- Keyboard Logic -------------------- */

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isRunning) return;
      if (e.key.length !== 1) return;

      const currentChar = TEXT[indexRef.current];

      if (e.key === currentChar) {
        setTyped((prev) => prev + e.key);
      } else {
        setErrors((prev) => prev + 1);
        setTyped((prev) => prev + e.key);
      }

      indexRef.current++;
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning]);

  /* -------------------- Timer Logic -------------------- */

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  /* -------------------- End Test -------------------- */

  useEffect(() => {
    if (timeLeft === 0) {
      setIsRunning(false);
      setShowModal(true);
    }
  }, [timeLeft]);

  /* -------------------- Restart -------------------- */

  const restartTest = () => {
    setTyped("");
    setErrors(0);
    setTimeLeft(TOTAL_TIME);
    setIsRunning(false);
    setShowModal(false);
    indexRef.current = 0;
  };

  /* -------------------- UI -------------------- */

  return (
    <div style={{ padding: "40px", fontFamily: "monospace" }}>
      <h1>Typing Speed Test</h1>

      <p>
        {TEXT.split("").map((char, idx) => {
          let color = "gray";

          if (idx < typed.length) {
            color = char === typed[idx] ? "green" : "red";
          } else if (idx === typed.length) {
            color = "blue";
          }

          return (
            <span key={idx} style={{ color }}>
              {char}
            </span>
          );
        })}
      </p>

      <h3>⏱ Time Left: {timeLeft}s</h3>
      <h3>❌ Errors: {errors}</h3>

      {!isRunning && !showModal && (
        <button onClick={() => setIsRunning(true)}>Start Test</button>
      )}

      {showModal && (
        <div style={{ marginTop: "20px", borderTop: "1px solid #ccc" }}>
          <h2>Results</h2>
          <p>⚡ WPM: {wpm}</p>
          <p>🎯 Accuracy: {accuracy}%</p>
          <button onClick={restartTest}>Restart</button>
        </div>
      )}
    </div>
  );
}
