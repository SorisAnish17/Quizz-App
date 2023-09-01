import { useContext, createContext, useState } from "react";
const ScoreSheet = createContext();

const Context = ({ children }) => {
  const [scorestate, setScoreState] = useState(0);
  const [previousScore, setPreviousScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [topScore, setTopScore] = useState(0);
  return (
    <div>
      <ScoreSheet.Provider
        value={{
          scorestate,
          setScoreState,
          previousScore,
          setPreviousScore,
          currentScore,
          setCurrentScore,
          topScore,
          setTopScore,
        }}
      >
        {children}
      </ScoreSheet.Provider>
    </div>
  );
};

export const ScoreState = () => {
  return useContext(ScoreSheet);
};
export default Context;
