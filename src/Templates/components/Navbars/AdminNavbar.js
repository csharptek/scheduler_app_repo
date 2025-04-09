// import React, { useState,} from "react";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { FaUserFriends } from "react-icons/fa"; // Use FaUserFriends for Interview
// import { Link ,useLocation} from "react-router-dom";
// import { Navbar, Nav, Button, Dropdown } from "react-bootstrap";
// import { authProvider } from '../../../AzureAd/authProvider';
// import { AzureAD, AuthenticationState } from 'react-aad-msal';
// import "./adminNavbar.css"; // Custom CSS for improved fonts
// // import { useLocation } from "react-router-dom";

// // Navbar Items Data
// const navItems = [
//   { name: "Schedule Interview", link: "/dashboard" },
//   { name: "Scheduled Interview List", link: "/InterviewList" },
//   { name: "Add User", link: "/addUser" },
//   { name: "Interview Schedule", link: "/Interview" },
//   { name: "Interview Lists", link: "/listofintewview" },
// ];

// function AdminNavbar(props) {
//   const [collapseOpen, setCollapseOpen] = useState(false);
//   const initials = (props.userName || '').split(' ');
//   const inti = initials?.[0]?.[0] + ' ' + initials?.[1]?.[0];
//   const location = useLocation(); // Get the current location


//   return (
//     <Navbar expand="lg" style={{ width: "100%", paddingLeft: '2%', paddingRight: '2%' }}>
//       <Navbar.Brand href="#pablo" onClick={(e) => e.preventDefault()} className="navbar-brand">
//         <img
//           src={require("../../../assets/img/logo.png")}
//           alt="Logo"
//           className="navbar-logo"
//           style={{ height: '40px', marginRight: '10px' }}
//         />
//       </Navbar.Brand>

//       <button
//         className="navbar-toggler navbar-toggler-right border-0"
//         type="button"
//         onClick={() => setCollapseOpen(!collapseOpen)}
//       >
//         <span className="navbar-toggler-bar burger-lines"></span>
//         <span className="navbar-toggler-bar burger-lines"></span>
//         <span className="navbar-toggler-bar burger-lines"></span>
//       </button>

//       <Navbar.Collapse className="justify-content-between" in={collapseOpen}>
//         {/* Centered Navbar Items */}
//         <Nav className="nav mx-auto" navbar>
//           {navItems.map((item, index) => (
//             <Nav.Item key={index}>
//               <Nav.Link as={Link} to={item.link} 
//               // className="navbar-item" 
//               className={`navbar-item ${location.pathname === item.link ? 'active-nav-item' : ''}`}
//               style={{fontFamily: "IBM Plex Sans, sans-serif",fontSize: "1rem",fontWeight: 500 }}>
//                 {item.name}
//               </Nav.Link>
//             </Nav.Item>
//           ))}
//         </Nav>
        

//         {/* <AzureAD provider={authProvider}>
//           {({ authenticationState }) => {
//             if (authenticationState === AuthenticationState.Authenticated) {
//               return (
//                 <Nav className="nav mr-auto" navbar>
//                   {navItems.map((item, index) => (
//                     <Nav.Item key={index}>
//                       <Nav.Link as={Link} to={item.link} className="navbar-item">
//                         {item.name}
//                       </Nav.Link>
//                     </Nav.Item>
//                   ))}
//                 </Nav>
//               );
//             }
//             return null; // Hide the nav items if not authenticated
//           }}
//         </AzureAD> */}

