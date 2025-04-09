import { React, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/light-bootstrap-dashboard-pro-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "./App.css";
import { Modal, Button, Form, FormControl, FormGroup } from "react-bootstrap";
import Layout from "./Templates/layouts/layouts";
import { AzureAD } from 'react-aad-msal';
import { authProvider } from "./AzureAd/authProvider";
import axios from 'axios';
import { Toast, ToastContainer } from "react-bootstrap";
import { projectApiList } from "./config/config";
import sendRegisterEmail from "./Interview/EmailTemplate/sendRegisterEmail";


function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    EmailId: "",
    PhoneNumber: "",
    OrganizationName: "",
    roles: "external recruiter",
    AgreedFees: ""
  });
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  const loginFunc = () => {
    localStorage.setItem("IsLogin", true);
    setIsLogin(true);
  };

  const handleShowRegister = () => setShowRegister(true);
  const handleCloseRegister = () => {
    setFormData({
      name: "",
      EmailId: "",
      PhoneNumber: "",
      OrganizationName: "",
      roles: "external recruiter",
      AgreedFees: ""
    })
    setShowRegister(false)
    setErrors(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "PhoneNumber" && !/^[0-9]*$/.test(value)) return;
    if (name === "AgreedFees" && !/^[0-9]*\.?[0-9]*$/.test(value)) return;
    setFormData({ ...formData, [name]: newValue });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "EmailId" && !/^\S+@\S+\.\S+$/.test(value)) {
      error = "Invalid EmailId format";
    } else if (name === "PhoneNumber" && !/^[6-9][0-9]{9}$/.test(value)) {
      error = "Phone number must be 10 digits and start with 6-9";
    } else if (name === "AgreedFees" && !/^[0-9]+(\.[0-9]*)?$/.test(value)) {
      error = "Only numbers and decimals allowed";
    }else if (name === "name" && value.trim() === "") {
      error = "Please enter your name";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(projectApiList.RegisterExternalUser, formData);
      console.log("Form Submitted Successfully:", response.data);
      //send Register email
      await sendRegisterEmail(formData);

      // Reset form and close modal
      setFormData({
        name: "",
        EmailId: "",
        PhoneNumber: "",
        OrganizationName: "",
        roles: "external recruiter",
        AgreedFees: ""
      });
      setErrors({});
      setShowRegister(false);
      setShowSuccessModal(true); // Show the success popup
      // setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.EmailId.trim() !== "" &&
    formData.PhoneNumber.trim() !== "" &&
    formData.roles === "external recruiter" &&
    formData.AgreedFees.trim() !== "" &&
    Object.values(errors).every((error) => error === "");


const handleCloseSuccessModal = () => {
  setShowSuccessModal(false); // Close success modal
  setFormData({
    name: "",
    EmailId: "",
    PhoneNumber: "",
    OrganizationName: "",
    roles: "external recruiter",
    AgreedFees: ""
  });
  setErrors({});
};

  return (
    <>
      {((localStorage.getItem("IsLogin") === "true") || isLogin) ? (
        <AzureAD provider={authProvider} forceLogin={true}>
          {(accountInfo) => <Layout account={accountInfo} />}
        </AzureAD>
      ) : (
        <div className="loginPage">
          <div className="loginPageImage">
            <img src={require("./assets/img/logo.png")} alt="csharptek" />
          </div>
          <div className="loginPageButton">
            <h2>CsharpTek</h2>
            <h5>Interview</h5>
            <h5>Scheduler</h5>
            <div className="buttonContainer">
              <button type="button" onClick={loginFunc}>Login</button>
              <button type="button" onClick={handleShowRegister}>Register</button>
            </div>
          </div>
        </div>
      )}

      <Modal show={showRegister} onHide={handleCloseRegister} centered backdrop="static" keyboard={false}>
        <Modal.Body className="custom-modal-body">
          <button className="close-btn" onClick={handleCloseRegister}>✖</button>
          <h3 className="modal-title">Registration Form</h3>
          <Form onSubmit={handleSubmit} className="form-container">
            <FormGroup>
              <FormControl name="name" placeholder="Full Name" type="text" value={formData.name} onChange={handleChange} onBlur={handleBlur} required className="custom-input" />
              {errors.Name && <small className="text-danger">{errors.name}</small>}
            </FormGroup>
            <FormGroup>
              <FormControl name="EmailId" placeholder="Email Address" type="EmailId" value={formData.EmailId} onChange={handleChange} onBlur={handleBlur} required className="custom-input" />
              {errors.EmailId && <small className="text-danger">{errors.EmailId}</small>}
            </FormGroup>
            <FormGroup>
              <FormControl name="PhoneNumber" placeholder="Phone Number" type="text" maxLength="10" value={formData.PhoneNumber} onChange={handleChange} onBlur={handleBlur} required className="custom-input" />
              {errors.PhoneNumber && <small className="text-danger">{errors.PhoneNumber}</small>}
            </FormGroup>
            <FormGroup>
              <FormControl name="OrganizationName" placeholder="organization Name" type="text" value={formData.OrganizationName} onChange={handleChange} onBlur={handleBlur} required className="custom-input" />
            </FormGroup>
            <FormGroup>
              <Form.Control as="select" name="roles" value={formData.roles} onChange={handleChange} required className="custom-input">
                <option value="external recruiter">External Recruiter</option>
              </Form.Control>
            </FormGroup>
            <FormGroup>
              <FormControl name="AgreedFees" placeholder="Agreed Fees" type="text" value={formData.AgreedFees} onChange={handleChange} onBlur={handleBlur} required className="custom-input" />
              {errors.AgreedFees && <small className="text-danger">{errors.AgreedFees}</small>}
            </FormGroup>
            <Button type="submit" disabled={!isFormValid} className="custom-button">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Success Popup Notification */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        onClose={() => setShowSuccessModal(false) }
        centered
        backdrop="static"
      >
        <Modal.Header style={{ marginTop: '20px' }} closeButton>
        </Modal.Header>
        <Modal.Body className="text-center" style={{ height: '150px' }}>
          <h5 className="text-success" style={{ margin: '20px' ,fontFamily: "IBM Plex Sans, sans-serif !important" }}>✅ Registration Successful!</h5>
          <p style={{ margin: '20px',fontFamily: "IBM Plex Sans, sans-serif !important" ,fontWeight:'400'  }}>Your username and password will be sent to your email.</p>
          <p style={{ margin: '20px',fontFamily: "IBM Plex Sans, sans-serif !important", fontWeight:'400'  }}>Thank you!</p>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default App;
