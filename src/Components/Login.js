import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { auth } from "../Config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Login = () => {
  const Navigate = useNavigate();
  //form value
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("ani-246793");
  const [validated, setValidated] = useState(false);
  const [color, setColor] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    EmailAuth();
    setValidated(true);
  };

  const EmailAuth = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user.uid;
        console.log(user);
        alert("Login Sucessfully");
        Navigate(`/hero/${user}`);
        setColor("green");
        window.location.reload();
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Login Failed");
        setColor("red");
      });
  };

  console.log(email);
  return (
    <div className="d-flex align-items-center mt-5 flex-column">
      <h2 className="text-light" style={{ textShadow: "2px 2px black" }}>
        Login Page
      </h2>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        style={{
          width: "500px",
          display: "flex",
          padding: " 12px 25px",
          flexDirection: "column",
          backgroundColor: "black",
          borderRadius: "12px",
          marginTop: "45px",
        }}
        id="login"
      >
        <Row>
          <Form.Group as={Col} md="12" controlId="validationCustomEmail">
            <Form.Label className="text-light">Email</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="email"
                aria-describedby="inputGroupPrepend"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ borderColor: color }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please choose a Email.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} md="12" controlId="validationCustom06">
            <Form.Label className="text-light">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderColor: color }}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Phone Number.
            </Form.Control.Feedback>
          </Form.Group>
          <Row className="mt-2">
            <Link to="/" className="text-decoration-none text-success">
              Click here to Register page
            </Link>
          </Row>
        </Row>
        <Form.Group as={Col} md="12" controlId="validationCustom07">
          <Button type="submit" className="m-3 mx-1">
            Login
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Login;
