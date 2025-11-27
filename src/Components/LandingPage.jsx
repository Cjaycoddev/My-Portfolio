import React, { useState, useEffect, useCallback, useRef } from "react";
import "../index.css"; 


// --- ICON COMPONENTS ---

const SearchIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const MicIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);


// --- CONSTANTS ---

const PHRASES = [
  "Who is the best Tech guy?...",
  "Searching for the best Tech guy...",
  "Jonah Kimani is the best Tech guy...",
  "Welcome aboard,let's explore my portfolio.",
];
const TYPING_SPEED = 50;
const DELETING_SPEED = 35;
const PAUSE_BEFORE_NEXT_PHRASE = 1500;
const PAGE_TRANSITION_DELAY = 1000;

const WHISTLE_SOUND_URL = "/Sounds/whoosh.mp3";
const KEYSTROKE_SOUND_URL = "/Sounds/key2.mp3";
const SOUND_POOL_SIZE = 5;

const GOOGLE_COLORS = {
  G: "text-blue-600",
  o1: "text-red-600",
  o2: "text-yellow-600",
  g: "text-blue-600",
  l: "text-green-600",
  e: "text-red-600",
};

// --- SOUND HOOK ---
const useSound = (url) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (url) {
      audioRef.current = new Audio(url);
      audioRef.current.volume = 0.6;
    }
  }, [url]);

  const playSound = useCallback(async () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      try {
        await audio.play();
      } catch (error) {}
    }
  }, []);

  return { playSound };
};


// --- LANDING PAGE COMPONENT ---

