import imageOne from "../Images/quiz.png";
import { Link, useParams } from "react-router-dom";
import ProgressBar from "react-bootstrap/ProgressBar";
import { ScoreState } from "../Context/Context";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
// import imageOne from "../Assets/error-404.png";
import { Form, Row, InputGroup, Col } from "react-bootstrap";
import { database } from "../Config/firebase";
import { ref, onValue, update } from "firebase/database";
import { auth } from "../Config/firebase";
import { deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import FileBase64 from "react-file-base64";

const Hero = () => {
  const [getUserData, setGetUserData] = useState({});
  const [show, setShow] = useState(false);
  const { scorestate, setScoreState } = ScoreState();
  const scoreOutOf10 = scorestate * 10;
  const handleClose = () => setShow(false);
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
          } else {
            navigate("/");
          }
        });
      } catch (error) {
        console.log("error");
      }
    };
    profile();
  }, []);

  const handleSave = async () => {
    let updatedData = {
      firstName: firstName !== "" ? firstName : getUserData.firstName,
      secondName: secondName !== "" ? secondName : getUserData.secondName,
      phoneNumber: phoneNumber !== "" ? phoneNumber : getUserData.phoneNumber,
      fileUpload: fileUpload !== "" ? fileUpload : getUserData.fileUpload,
    };
    if (window.confirm("Are you sure to update Your Data?")) {
      await update(ref(database, "users/" + userId), updatedData);
      alert("Successfully updated");
    }
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
  // Input Field States
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  let [fileUpload, setFileUpload] = useState("");

  return (
    <div style={{ float: "left", width: "100vw", height: "10vh" }} id="profile">
      <div className="d-flex justify-content-end">
        <Link
          to="/Login"
          className="mt-2 me-3 text-decoration-none text-light"
          style={{ textShadow: "2px 2px 2px" }}
        >
          LogOut
        </Link>
        <div onClick={handleShow} id="profile" className="me-5 ">
          <img
            src={getUserData.fileUpload}
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        </div>
      </div>
      <div className="hero">
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
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Account
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="main-content">
          <h1 className="text-white">
            Quiz<span className="text-warning">Master</span>{" "}
            <img src={imageOne} style={{ width: "75px" }} />
          </h1>
          <div className="box-content mt-3">
            <h4 className="text-white py-3">
              Are you ready to start the quiz exam? We have 10 science
              questions, each worth 1 mark. You have 8 minutes to complete all
              the questions. All the best!
            </h4>
            <button className="btn btn-light mt-4">
              <Link className="text-decoration-none" to={`/home/${userId}`}>
                Click Me
              </Link>
            </button>
          </div>
          <div className="mt-5">
            <div className="mt-5">
              <h4 className="text-light">Your Result</h4>
              {scoreOutOf10 <= 40 ? (
                <ProgressBar
                  now={scoreOutOf10}
                  variant="danger"
                  label={`Score:${scorestate}`}
                />
              ) : scoreOutOf10 <= 70 ? (
                <ProgressBar
                  now={scoreOutOf10}
                  variant="warning"
                  label={`Score:${scorestate}`}
                />
              ) : (
                <ProgressBar
                  now={scoreOutOf10}
                  variant="success"
                  label={`Score:${scorestate}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
