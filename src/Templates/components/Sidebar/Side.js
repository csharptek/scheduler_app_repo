  // import { React } from 'react'
  // import "./side.css"
  // import { useState, useEffect } from 'react';
  // import Dropdown from 'react-bootstrap/Dropdown';
  // import { Link, useLocation } from "react-router-dom";
  // import { GiHamburgerMenu } from "react-icons/gi"
  // import { AiOutlineDashboard } from "react-icons/ai"
  // import { TbFileInvoice } from "react-icons/tb"
  // import { FaUserFriends } from "react-icons/fa"
  // import { ImUserPlus } from "react-icons/im"
  // import { IoMdSettings } from "react-icons/io"
  // import { TbDashboard } from "react-icons/tb"
  // // import "./side.scss"

  // import {
  //   Badge,
  //   Button,
  //   ButtonGroup,
  //   Card,
  //   Collapse,
  //   Form,
  //   InputGroup,
  //   Navbar,
  //   Nav,
  //   Pagination,
  //   Container,
  //   Row,
  //   Col
  // } from "react-bootstrap";

  // function Side(props) {

  //   // to check for active links and opened collapses
  //   let location = useLocation();
  //   // this is for the user collapse
  //   const [userCollapseState, setUserCollapseState] = useState(true);

  //   const [imenuId, setimenuId] = useState(9)

  //   const menu = [
  //     {
  //       nme: "Interview",
  //       nmeIcon: <FaUserFriends/>,
  //       submenu: [{
  //         submenu1: "Schedule Interview",
  //         submenumini: "SI",
  //         sublink: "/dashboard"
  //       }, {
  //         submenu1: "Scheduled Interview List",
  //         submenumini: "SL",
  //         sublink: "/InterviewList"
  //       },
  //       {
  //         submenu1: "Add User",
  //         submenumini: "AU",
  //         sublink: "/addUser"
  //       },
  //       , {
  //         submenu1: "Interview Schedule",
  //         submenumini: "IS",
  //         sublink: "/Interview"
  //       }
  //       , {
  //         submenu1: "Interview Lists",
  //         submenumini: "IL",
  //         sublink: "/listofintewview"
  //       }
  //       ]
  //     }
  //   ];

  //   return (
  //     <>
  //       {/* <div className="sidebar col-3" >*/}
  //       <div className="sidebar">
  //         <div className="sidebar-wrapper">
  //           <div className="logo">
  //             <span className="simple-text logo-mini"> <img className='minilogo' alt="" src={require("../../../assets/img/minilogo.png")} /></span>
  //             <a
  //               className="simple-text logo-normal"
  //               href="http://www.csharptek.com"
  //             >
  //               <img className='sidebarlogo' alt="" src={require("../../../assets/img/logo.png")} />

  //             </a>
  //             <Button
  //               className="btn-fill btn-round btn-icon d-none d-lg-block burger border-dark"
  //               variant="light"
  //               onClick={() => document.body.classList.toggle("sidebar-mini")}
  //             >
  //               <i className='sideicon'><GiHamburgerMenu /></i>
  //             </Button>

  //           </div>
  //           {
  //             menu.map((menu, i) => (
  //               props.role == "User" ?
  //                 i < 1 ?
  //                   <div className="user" key={i} onClick={() => document.documentElement.classList.toggle("nav-open")} >
  //                     <div className="info">
  //                       <a
  //                         className={userCollapseState ? "collapsed" : ""}
  //                         data-toggle="collapse"
  //                         href="#pablo"
  //                         onClick={(e) => {
  //                           e.preventDefault();
  //                           setUserCollapseState(!userCollapseState);
  //                           setimenuId(userCollapseState ? i : 9);
  //                         }}
  //                         aria-expanded={userCollapseState}
  //                       >
  //                         <span>
  //                           {menu.nme} <b className="caret"></b>
  //                         </span>
  //                       </a>

  //                     </div>
  //                   </div>
  //                   : null : props.role == "Admin" ?
  //                   i < 4 ?
  //                     <div className="user" key={i}>

  //                       <div className="info">
  //                         <span className="sidebar-mini IconSideBar">{menu.nmeIcon}</span>
  //                         <a
  //                           className={(userCollapseState) ? "collapsed forIcon" : "forIcon"}
  //                           data-toggle="collapse"
  //                           href="#pablo"
  //                           onClick={(e) => {
  //                             e.preventDefault();
  //                             setUserCollapseState(imenuId == i ? !userCollapseState : false);
  //                             setimenuId(i);
  //                           }}
  //                           aria-expanded={userCollapseState}
  //                         >

  //                           <span>
  //                             {menu.nme} <b className="caret"></b>
  //                           </span>
  //                         </a>
  //                         <Collapse id="collapseExample" in={(imenuId == i && userCollapseState == false) ? true : false}>
  //                           <div>
  //                             <Nav as="ul">

  //                               {
  //                                 menu.submenu.map((smenu) => (
  //                                   <li>
  //                                     <a
  //                                       className="profile-dropdown"
  //                                       // href={"#"+smenu.sublink}
  //                                       onClick={(e) => { e.preventDefault(); document.documentElement.classList.toggle("nav-open") }}
  //                                     >
  //                                       <Link to={smenu.sublink}>
  //                                         <span className="sidebar-mini">{smenu.submenumini}</span>
  //                                         <span className="sidebar-normal">{smenu.submenu1}</span>
  //                                       </Link>
  //                                     </a>
  //                                   </li>
  //                                 ))
  //                               }
  //                             </Nav>
  //                           </div>
  //                         </Collapse>
  //                       </div>
  //                     </div> : null : props.role == "SuperAdmin" ?
  //                     i <= 5 ?
  //                       <div className="user" key={i} onClick={() => document.documentElement.classList.toggle("nav-open")} >

  //                         <div className="info">
  //                           <a
  //                             className={userCollapseState ? "collapsed" : ""}
  //                             data-toggle="collapse"
  //                             href="#pablo"
  //                             onClick={(e) => {
  //                               e.preventDefault();
  //                               setUserCollapseState(!userCollapseState);
  //                               setimenuId(i);
  //                             }}
  //                             aria-expanded={userCollapseState}
  //                           >
  //                             <span>
  //                               {menu.nme} <b className="caret"></b>
  //                             </span>
  //                           </a>
  //                           <Collapse id="collapseExample" in={imenuId == i ? true : false}>
  //                             <div>
  //                               <Nav as="ul">
  //                                 <li>
  //                                   <a
  //                                     className="profile-dropdown"
  //                                     href="#pablo"
  //                                     onClick={(e) => e.preventDefault()}
  //                                   >
  //                                     <span className="sidebar-mini">MP</span>
  //                                     <span className="sidebar-normal">My Profile</span>
  //                                   </a>
  //                                 </li>
  //                                 <li>
  //                                   <a
  //                                     className="profile-dropdown"
  //                                     href="#pablo"
  //                                     onClick={(e) => e.preventDefault()}
  //                                   >
  //                                     <span className="sidebar-mini">EP</span>
  //                                     <span className="sidebar-normal">Edit Profile</span>
  //                                   </a>
  //                                 </li>
  //                                 <li>
  //                                   <a
  //                                     className="profile-dropdown"
  //                                     href="#pablo"
  //                                     onClick={(e) => e.preventDefault()}
  //                                   >
  //                                     <span className="sidebar-mini">S</span>
  //                                     <span className="sidebar-normal">Settings</span>
  //                                   </a>
  //                                 </li>
  //                               </Nav>
  //                             </div>
  //                           </Collapse>
  //                         </div>
  //                       </div> : null : null
  //             )

  //             )
  //           }
  //         </div>
  //       </div>
  //     </>
  //   )
  // }

  // export default Side