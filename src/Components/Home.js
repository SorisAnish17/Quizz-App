import Data from "./Data";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Row } from "react-bootstrap";
import { ScoreState } from "../Context/Context";
import { Link, useParams } from "react-router-dom";
import { database } from "../Config/firebase";
import { ref, onValue, update, get } from "firebase/database";
const Home = () => {
  const { userId } = useParams();
  const [getUser, setGetUser] = useState("");
  const { scorestate, setScoreState } = ScoreState();
  // const [scoreCard, setScoreCard] = useState({});
  const [questions, setQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(480); // 14 minutes in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0) {
      setShowResult(true);
    }
  }, [timeRemaining]);

  const formatTime = (seconds) => {
    if (seconds > 0) {
      const minutes = Math.floor(seconds / 60);
      const RemainingSeconds = seconds % 60;
      return `Remaining Time:${minutes} Minutes: ${RemainingSeconds} Seconds`;
    } else {
      return;
    }
  };
  let currentQuestion = Data[questions];
  const handleClick = (index) => {
    setSelectedOption(index);
    if (currentQuestion.answer === index) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    let nextQn = questions + 1;
    if (nextQn < Data.length) {
      setQuestion(questions + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
      setTimeRemaining(null);
    }
    setScoreState(score);
  };
  // console.log(selectedOption);
  console.log(scorestate);
  const handlePrev = () => {
    if (questions <= 0) {
      setQuestion(0);
    } else {
      let prevQn = questions - 1;
      setQuestion(prevQn);
    }
  };
  const handleSaveScore = async () => {
    try {
      const userRef = ref(database, `users/${userId}`);

      const snapshot = await get(userRef);
      const userData = snapshot.val();

      // Create a new score object
      const newScore = {
        value: score,
        // Add any additional score-related information if needed
      };

      // Check if the user already has scores, if not, initialize an empty array
      const userScores = userData.score || [];

      // Add the new score to the array
      userScores.push(newScore);

      // Update the user's data in the database
      const updatedUserData = { ...userData, score: userScores };

      await update(ref(database, `users/${userId}`), updatedUserData);

      console.log("Score saved successfully");
      console.log(updatedUserData.score);
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  return (
    <div className="main">
      <h3 className="m-5 text-white">{formatTime(timeRemaining)}</h3>
      {showResult ? (
        <h2 className="text-white">
          <Row md={12} id="frame">
            <div
              className="d-flex flex-column align-items-center justify-content-center text-center"
              style={{
                width: "600px",
                height: "400px",
                border: "1px solid black",
                backgroundColor: "black",
                borderRadius: "25px",
              }}
            >
              <h4>
                {" "}
                Thank you for attempting the quiz question. Your score is
                updated in your profile Page.
              </h4>
              <button className="btn btn-light mt-5" onClick={handleSaveScore}>
                <Link to={`/hero/${userId}`} className="text-decoration-none">
                  Back to Home
                </Link>
              </button>
            </div>
          </Row>
        </h2>
      ) : (
        <>
          <div className="box">
            <h3 className="p-3 text-white">Question No: {questions + 1}</h3>
            <h5 className="mb-2" id="questionText">
              {currentQuestion.question}
            </h5>
            <div>
              <ul style={{ listStyle: "none" }} id="list">
                {currentQuestion.options.map((option, i) => (
                  <li
                    key={i}
                    onClick={() => handleClick(i)}
                    className={selectedOption === i ? "selected" : ""}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div
            style={{
              backgroundColor: "black",
              width: "950px",
              borderEndEndRadius: "12px",
              borderEndStartRadius: "12px",
              display: "flex",
              justifyContent: "space-between",
            }}
            id="box-end"
          >
            <Button
              variant="light"
              style={{ color: "red" }}
              className={`align-self-end m-2 ${
                selectedOption !== null ? "btn-display" : "btn-none"
              }`}
              onClick={handlePrev}
            >
              Previous Question
            </Button>
            <Button
              variant="light"
              style={{ color: "green" }}
              className={`m-2 ${
                selectedOption !== null ? "btn-display" : "btn-none"
              }`}
              onClick={handleNext}
            >
              Next Question
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
export default Home;