//         {/* Profile and Logout - Right Aligned */}
//         <Nav navbar>
//           <Dropdown as={Nav.Item}>
//             <Dropdown.Toggle
//               as={Nav.Link}
//               id="dropdown-41471887333"
//               variant="default"
//             >
//               <i className="nc-icon nc-bullet-list-67"></i>
//             </Dropdown.Toggle>
//             <Dropdown.Menu alignRight aria-labelledby="navbarDropdownMenuLink">
//               <AzureAD provider={authProvider}>
//                 {({ login, logout, authenticationState, error, accountInfo }) => {
//                   switch (authenticationState) {
//                     case AuthenticationState.Authenticated:
//                       return (
//                         <p>
//                           <Dropdown.Item>
//                             <i>{initials[0]}</i>
//                           </Dropdown.Item>
//                           <Dropdown.Item
//                             className="text-danger"
//                             href="#"
//                             onClick={() => { logout(); localStorage.setItem("IsLogin", false); }}
//                           >
//                             <i className="nc-icon nc-button-power"></i>
//                             Log out
//                           </Dropdown.Item>
//                         </p>
//                       );
//                     case AuthenticationState.InProgress:
//                       return (<p>Authenticating...</p>);
//                     default:
//                       return null;
//                   }
//                 }}
//               </AzureAD>
//             </Dropdown.Menu>
//           </Dropdown>
//           <div id="profileImage" className="ProfilePic">
//             <span className="profilespan">{inti}</span>
//           </div>
//         </Nav>
//       </Navbar.Collapse>
//     </Navbar>
//   );
// }

// export default AdminNavbar;

//-------------------------------------------------------------------------

// import React, { useState } from "react";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { Link, useLocation } from "react-router-dom";
// import { Navbar, Nav, Button, Dropdown } from "react-bootstrap";
// import { authProvider } from '../../../AzureAd/authProvider';
// import { AzureAD, AuthenticationState } from 'react-aad-msal';
// import "./adminNavbar.css";

// // Navbar Items Data (for Admin & SuperAdmin)
// const navItems = [
//   { name: "Schedule Interview", link: "/dashboard" },
//   { name: "Scheduled Interview List", link: "/InterviewList" },
//   { name: "Add User", link: "/addUser" },
//   { name: "Interview Schedule", link: "/Interview" },
//   { name: "Interview Lists", link: "/listofintewview" },
// ];

// function AdminNavbar(props) {
//   const [collapseOpen, setCollapseOpen] = useState(false);
//   const location = useLocation(); // Get the current location

//   return (
//     <AzureAD provider={authProvider}>
//       {({ authenticationState, accountInfo, logout }) => {
//         const userRole = accountInfo?.account?.idToken?.roles?.[0] || ""; // Get user role
        
//         // Only allow Admin and SuperAdmin to see the nav items
//         const allowedNavItems = ["Admin", "SuperAdmin"].includes(userRole) ? navItems : [];

//         return (
//           <Navbar expand="lg" style={{ width: "100%", paddingLeft: '2%', paddingRight: '2%' }}>
//             <Navbar.Brand href="#" className="navbar-brand">
//               <img
//                 src={require("../../../assets/img/logo.png")}
//                 alt="Logo"
//                 className="navbar-logo"
//                 style={{ height: '40px', marginRight: '10px' }}
//               />
//             </Navbar.Brand>

//             <button
//               className="navbar-toggler navbar-toggler-right border-0"
//               type="button"
//               onClick={() => setCollapseOpen(!collapseOpen)}
//             >
//               <span className="navbar-toggler-bar burger-lines"></span>
//               <span className="navbar-toggler-bar burger-lines"></span>
//               <span className="navbar-toggler-bar burger-lines"></span>
//             </button>

//             <Navbar.Collapse className="justify-content-between" in={collapseOpen}>
//               {/* Conditionally Render Navbar Items */}
//               <Nav className="nav mx-auto" navbar>
//                 {allowedNavItems.map((item, index) => (
//                   <Nav.Item key={index}>
//                     <Nav.Link 
//                       as={Link} 
//                       to={item.link} 
//                       className={`navbar-item ${location.pathname === item.link ? 'active-nav-item' : ''}`}
//                       style={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: "1rem", fontWeight: 500 }}
//                     >
//                       {item.name}
//                     </Nav.Link>
//                   </Nav.Item>
//                 ))}
//               </Nav>

