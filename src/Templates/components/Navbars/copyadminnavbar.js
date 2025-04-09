// import React from "react";
// import { GiHamburgerMenu } from "react-icons/gi"
// import "./adminNavbar.css"
// // react-bootstrap components
// import {
//   Badge,
//   Button,
//   ButtonGroup,
//   Card,
//   Dropdown,
//   Form,
//   InputGroup,
//   Navbar,
//   Nav,
//   Pagination,
//   Container,
//   Row,
//   Col,
//   Collapse,
// } from "react-bootstrap";
// import { AzureAD, AuthenticationState } from 'react-aad-msal';
// import { authProvider } from '../../../AzureAd/authProvider';
// import "../Sidebar/side.css"
// import { MdFormatListBulletedAdd } from "react-icons/md";
// import {
//   Calendar,
//   MessageSquare,
//   Users,
//   FileText,
//   Mail,
//   LogIn,
//   UserPlus,
//   UserCheck,
//   ShieldOff,
//   User,
//   File,
//   PieChart,
//   Package,
//   Layers,
//   Box,
//   Archive,
//   AlertCircle,
//   ShoppingBag,
//   Globe,
//   LifeBuoy,
//   ShoppingCart,
// } from "react-feather";


// function AdminNavbar(props) {
// // console.log("props",props.userName)
//   const [collapseOpen, setCollapseOpen] = React.useState(false);


//   let intials = (props.userName || '').split(' ');
//   let inti = intials?.[0]?.[0] +' '+ intials?.[1]?.[0]
//   console.log("adminnav", inti)

//   return (
//     <>
//       <Navbar expand="lg">
//         <Container fluid>
//           <div className="navbar-wrapper">
//             <div className="navbar-minimize">
//               <Button
//                 className="btn-fill btn-round btn-icon d-block d-lg-none  border-dark"

//                 variant="light"
//                 onClick={() =>
//                   document.documentElement.classList.toggle("nav-open")
//                 }
//               >

//                 <i className="navicon"><GiHamburgerMenu /></i>
//               </Button>
//             </div>
//             <Navbar.Brand href="#pablo" onClick={(e) => e.preventDefault()}>
//               Menu
//             </Navbar.Brand>
//           </div>
//           <button
//             className="navbar-toggler navbar-toggler-right border-0"
//             type="button"
//             onClick={() => setCollapseOpen(!collapseOpen)}
//           >
//             <span className="navbar-toggler-bar burger-lines"></span>
//             <span className="navbar-toggler-bar burger-lines"></span>
//             <span className="navbar-toggler-bar burger-lines"></span>
//           </button>
//           <Navbar.Collapse className="justify-content-end" in={collapseOpen}>
//             <Nav className="nav mr-auto" navbar>

//             </Nav>
//             <Nav navbar>

//               {/* <img  className='ProfilePic' src={require("../../../assets/img/logo.png")}></img> */}
//               <Dropdown as={Nav.Item}>
//                 <Dropdown.Toggle
//                   as={Nav.Link}
//                   id="dropdown-41471887333"
//                   variant="default"
//                 >
//                   <i className="nc-icon nc-bullet-list-67"></i>
//                   {/* <MdFormatListBulletedAdd size={20} className="z-[50]"/> */}
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu
//                   alignRight
//                   aria-labelledby="navbarDropdownMenuLink"
//                 >
//                   <AzureAD provider={authProvider}>
//                     {
//                       ({ login, logout, authenticationState, error, accountInfo }) => {
//                         switch (authenticationState) {
//                           case AuthenticationState.Authenticated:

//                             return (
//                               <p>
//                                 <Dropdown.Item
//                                 //  className="text-info"
//                                  className=""

//                                  >
//                                   <i>{intials[0]}</i>
//                                 </Dropdown.Item>
//                                 <Dropdown.Item
//                                   className="text-danger"
//                                   href="#"
//                                   onClick={() => { logout(); localStorage.setItem("IsLogin", false); }}
//                                 >
//                                   <i className="nc-icon nc-button-power"></i>
//                                   Log out
//                                 </Dropdown.Item>
//                               </p>
//                             );
//                           case AuthenticationState.InProgress:
//                             return (<p>Authenticating...</p>);
//                         }
//                       }
//                     }
//                   </AzureAD>
//                 </Dropdown.Menu>
//               </Dropdown>
//               <div id="profileImage" className='ProfilePic'><span className="profilespan">{inti}</span></div>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>
//     </>
//   );
// }

// export default AdminNavbar;