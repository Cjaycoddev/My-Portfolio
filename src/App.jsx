import { useState } from "react";
import LandingPage from "./Components/LandingPage";
import IntroPage from "./Components/IntroPage";
import PortfolioPage from "./Components/PortfolioPage";

function App() {
  const [stage, setStage] = useState("landing"); 
  // "landing" → "intro" → "portfolio"

  return (
    <>
      {stage === "landing" && (
        <LandingPage onFinish={() => setStage("intro")} />
      )}

      {stage === "intro" && (
        <IntroPage onFinish={() => setStage("portfolio")} />
      )}

      {stage === "portfolio" && <PortfolioPage />}
    </>
  );
}

export default App;
