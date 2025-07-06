// import { useEffect, useState, useRef } from "react";
// import "../src/pageStyles/Level4.css";

// const WORDS = [
//   "apple", "chair", "plane", "train", "juice", "plant", "dress", "mouse",
//   "couch", "house", "brick", "cloud", "smile", "glass", "phone", "watch",
//   "spoon", "zebra", "snake", "grape", "books", "candy", "drums", "pizza", "shoes"
// ];

// const getRandomWords = (count) => {
//   const shuffled = [...WORDS].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// };

// const Level4 = () => {
//   const [gridWords, setGridWords] = useState([]);
//   const [disabledWords, setDisabledWords] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [feedback, setFeedback] = useState(null);

//   const recognitionRef = useRef(null);
//   const successRef = useRef(false);

//   const currentWord = gridWords[currentIndex];

//   useEffect(() => {
//     const selected = getRandomWords(16);
//     setGridWords(selected);
//     setDisabledWords([]);
//     setCurrentIndex(0);
//   }, []);

//   useEffect(() => {
//     if (!currentWord) return;

//     // Speak the word
//     const speakPrompt = new SpeechSynthesisUtterance(`Say: ${currentWord}`);
//     speakPrompt.lang = "en-US";
//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(speakPrompt);

//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     successRef.current = false;

//     recognition.onresult = (event) => {
//       const spoken = event.results[0][0].transcript.trim().toLowerCase();
//       successRef.current = true;

//       if (spoken === currentWord.toLowerCase()) {
//         setDisabledWords((prev) => [...prev, currentWord]);
//         setFeedback({ type: "correct", message: `✅ You said "${spoken}"` });

//         if (currentIndex + 1 === gridWords.length) {
//           setFeedback({
//             type: "final",
//             message: "🎉 All words matched in order! Excellent!",
//           });
//         } else {
//           setTimeout(() => {
//             setFeedback(null);
//             setCurrentIndex((prev) => prev + 1);
//           }, 2000);
//         }
//       } else {
//         setFeedback({ type: "wrong", message: `❌ You said "${spoken}"` });
//         setTimeout(() => {
//           setFeedback(null);
//         }, 2000);
//       }
//     };

//     recognition.onerror = (event) => {
//       setFeedback({ type: "error", message: `⚠️ Error: ${event.error}` });
//       setTimeout(() => {
//         setFeedback(null);
//       }, 2000);
//     };

//     recognition.onend = () => {
//       if (!successRef.current) {
//         setFeedback({ type: "error", message: "😶 Didn't catch that. Moving on..." });

//         setTimeout(() => {
//           setDisabledWords((prev) => [...prev, currentWord]);

//           if (currentIndex + 1 === gridWords.length) {
//             setFeedback({
//               type: "final",
//               message: "🎉 Drill complete, even with some misses!",
//             });
//           } else {
//             setFeedback(null);
//             setCurrentIndex((prev) => prev + 1);
//           }
//         }, 2000);
//       }
//     };

//     recognition.start();
//     recognitionRef.current = recognition;

//     return () => {
//       recognition.abort();
//     };
//   }, [currentWord, currentIndex, gridWords]);

//   return (
//     <div className="level-container">
//       <div className="grid grid-cols-4 gap-4">
//         {gridWords.map((word, i) => (
//           <button
//             key={i}
//             className="border rounded p-4 bg-white text-lg font-bold shadow-md cursor-default disabled:opacity-40"
//             disabled={disabledWords.includes(word)}
//           >
//             {word}
//           </button>
//         ))}
//       </div>

//       {feedback && (
//         <div className={`overlay ${feedback.type}`}>
//           <div className="overlay-content">
//             <p className="overlay-message">{feedback.message}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Level4;

import { useEffect, useState, useRef } from "react";
import "../src/pageStyles/Level4.css";

const WORDS = [
  "apple", "chair", "plane", "train", "juice", "plant", "dress", "mouse",
  "couch", "house", "brick", "cloud", "smile", "glass", "phone", "watch",
  "spoon", "zebra", "snake", "grape", "books", "candy", "drums", "pizza", "shoes"
];

const getRandomWords = (count) => {
  const shuffled = [...WORDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const Level4 = () => {
  const [gridWords, setGridWords] = useState([]);
  const [disabledWords, setDisabledWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const recognitionRef = useRef(null);
  const successRef = useRef(false);

  const currentWord = gridWords[currentIndex];

  useEffect(() => {
    const selected = getRandomWords(16);
    setGridWords(selected);
    setDisabledWords([]);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (!currentWord) return;

    startRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentWord]);

  const startRecognition = () => {
    const speakPrompt = new SpeechSynthesisUtterance(`Say: ${currentWord}`);
    speakPrompt.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speakPrompt);

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    successRef.current = false;

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript.trim().toLowerCase();
      successRef.current = true;

      if (spoken === currentWord.toLowerCase()) {
        setDisabledWords((prev) => [...prev, currentWord]);
        setFeedback({ type: "correct", message: `✅ You said "${spoken}"` });

        if (currentIndex + 1 === gridWords.length) {
          setFeedback({
            type: "final",
            message: "🎉 All words matched in order! Excellent!",
          });
        } else {
          setTimeout(() => {
            setFeedback(null);
            setCurrentIndex((prev) => prev + 1);
          }, 2000);
        }
      } else {
        setFeedback({ type: "wrong", message: `❌ You said "${spoken}". Try again.` });
        setTimeout(() => {
          setFeedback(null);
          startRecognition(); // Retry same word
        }, 2000);
      }
    };

    recognition.onerror = (event) => {
      setFeedback({ type: "error", message: `⚠️ Error: ${event.error}` });
      setTimeout(() => {
        setFeedback(null);
        startRecognition(); // Retry same word
      }, 2000);
    };

    recognition.onend = () => {
      if (!successRef.current) {
        setFeedback({ type: "error", message: "😶 Didn't catch that. Let's try again." });
        setTimeout(() => {
          setFeedback(null);
          startRecognition(); // Retry same word
        }, 2000);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div className="level-container">
      <div className="grid grid-cols-4 gap-4">
        {gridWords.map((word, i) => (
          <button
            key={i}
            className="border rounded p-4 bg-white text-lg font-bold shadow-md cursor-default disabled:opacity-40"
            disabled={disabledWords.includes(word)}
          >
            {word}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`overlay ${feedback.type}`}>
          <div className="overlay-content">
            <p className="overlay-message">{feedback.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Level4;