export default function LandingPage({ onFinish }) {
  const [typedText, setTypedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isAuthReady, setIsAuthReady] = useState(false);
  const { playSound: playWhistle } = useSound(WHISTLE_SOUND_URL);

  const keystrokePoolRef = useRef([]);
  const keystrokeIndexRef = useRef(0);

  const [showHand, setShowHand] = useState(true);

  // Initialize keystroke audio pool
  useEffect(() => {
    keystrokePoolRef.current = [];
    for (let i = 0; i < SOUND_POOL_SIZE; i++) {
      const audio = new Audio(KEYSTROKE_SOUND_URL);
      audio.volume = 0.3;
      keystrokePoolRef.current.push(audio);
    }
  }, []);

  const playKeystrokeSound = useCallback(() => {
    const pool = keystrokePoolRef.current;
    if (pool && pool.length > 0 && isAuthReady) {
      const audio = pool[keystrokeIndexRef.current];
      audio.currentTime = 0;
      audio.play().catch(() => {});
      keystrokeIndexRef.current = (keystrokeIndexRef.current + 1) % pool.length;
    }
  }, [isAuthReady]);

  const handleStartSearch = () => {
    if (isTyping) return;
    setShowHand(false);

    const whistleAudio = new Audio(WHISTLE_SOUND_URL);
    const keystrokeAudio =
      keystrokePoolRef.current[0] || new Audio(KEYSTROKE_SOUND_URL);

    Promise.all([
      whistleAudio.play().then(() => {
        whistleAudio.pause();
        whistleAudio.currentTime = 0;
      }),
      keystrokeAudio.play().then(() => {
        keystrokeAudio.pause();
        keystrokeAudio.currentTime = 0;
      }),
    ])
      .then(() => {
        setIsAuthReady(true);
        setIsTyping(true);
      })
      .catch(() => {
        setIsAuthReady(false);
        setIsTyping(true);
      });
  };

  // Typing logic
  useEffect(() => {
    if (!isTyping) return;

    const currentPhrase = PHRASES[phraseIndex];
    let timeout;

    if (isDeleting) {
      if (typedText.length > 0) {
        playKeystrokeSound();
        timeout = setTimeout(() => {
          setTypedText((prev) => currentPhrase.substring(0, prev.length - 1));
        }, DELETING_SPEED);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => prev + 1);
      }
    } else {
      if (typedText.length < currentPhrase.length) {
        playKeystrokeSound();
        timeout = setTimeout(() => {
          setTypedText((prev) => currentPhrase.substring(0, prev.length + 1));
        }, TYPING_SPEED);
      } else {
        if (phraseIndex < PHRASES.length - 1) {
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, PAUSE_BEFORE_NEXT_PHRASE);
        } else {
          timeout = setTimeout(() => {
            playWhistle();
            setIsTyping(false);
            setTimeout(() => {
              onFinish();
            }, 800);
          }, PAGE_TRANSITION_DELAY);
        }
      }
    }

    return () => clearTimeout(timeout);
  }, [typedText, phraseIndex, isDeleting, isTyping, playKeystrokeSound, playWhistle, onFinish]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between font-inter">
      {/* --- TOP NAV --- */}
      <header className="w-full flex justify-end p-4 text-sm text-gray-700 space-x-6">
        <a href="#" className="hover:underline">Gmail</a>
        <a href="#" className="hover:underline">Images</a>
        <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer">
          <span className="material-icons">apps</span>
        </div>
        <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full cursor-pointer">
          J
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex flex-col items-center justify-center flex-grow w-full px-4">
        
        {/* Optimized Google Logo Scaling: text-6xl (mobile) -> text-8xl (desktop) */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-product-sans mb-8 select-none">
          <span className={GOOGLE_COLORS.G}>G</span>
          <span className={GOOGLE_COLORS.o1}>o</span>
          <span className={GOOGLE_COLORS.o2}>o</span>
          <span className={GOOGLE_COLORS.g}>g</span>
          <span className={GOOGLE_COLORS.l}>l</span>
          <span className={GOOGLE_COLORS.e}>e</span>
        </h1>

        {/* Optimized Search Bar Width: w-11/12 (mobile) -> max width on desktop */}
        <div className="
             w-11/12 md:w-3/4 lg:w-[600px] xl:w-[700px] max-w-full 
             flex items-center border border-gray-300 rounded-full py-3 px-6 
             shadow-md hover:shadow-lg transition duration-200 bg-white relative
        ">
          <SearchIcon className="text-gray-500 w-5 h-5 mr-3" />

          {/* Optimized Typing Text Size: text-base (mobile) -> text-lg (desktop) */}
          <div className="flex-grow text-base sm:text-lg font-mono bg-transparent">
            {typedText}
            {isTyping && <span className="cursor-blink">|</span>}
          </div>

          <MicIcon className="text-blue-500 w-5 h-5 ml-3 cursor-pointer hover:text-blue-700 transition" />
        </div>

        {/* Buttons + Hand pointer */}
        <div className="mt-8 flex items-center justify-center space-x-1 sm:space-x-4">
        <div className="relative flex items-center">
        {showHand && !isTyping && (
        // CORRECTED: Tightened spacing and removed unnecessary classes.
        // We are forcing it to be adjacent to the button's right edge (right-full)
        <div className="absolute right-full mr-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 flex items-center space-x-0.5 animate-bounce">
                <span>Click here</span>
                <span>👉</span>
        </div>
        )}

        <button
        onClick={handleStartSearch}
        disabled={isTyping}
        // Added max-w-1/2 to let the buttons shrink slightly on narrow screens
        className={`px-2 py-2 text-xs sm:text-sm rounded-md transition duration-200 border max-w-1/2
                ${isTyping
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
        Google Search
        </button>
        </div>
        
        <button 
        className="px-2 py-2 text-xs sm:text-sm rounded-md transition duration-200 border bg-gray-100 text-gray-700 hover:bg-gray-200 max-w-1/2"
        >
        I’m Feeling Lucky
        </button>
        </div>
      </main> {/* <-- Closing Tag for main */}

      {/* --- Optimized FOOTER --- */}
      <footer className="w-full bg-gray-100 text-gray-600 text-sm">
        <div className="px-6 py-3 border-b text-center">Nairobi,Kenya</div>
        
        {/* Stacks vertically on mobile (default flex-col), side-by-side on tablet/desktop (sm:flex-row) */}
        <div className="flex flex-col sm:flex-row justify-between px-6 py-3 space-y-2 sm:space-y-0"> 
          
          {/* Left Group */}
          <div className="flex flex-wrap justify-center sm:justify-start space-x-4 sm:space-x-6">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Advertising</a>
            <a href="#" className="hover:underline">Business</a>
            <a href="#" className="hover:underline">How Search works</a>
          </div>

          {/* Right Group */}
          <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Settings</a>
          </div>

        </div>
      </footer>

      {/* Cursor Blink Animation */}
      <style>{`
        .font-product-sans { font-family: Arial, Helvetica, sans-serif; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .cursor-blink { animation: blink 0.75s step-end infinite; }
        .material-icons { font-family: 'Material Icons'; font-size: 24px; }
      `}</style>
    </div>
  );
}