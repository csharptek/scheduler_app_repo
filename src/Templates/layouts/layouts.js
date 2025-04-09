import { React, useState, useEffect } from "react";
import { Route, HashRouter, Routes, Switch } from "react-router-dom";
import { AzureAD } from 'react-aad-msal';
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  Form,
  InputGroup,
  Navbar,
  Nav,
  Pagination,
  Container,
  Row,
  Col,
} from "react-bootstrap";
 
import { authProvider } from "../../AzureAd/authProvider";
// import Side from "../components/Sidebar/Side";
import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import AdminFooter from "../components/Footers/AdminFooter.js";
import "../layouts/layouts.css"
import ScheduleInterviw from "../../Interview/ScheduleInterviw.js"
import ScheduleInterviewList from "../../Interview/ScheduleInterviewList.js"
import AssignInterviewList from "../../Interview/AssignInterviewList.js"
import Interview from "../../Interview/Interview.js";
import ListofInterview from "../../Interview/InterviewList.js";
// import AssignInterviewList from "../../Interview/AssignInterviewList.js"
import Createuser from "../../Interview/Createuser.js";
import Interviewerpage from "../../Interview/Interviewerspage.js";
// import GetAllEmploy from "../../Interview/GetAllEmploy.js";
// import Createuser from "../../Interview/Createuser.js";
 
function Layout(props) {
  const [userDetails, setUserDetail] = useState({})
  useEffect(() => {
    let intials = (props.account.accountInfo.account.idToken.name || '').split(' ');
    // console.log("dghd", props.account.accountInfo);
    const data = {
      "Id": props.account.accountInfo.account.idToken.oid,
      "FirstName": intials[0],
      "LastName": intials[1],
      "FullName": intials[0] + " " + intials[1],
      "Email": props.account.accountInfo.account.idToken.preferred_username,
      "Phone": "",
      "CreatedBy": props.account.accountInfo.account.idToken.oid,
    }
    // console.log("dghd", data)
    setUserDetail(data);
  }, [])
  return (
    <AzureAD provider={authProvider}>
      {
        ({ login, logout, authenticationState, error, accountInfo }) => {
          // console.log("account info", accountInfo, authenticationState, accountInfo.account.idTokenClaims.name)
          switch (accountInfo != undefined ? (accountInfo?.account?.idToken?.roles != undefined ? accountInfo?.account?.idToken?.roles[0] : "") : '') {
            case 'Admin':
              return (
                <>
                  <div className="!h-[80vh]">
                    {/* <div className="wrapper"> */}
                    <div>
                      {/* <Side role={accountInfo.account.idToken.roles[0]} /> */}
                      {/* <div className="main-panel"> */}
                      <div>
                        <AdminNavbar userName={accountInfo.account.idTokenClaims.name} />
                        <div className="content !h-[80vh]">
                          {/* <ScheduleInterviw /> */}
                          <HashRouter>
                            <Switch>
                            <Route path="/addUser" exact component={() => <Createuser account={accountInfo?.account?.idToken} />} />
                            <Route path="/" exact component={() => <Createuser account={accountInfo?.account?.idToken} />} />
                            <Route path="/allusers" exact component={() => <Interviewerpage account={accountInfo?.account?.idToken} />} />
                              <Route path="/Interview" exact component={() => <Interview account={accountInfo?.account?.idToken} />} />
                              <Route path="/listofintewview" exact component={() => <ListofInterview account={accountInfo?.account?.idToken} />} />
 
                              <Route path="/dashboard/:pk" exact component={() => <ScheduleInterviw account={accountInfo?.account?.idToken} />} />
                              {/* <Route path="/dashboard/" exact component={() => <ScheduleInterviw account={accountInfo?.account?.idToken} />} />
                              <Route path="/InterviewList" exact component={() => <ScheduleInterviewList account={accountInfo?.account?.idToken} />} /> */}
                            </Switch>
                          </HashRouter>
                        </div>
                        <AdminFooter />
                        <div
                          className="close-layer"
                          onClick={() =>
                            document.documentElement.classList.toggle("nav-open")
                          }
                        />
                      </div>
                    </div >
                  </div>
 
                </>
              );
            case 'SuperAdmin':
              return (
                <>
                  <div>
                    <div className="wrapper">
                      {/* <Side role={accountInfo.account.idToken.roles[0]} /> */}
                      {/* <div className="main-panel"> */}
                      <div>
                        <AdminNavbar userName={accountInfo.account.idTokenClaims.name} />
                        <div className="content">
                          {/* <ScheduleInterviw /> */}
                          <HashRouter>
                            <Switch>
                              <Route path="/dashboard/:pk" exact component={() => <ScheduleInterviw account={accountInfo?.account?.idToken} />} />
                              <Route path="/dashboard/" exact component={() => <ScheduleInterviw account={accountInfo?.account?.idToken} />} />
                              <Route path="/InterviewList" exact component={() => <ScheduleInterviewList account={accountInfo?.account?.idToken} />} />
                            </Switch>
                          </HashRouter>
                        </div>
                        <AdminFooter />
                        <div
                          className="close-layer"
                          onClick={() =>
                            document.documentElement.classList.toggle("nav-open")
                          }
                        />
                      </div>
                    </div >
                  </div>
 
                </>
              );

              case 'ExternalRecruiter':
              return (
                <>
                   <div>
                   <div className="wrapper">
                   <div>
                      <AdminNavbar userName={accountInfo.account.idTokenClaims.name} />
                      <div >
                      <div className="content">
                        <HashRouter>
                          <Switch>
{/*                             
                            <Route path="/dashboard/:pk" exact component={() => <ScheduleInterviw account={accountInfo?.account?.idToken} />} />
                            <Route path="/" exact component={() => <ScheduleInterviw account={accountInfo?.account?.idToken} />} /> */}
                            <Route path="/scheduleInterview" exact component={() => <Interview account={accountInfo?.account?.idToken} />} />
                            <Route path="/listofcandidate" exact component={() => <ListofInterview account={accountInfo?.account?.idToken} />} />
                          </Switch>
                        </HashRouter>
                        </div>
                      </div>
                      <AdminFooter />
                      <div
                        className="close-layer"
                        onClick={() =>
                          document.documentElement.classList.toggle("nav-open")
                        }
                      />
                      </div>
                    </div>
                  </div>
                </>
              );
            default:
              return (
                <>
                  <div>
                    <div className="wrapper">
                      {/* <Side role={"user"} /> */}
                      {/* <div className="main-panel"> */}
                      <div>
                        <AdminNavbar userName={accountInfo?.account?.idTokenClaims?.name} />
                        <div className="content">
 
                          {/* <GetAllEmploy /> */}
                          <HashRouter>
                            <Switch>
                            {/* <Route path="/Interview" exact component={() => <Interview account={accountInfo?.account?.idToken} />} />
                              <Route path="/" exact component={() => <ListofInterview account={accountInfo?.account?.idToken} />} />
  */}
                              {/* <Route path="/" exact component={() => <Interviewerpage account={accountInfo?.account?.idToken} />} /> */}
                            </Switch>
                          </HashRouter>
                        </div>
                        <AdminFooter />
                        <div
                          className="close-layer"
                          onClick={() =>
                            document.documentElement.classList.toggle("nav-open")
                          }
                        />
                      </div>
                    </div >
                  </div>
 
                </>
              )
          }
        }
      }
    </AzureAD>
  )
}
export default Layout;