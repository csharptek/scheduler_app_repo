import { React, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/light-bootstrap-dashboard-pro-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "./App.css";


import Layout from "./Templates/layouts/layouts";

import { AzureAD } from 'react-aad-msal';
import { authProvider } from "./AzureAd/authProvider";

function App() {
  const [isLogin, setIsLogin] = useState(false)

  const loginFunc = () => {
    localStorage.setItem("IsLogin", true);
    setIsLogin(true);
  }
  return (
    <>
      {
        ((localStorage.getItem("IsLogin") == "true")||isLogin) ?
          <AzureAD provider={authProvider} forceLogin={true}>
            {
              (accountInfo) => <Layout account={accountInfo} />
            }
          </AzureAD> :
          <div className="loginPage">
            <div className="loginPageImage">
              <img src={require("./assets/img/logo.png")} alt="csharptek"></img>
            </div>
            <div className="loginPageButton">
              <h2>CsharpTek</h2>
              <h5>Interview</h5>
              <h5>scheduler</h5>
              <button type="button" onClick={loginFunc}>Login</button>
            </div>
          </div>
      }
    </>
  );
}

export default App;
