import { useContext, createContext, useState } from "react";
const ScoreSheet = createContext();

const Context = ({ children }) => {
  const [scorestate, setScoreState] = useState(0);
  return (
    <div>
      <ScoreSheet.Provider value={{ scorestate, setScoreState }}>
        {children}
      </ScoreSheet.Provider>
    </div>
  );
};

export const ScoreState = () => {
  return useContext(ScoreSheet);
};
export default Context;
