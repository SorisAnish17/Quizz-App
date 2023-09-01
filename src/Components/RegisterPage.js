import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { auth, database } from "../Config/firebase"; // Assuming you have imported firebase properly
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import FileBase64 from "react-file-base64";
const RegisterPage = () => {
  const navigate = useNavigate();
  //form value
  const [firstName, setfirstName] = useState("");
  const [secondName, setsecondName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  let [fileUpload, setFileUpload] = useState("");
  const [validated, setValidated] = useState(false);
  const [color, setColor] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      await passwordAuth();
    }
    setValidated(true);
  };

  const validateGmail = (email) => {
    let pattern = /^[a-zA-Z0-9._%+-]+@gmail.com$/;

    if (pattern.test(email)) {
      return true;
    } else {
      return false;
    }
  };
  const handleFile = ({ base64 }) => {
    setFileUpload(base64);
  };
  console.log(fileUpload);
  const passwordAuth = async () => {
    try {
      if (password.length < 8) {
        alert("Make your Password Strength(Enter 8 Character)");
        return;
      }
      if (phoneNumber.length < 10) {
        alert("Enter valid Phone Number");
        setColor("red");
        return;
      }
      if (validateGmail(email)) {
        await createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user.uid;
            set(ref(database, "users/" + user), {
              firstName,
              secondName,
              email,
              phoneNumber,
              password,
              fileUpload,
            });
            setColor("green");
            alert("Successfully Registered");
            navigate("/login");
          })
          .catch((error) => console.log("error", error));
      } else {
        alert("Invalid Email");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div className="d-flex align-items-center mt-2 flex-column register">
        <h1 className="text-light" style={{ textShadow: "2px 2px black" }}>
          Registration Page
        </h1>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          style={{
            width: "750px",
            display: "flex",
            padding: "25px",
            flexDirection: "column",
            backgroundColor: "white",
            borderRadius: "12px",
            marginTop: "10px",
          }}
          id="form"
        >
          <Row>
            <div>
              <img
                src={fileUpload}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                }}
              />
              <h4>Profile Picture</h4>
            </div>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationCustom01">
              <Form.Label>First name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setfirstName(e.target.value)}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom02">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Last name"
                value={secondName}
                onChange={(e) => setsecondName(e.target.value)}
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
                  aria-describedby="inputGroupPrepend"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                id="phoneNumber"
                style={{ borderColor: color }}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Phone Number.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom06">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter an 8-character password."
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Password.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md="12" controlId="validationCustom06">
              <Form.Label className="pt-3">
                Upload Your Profile Picture
              </Form.Label>
              <FileBase64
                type="file"
                placeholder="Enter Your Profile Picture here."
                value={fileUpload}
                onDone={handleFile}
                required
              />
              <Form.Control.Feedback type="invalid">
                please Upload Your File
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mt-2">
            <p className="m-0 p-0">Already registered?</p>
            <Link to="/login" className="text-decoration-none text-success">
              Click here to login page
            </Link>
          </Row>
          <Form.Group as={Col} md="12" controlId="validationCustom07">
            <Button type="submit" className="mt-2">
              Submit form
            </Button>
          </Form.Group>
        </Form>
      </div>
    </>
  );
};

export default RegisterPage;
