import imageOne from "../Images/quiz.png";
import { Link, useParams } from "react-router-dom";
import "../style.scss";
import ProgressBar from "react-bootstrap/ProgressBar";
import { ScoreState } from "../Context/Context";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import cubic from "../Images/cubic.webp";
import { Form, Row, InputGroup, Col } from "react-bootstrap";
import { database } from "../Config/firebase";
import { ref, onValue, update, push } from "firebase/database";
import { auth } from "../Config/firebase";
import { deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import FileBase64 from "react-file-base64";
import Footer from "./Footer";
const Hero = () => {
  const [getUserData, setGetUserData] = useState({});
  const [show, setShow] = useState(false);
  const { scorestate, setScoreState } = ScoreState();
  const { previousScore, setPreviousScore } = ScoreState();
  const { currentScore, setCurrentScore } = ScoreState();
  const { topScore, setTopScore } = ScoreState();
  const [editBtn, setEditBtn] = useState(true);
  const [lockInputs, setLockInputs] = useState(true);
  const [bgColor, setBgColor] = useState("yellow");
  const handleClose = () => {
    setEditBtn(true);
    setShow(false);
    setLockInputs(true);
  };
  const handleShow = () => setShow(true);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const profile = async () => {
      try {
        const starCountRef = ref(database, "users/" + userId);
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setGetUserData(data);
            let scoreHistory = data.score?.map((user) => user.value);
            // console.log(scoreHistory);
            setCurrentScore((currScore) => {
              if (!scoreHistory) {
                return currScore;
              } else {
                return Number(scoreHistory?.slice(-1).join());
              }
            });
            setPreviousScore((prevScore) => {
              if (!scoreHistory) {
                return prevScore;
              } else {
                return Number(scoreHistory?.slice(-2, scoreHistory.length - 1));
              }
            });
            setTopScore((tpScore) => {
              if (!scoreHistory) {
                return tpScore;
              } else {
                const numericScores = scoreHistory.filter(
                  (score) => typeof score === "number"
                );
                return Math.max(...numericScores);
              }
            });
          } else {
            navigate("/");
          }
        });
      } catch (error) {
        console.log("error");
      }
    };
    profile();
    const colorInterval = setInterval(() => {
      setRandomColor();
    }, 1225);

    const sentenceInterval = setInterval(() => {
      setWords();
    }, 2000);

    return () => {
      clearInterval(sentenceInterval);
      clearInterval(colorInterval);
    };
  }, []);
  // console.log(previousScore);
  // console.log(currentScore);
  // console.log(topScore);
  const handleSave = async () => {
    let updatedData = {
      firstName: firstName !== "" ? firstName : getUserData.firstName,
      secondName: secondName !== "" ? secondName : getUserData.secondName,
      phoneNumber: phoneNumber !== "" ? phoneNumber : getUserData.phoneNumber,
      fileUpload: fileUpload !== "" ? fileUpload : getUserData.fileUpload,
    };
    if (window.confirm("Are you sure to update Your Data?")) {
      await update(ref(database, "users/" + userId), updatedData);
    }
    setEditBtn(!editBtn);
    setLockInputs(!lockInputs);
  };

  const handleDelete = async () => {
    try {
      if (window.confirm("Are you sure want to delete your account")) {
        let deletedData = {
          firstName: null,
          secondName: null,
          email: null,
          phoneNumber: null,
          password: null,
          fileUpload: null,
          score: [],
        };
        await update(ref(database, "users/" + userId), deletedData);
        await EmailDelete();
        window.location.reload();
      }
    } catch (error) {
      console.log("error");
    }
  };

  const EmailDelete = async () => {
    const user = auth.currentUser;

    await deleteUser(user)
      .then(() => {
        // User deleted.
      })
      .catch((error) => {
        // An error ocurred
        // ...
      });
  };
  const handleFile = ({ base64 }) => {
    setFileUpload(base64);
  };
  // console.log(getUserData);
  // Input Field States
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  let [fileUpload, setFileUpload] = useState("");

  const handleEdit = () => {
    setEditBtn(!editBtn);
    setLockInputs(!lockInputs);
  };

  const colors = [
    "#9997EF",
    "#EF97EF",
    "#EF9797",
    "#97D5EF",
    "#97EFC2",
    "#DFEF97",
    "#EFBB97",
  ];
  const setRandomColor = () => {
    let setColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(setColor);
  };

  const [sentence, setSentence] = useState("");
  const [sentenceColor, setSentenceColor] = useState("");
  const words = [
    " Discovering Your Inner Power",
    "Power of your mind",
    "Spend Time For Fun",
    "Unleash Your Mind's Power",
    "The Infinite Power of Your Mind",
  ];
  const fontColors = ["white", "black", "#F3853B", "#F33B3B"];
  const setWords = () => {
    let quotes = words[Math.floor(Math.random() * words.length)];
    let fontColor = fontColors[Math.floor(Math.random() * fontColors.length)];
    console.log(fontColor);
    setSentenceColor(fontColor);
    setSentence(quotes);
  };
  const now = 60;
  return (
    <div
      style={{
        float: "left",
        width: "100vw",
        height: "10vh",
        backgroundColor: bgColor,
      }}
      id="profile"
    >
      <div className="d-flex justify-content-end me-3">
        <Link
          to="/Login"
          className="mt-2 me-3 text-decoration-none text-light"
          style={{ textShadow: "2px 2px 2px" }}
        >
          LogOut
        </Link>
        <div onClick={handleShow} id="profile" className="me-5">
          <img
            src={getUserData.fileUpload}
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        </div>
      </div>
      <div className="hero" style={{ backgroundColor: bgColor }}>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              Profile{" "}
              <img
                src={getUserData.fileUpload}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                }}
              />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: "purple", color: "white" }}>
            <Form className="p-5">
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    defaultValue={getUserData.firstName}
                    placeholder="First name"
                    onChange={(e) => setFirstName(e.target.value)}
                    readOnly={lockInputs}
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom02">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    defaultValue={getUserData.secondName}
                    placeholder="Last name"
                    readOnly={lockInputs}
                    onChange={(e) => setSecondName(e.target.value)}
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="12" controlId="validationCustomEmail">
                  <Form.Label>Email</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="email"
                      defaultValue={getUserData.email}
                      aria-describedby="inputGroupPrepend"
                      readOnly={true}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please choose a username.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="6" controlId="validationCustom05">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="Number"
                    placeholder="Phone Number"
                    defaultValue={getUserData.phoneNumber}
                    readOnly={lockInputs}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid Phone Number.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom06">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    defaultValue={getUserData.password}
                    readOnly={true}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid Phone Number.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="12" controlId="validationCustom06">
                  <Form.Label className="pt-3">
                    Upload to Change Your Profile Picture
                  </Form.Label>
                  <FileBase64
                    type="file"
                    placeholder="Enter Your Profile Picture here."
                    defaultValue={getUserData.fileUpload}
                    onDone={handleFile}
                    readOnly={lockInputs}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    please Upload Your File
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            {editBtn ? (
              <Button variant="warning" onClick={handleEdit}>
                Edit
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            )}
            <Button variant="danger" onClick={handleDelete}>
              Delete Account
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="main-content">
          <div>
            <h1 className="text-white">
              Quiz<span style={{ color: sentenceColor }}>Master</span>{" "}
              <img src={imageOne} style={{ width: "50px" }} />
            </h1>
            <img src={cubic} style={{ width: "400px" }} />
          </div>
          <div>
            <h1 style={{ fontStyle: "italic", color: sentenceColor }}>
              {sentence}
            </h1>
          </div>
        </div>
      </div>
      <div className="sub-content d-flex justify-content-center gap-5 dataFlow">
        <div className="question-content align-self-start mt-5">
          <h4 className="py-3">
            Are you ready to start the quiz exam? We have 10 science questions,
            each worth 1 mark. You have 8 minutes to complete all the questions.
            All the best!
          </h4>
          <button className="btn btn-dark mt-2">
            <Link
              className="text-decoration-none text-light"
              to={`/home/${userId}`}
            >
              Click Me
            </Link>
          </button>
        </div>
        <div className="progress-bar align-self-center">
          {" "}
          <div className="top-score" style={{ width: "300px" }}>
            <h5>
              Your Top Score:
              <span>
                {" "}
                {topScore} {""}points
              </span>
            </h5>
            <h5>
              Your Previous Score:
              <span>
                {" "}
                {previousScore} {""}points
              </span>
            </h5>
            <h5>
              Your Current Score:
              <span>
                {" "}
                {currentScore} {""}points
              </span>
            </h5>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Hero;