//               {/* Profile & Logout Section */}
//               <Nav navbar>
//                 <Dropdown as={Nav.Item}>
//                   <Dropdown.Toggle as={Nav.Link} variant="default">
//                     <i className="nc-icon nc-bullet-list-67"></i>
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu >
//                     {authenticationState === AuthenticationState.Authenticated && (
//                       <>
//                         <Dropdown.Item>
//                           <i>{accountInfo?.account?.idTokenClaims?.name}</i>
//                         </Dropdown.Item>
//                         <Dropdown.Item
//                           className="text-danger"
//                           href="#"
//                           onClick={() => { logout(); localStorage.setItem("IsLogin", false); }}
//                         >
//                           <i className="nc-icon nc-button-power"></i>
//                           Log out
//                         </Dropdown.Item>
//                       </>
//                     )}
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </Nav>
//             </Navbar.Collapse>
//           </Navbar>
//         );
//       }}
//     </AzureAD>
//   );
// }

// export default AdminNavbar;


//----------------------------------------------

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { authProvider } from '../../../AzureAd/authProvider';
import { AzureAD, AuthenticationState } from 'react-aad-msal';
import "./adminNavbar.css";

// Navbar Items Data for different roles
const adminNavItems = [
  { name: "Interviewers List", link: "/allusers" },
  { name: "Add User", link: "/addUser" },
  { name: "Interview Schedule", link: "/Interview" },
  { name: "Interview Lists", link: "/listofintewview" },
];

const externalRecruiterNavItems = [
  { name: "Schedule Interview", link: "/scheduleInterview" },
  { name: "Interview List", link: "/listofcandidate" },
];

function AdminNavbar(props) {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const location = useLocation();
  const initials = (props.userName || '').split(' ');
  const inti = initials?.[0]?.[0] + ' ' + initials?.[1]?.[0];

  return (
    <AzureAD provider={authProvider}>
      {({ authenticationState, accountInfo, logout }) => {
        const userRole = accountInfo?.account?.idToken?.roles?.[0] || "";
        
        // Determine which nav items to show based on role
        let allowedNavItems = [];
        if (["Admin", "SuperAdmin"].includes(userRole)) {
          allowedNavItems = adminNavItems;
        } else if (userRole === "ExternalRecruiter") {
          allowedNavItems = externalRecruiterNavItems;
        }

        return (
          <Navbar expand="lg" style={{ width: "100%", paddingLeft: '2%', paddingRight: '2%' }}>
            <Navbar.Brand href="#" className="navbar-brand">
              <img
                src={require("../../../assets/img/logo.png")}
                alt="Logo"
                className="navbar-logo"
                style={{ height: '40px', marginRight: '10px' }}
              />
            </Navbar.Brand>

            <button
              className="navbar-toggler navbar-toggler-right border-0"
              type="button"
              onClick={() => setCollapseOpen(!collapseOpen)}
            >
              <span className="navbar-toggler-bar burger-lines"></span>
              <span className="navbar-toggler-bar burger-lines"></span>
              <span className="navbar-toggler-bar burger-lines"></span>
            </button>

            <Navbar.Collapse className="justify-content-between" in={collapseOpen}>
              <Nav className="nav mx-auto" navbar>
                {allowedNavItems.map((item, index) => (
                  <Nav.Item key={index}>
                    <Nav.Link 
                      as={Link} 
                      to={item.link} 
                      className={`navbar-item ${location.pathname === item.link ? 'active-nav-item' : ''}`}
                      style={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: "1rem", fontWeight: 500 }}
                    >
                      {item.name}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>

              <Nav navbar>
                <Dropdown as={Nav.Item} className="profile-dropdown">
                  <Dropdown.Toggle as={Nav.Link} className="dropdown-toggle-custom">
                    <div id="profileImage" className="ProfilePic">
                      <span className="profilespan">{inti}</span>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu-custom">
                    {authenticationState === AuthenticationState.Authenticated && (
                      <>
                        <Dropdown.Item>
                          <i>{accountInfo?.account?.idTokenClaims?.name}</i>
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="text-danger"
                          href="#"
                          onClick={() => { logout(); localStorage.setItem("IsLogin", false); }}
                        >
                          <i className="nc-icon nc-button-power"></i>
                          Log out
                        </Dropdown.Item>
                      </>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        );
      }}
    </AzureAD>
  );
}

export default AdminNavbar;
