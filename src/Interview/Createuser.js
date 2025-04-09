import { React, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Col,
  Row,
  Card,
  CardTitle,
  CardBody,
  Form,
  FormGroup,
  FormControl,
  Button,
  FormLabel,
  Modal,
  Spinner,
} from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import { FaRegEdit, FaUserMinus } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import "../App.css";
import { toast, ToastContainer } from "react-toastify";
import { projectApiList } from "../config/config";
import { Switch } from "@mui/material";
import SendApprovalEmail from "./EmailTemplate/sendApprovalEmail ";

const Createuser = (props) => {
  const [editPage, setEditPage] = useState(false);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({
    EmailId: "",
    password: "",
    confirmPassword: "",
    PhoneNumber: "",
  });
  const [error, setError] = useState("");
  const [userPage, setUserPage] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [userList, setUserList] = useState("");
  const [userData, setUserData] = useState({
    Name: "",
    EmailId: "",
    PhoneNumber: "",
    Status: "",
    password: "",
    confirmPassword: "",
    organization_name: "",
    agreed_fees: "",
  });
  const [touched, setTouched] = useState({
    EmailId: false,
    PhoneNumber: false,
    password: false,
    confirmPassword: false,
    organization_name: false,
    agreed_fees: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Btnloading, setBtnLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [userNameToDelete, setUserNameToDelete] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(projectApiList.getUsers)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);


  const handleToggleStatus = (id, currentStatus) => {
    setSelectedUserId(id);
    setCurrentStatus(currentStatus);
    setOpenDialog(true);
  };

  const handleConfirmToggle = async () => {
    setIsProcessing(true);
    try {
        const newStatus = !currentStatus;
        const user = users.find(u => u.Id === selectedUserId);

        if (!user) {
            console.error("❌ User not found.");
            toast.error("User not found.");
            return;
        }

        console.log("🔍 User details:", user);

        await axios.patch(projectApiList.toggleUserStatus, {
            userId: selectedUserId,
            isEnabled: newStatus
        });

        if (newStatus && !user.AzureAdObjectId) {
            try {
                const provisionResponse = await axios.post(
                    projectApiList.provisionExternalRecruiter,
                    { userId: selectedUserId }
                );

                if (provisionResponse.data.AzureAdObjectId) {
                    setUsers(users.map(u =>
                        u.Id === selectedUserId ? {
                            ...u,
                            IsEnabled: newStatus,
                            AccountStatus: "Active",
                            AzureAdObjectId: provisionResponse.data.AzureAdObjectId
                        } : u
                    ));

                    toast.success("User enabled and Azure AD account provisioned successfully");

                    await SendApprovalEmail({ user });

                    return;
                }
            } catch (provisionError) {
                console.error("❌ Provisioning failed:", provisionError);
                await axios.patch(projectApiList.toggleUserStatus, {
                    userId: selectedUserId,
                    isEnabled: false
                });

                throw new Error("User enabled but Azure AD provisioning failed. Status reverted.");
            }
        }

        if (newStatus) {
            await SendApprovalEmail({ user });
        }

        setUsers(users.map(u =>
            u.Id === selectedUserId ? {
                ...u,
                IsEnabled: newStatus,
                AccountStatus: newStatus ? "Active" : "Disabled"
            } : u
        ));

        toast.success(`User ${newStatus ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
        console.error("❌ Error:", error);
        toast.error(error.message || "Failed to update user status");
    } finally {
        setIsProcessing(false);
        setOpenDialog(false);
    }
};

  const handleCloseDialog = () => {
    if (!isProcessing) {
      setOpenDialog(false);
    }
  };

  // get user data on landing page
  const columns = [
    {
      field: "serialNumber",
      headerName: "S.No",
      maxWidth: 70,
      flex: 0.5,
      renderCell: (params) =>
        params.api.getRowModels().size > 0
          ? [...params.api.getRowModels().keys()].indexOf(params.id) + 1
          : "",
    },
    {
      field: "Name",
      headerName: "Name",
      flex: 0.25,
      renderCell: (params) => {
        const isExternalRecruiter = params.row.Roles === "external recruiter"; // Check if the user is an external recruiter
 
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
             {/* Icon only for external recruiters */}
            {params.row.Name } {isExternalRecruiter && <FaUserMinus style={{ marginLeft: "8px", color: "blue" }} />}
          </div>
        );
      },
    },
    { field: "EmailId", headerName: "Email", flex: 0.25 },
    { field: "PhoneNumber", headerName: "Phone No.", flex: 0.2 },
    {
      field: "IsEnabled",
      headerName: "Status",
      flex: 0.2,
      renderCell: (params) => {
        const status = params.row.IsEnabled || false;
        const isExternalRecruiter = params.row.Roles === "external recruiter"; // Check if the user is an external recruiter
        const statusExternalRecruiter = isExternalRecruiter ? "Pending" : "";  // Show 'Pending' for external recruiter
        const currentStatus = params.row.Status || false; // Get the current status to control the toggle
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
          
          <Switch
            checked={status}
            onChange={() => handleToggleStatus(params.row.Id, status)}
            color={status ? "success" : "error"}
            inputProps={{ 'aria-label': 'status toggle' }}
          />
          {statusExternalRecruiter && <span style={{ color: 'red' }}>{statusExternalRecruiter}</span>}
            </div>

          
        );
      },
    },
    {
      field: "icon1",
      headerName: "Actions",
      flex: 0.2,
      renderCell: (params) => (
        <div
          className="w-16 flex justify-around h-full items-center"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "10px",
          }}
        >
          <FaRegEdit
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => handleEditUser(params?.row)}
          />
          <MdOutlineDeleteForever
            size={23}
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => {
              setIsDeleteModalOpen(true);
              setUserIdToDelete(params?.row?.Id);
              setUserNameToDelete(params.row.Name);
            }}
          />
        </div>
      ),
    },
  ];

  const handleEditUser = (row) => {
    setEditPage(true);
    setUserData({
      Name: row.Name,
      EmailId: row.EmailId,
      PhoneNumber: row.PhoneNumber,
      Status: row.roles,
      Id: row.Id,
      organization_name: row.organization_name,
      agreed_fees: row.agreed_fees,
    });
    setShowModal(true);
  };

  const handleCreateandEditUser = () => {
    setUserPage(!userPage);
    setEditPage(false);
    setShowModal(true);
  };

  const handleCross = () => {
    setShowModal(false);
    setUserData({
      Name: "",
      EmailId: "",
      PhoneNumber: "",
      Status: "",
      password: "",
      confirmPassword: "",
      organization_name: "",
      agreed_fees: "",
    });
    setErrors({
      EmailId: "",
      password: "",
      confirmPassword: "",
      PhoneNumber: "",
      organization_name: "",
      agreed_fees: "",
    });
    setTouched({
      EmailId: false,
      PhoneNumber: false,
      password: false,
      confirmPassword: false,
      organization_name: false,
      agreed_fees: false,
    });
  };
  const handleSubmit = (e) => {
    console.log("1");
    e.preventDefault();
    console.log("userData:", userData);
    if (!editPage) {
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(userData.password)) {
        console.log("2");
        setErrors(
          "Password must be at least 8 characters long, include letters, numbers, and special characters."
        );
        return;
      }
      if (userData.password !== userData.confirmPassword) {
        setErrors("Passwords do not match");
        return;
      }
    }
    setErrors("");
    const newUser = {
      Name: userData.Name,
      EmailId: userData.EmailId,
      PhoneNumber: userData.PhoneNumber,
      Status: userData.Status,
      ...(editPage
        ? {}
        : {
            password: userData.password,
            confirmPassword: userData.confirmPassword,
          }),
    };
    console.log("newUser:", newUser);
    if (editPage) {
      console.log("4", newUser);
      setBtnLoading(true);
      axios
        .put(projectApiList.updateUser(userData.Id), newUser)
        .then((response) => {
          setShowModal(false);
          setBtnLoading(false);
          toast.success("User Updated successfully!", { autoClose: 3000 });
          setUserData({
            Name: "",
            EmailId: "",
            PhoneNumber: "",
            Status: "",
            password: "",
            confirmPassword: "",
            organization_name: "",
          });
          axios
            .get(projectApiList.getUsers)
            .then((response) => {
              setUsers(response.data);
            })
            .catch((error) => {
              console.error("Error fetching users after update:", error);
            });
        })
        .catch((error) => {
          if (error.response?.data === "The email address is already in use.") {
            toast.error("This Email ID already exists.", { autoClose: 3000 });
          } else {
            toast.error("Failed to update user. Please try again.", {
              autoClose: 3000,
            });
          }
        });
    } else {
      setBtnLoading(true);
      axios
        .post(projectApiList.createUser, newUser)
        .then((response) => {
          setBtnLoading(false);
          setShowModal(false);
          setUserData({
            Name: "",
            EmailId: "",
            PhoneNumber: "",
            Status: "",
            password: "",
            confirmPassword: "",
          });

          toast.success("User Created successfully!", { autoClose: 3000 });
          axios
            .get(projectApiList.getUsers)
            .then((response) => {
              setUsers(response.data);
            })
            .catch((error) => {
              console.error("Error fetching users after creation:", error);
            });
        })
        .catch((error) => {
          console.error("Error creating user:", error);
          if (error.response?.data === "The email address is already in use.") {
            toast.error("This Email ID already exists.", { autoClose: 3000 });
          } else {
            toast.error("Failed to create user. Please try again.", {
              autoClose: 3000,
            });
          }
          setBtnLoading(false);
          setShowModal(false);
        });
    }
  };
  const handleDeleteUser = (userId) => {
    axios
      .delete(projectApiList.deleteUser(userId))
      .then(() => {
        setIsDeleteModalOpen(false);
        axios
          .get(projectApiList.getUsers)
          .then((response) => {
            setUsers(response.data);
          })
          .catch((error) => {
            console.error("Error fetching users after deletion:", error);
          });
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        setErrors("Failed to delete user. Please try again.");
      });
  };
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
        .custom-input {
            border: 1px solid #ced4da;
            padding: 0.375rem 0.75rem;
            border-radius: 4px;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            font-size: 0.875rem;
            font-family: "IBM Plex Sans", sans-serif !important;
            font-weight: 400 !important;
        }
        .custom-input:focus {
            border-color: #80bdff !important;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
            outline: none;
        }
        .custom-input::placeholder {
            font-family: "IBM Plex Sans", sans-serif !important;
            font-weight: 400 !important;
            color: #6c757d; /* Optional, change if needed */
        }
        .submit-btn {
            // background: linear-gradient(45deg, #1e3c72, #2a5298);
            background: green;
            color: white;
            font-weight: bold;
            width:100%;
            border: none !important;
            outline: none !important;
        }
            .modal-title {
            font-family: "IBM Plex Sans", sans-serif !important;
            font-weight: 400 !important;
            color: #023020
        }
            .submit-btn.disabled {
             background: #6c757d !important; /* Grey when invalid */
             cursor: not-allowed;
             color :white !important;
             opacity:0.6 !important;
}

            .submit-btn.enabled {
             background: linear-gradient(45deg, #028A0F, #026F00) !important; /* Green when valid */
             cursor: pointer;
             color:white !important
}
            .submit-btn:focus,
            .submit-btn:active {
              outline: none !important;
             box-shadow: none !important; /* Removes the blue border on focus */
}

            .submit-btn,enabled:hover {
              background: linear-gradient(45deg, #026F00, #028A0F) !important; /* Slight variation on hover */
              opacity: 1 !important; /* Ensure it doesn't disappear */
}
            
    `;
    document.head.appendChild(style);
  }, []);
  const isFormValid =
    userData?.Name?.trim() !== "" &&
    userData?.EmailId?.trim() !== "" &&
    /^\S+@\S+\.\S+$/.test(userData?.EmailId || "") &&
    userData?.PhoneNumber?.trim().length === 10 &&
    /^[6789]\d{9}$/.test(userData?.PhoneNumber || "") &&
    userData?.Status?.trim() !== "" &&
    (!editPage
      ? /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          userData?.password || ""
        ) && userData?.password === userData?.confirmPassword
      : true) &&
    Object.values(errors).every((error) => error === "");
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setUserData((prev) => ({ ...prev, EmailId: email }));

    if (touched.EmailId && /^\S+@\S+\.\S+$/.test(email)) {
      setErrors((prev) => ({ ...prev, EmailId: "" }));
    }
  };
  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, EmailId: true }));

    if (!/^\S+@\S+\.\S+$/.test(userData.EmailId || "")) {
      setErrors((prev) => ({
        ...prev,
        EmailId: "Please enter a valid email ID.",
      }));
    }
  };
  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    if (/^[6789]\d{0,9}$/.test(phone) || phone === "") {
      setUserData((prev) => ({ ...prev, PhoneNumber: phone }));
    }
    if (touched.PhoneNumber && phone.length === 10) {
      setErrors((prev) => ({ ...prev, PhoneNumber: "" }));
    }
  };
  const handlePhoneBlur = () => {
    setTouched((prev) => ({ ...prev, PhoneNumber: true }));
    if (!/^[6789]\d{9}$/.test(userData.PhoneNumber || "")) {
      setErrors((prev) => ({
        ...prev,
        PhoneNumber: "Please enter a valid 10-digit phone number.",
      }));
    }
  };
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setUserData((prev) => ({ ...prev, password }));
    if (
      touched.password &&
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };
  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));

    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        userData.password || ""
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must be at least 8 characters and include a letter, a number, and a special character.",
      }));
    }
  };
  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setUserData((prev) => ({ ...prev, confirmPassword }));
    if (touched.confirmPassword && confirmPassword === userData.password) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };
  const handleConfirmPasswordBlur = () => {
    setTouched((prev) => ({ ...prev, confirmPassword: true }));

    if (userData.confirmPassword !== userData.password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
    }
  };

  const handleOrganizationChange = (e) => {
    const organization_name = e.target.value;
    setUserData((prev) => ({ ...prev, organization_name: organization_name }));

    if (touched.organization_name && userData.organization_name.trim() !== "") {
      setErrors((prev) => ({ ...prev, organization_name: "" }));
    }
  };
  const handleOrganizationBlur = () => {
    setTouched((prev) => ({ ...prev, organization_name: true }));

    if (userData.organization_name === "") {
      setErrors((prev) => ({
        ...prev,
        organization_name: "Please Enter Your Organization Name",
      }));
    }
  };

  const handleAgreedFeesChange = (e) => {
    let value = e.target.value;

    // Remove non-numeric characters immediately
    value = value.replace(/\D/g, "");

    setUserData((prev) => ({ ...prev, agreed_fees: value }));

    if (touched.agreed_fees && value.trim() === "") {
      setErrors((prev) => ({ ...prev, agreed_fees: "" }));
    }
  };
  const handleAgreedFeesBlur = () => {
    setTouched((prev) => ({ ...prev, agreed_fees: true }));

    if (!/^\d+$/.test(userData.agreed_fees)) {
      setErrors((prev) => ({
        ...prev,
        agreed_fees: "Enter a valid number (e.g., 100, 200).",
      }));
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button
          style={{
            width: "8%",
            height: "38px",
            backgroundColor: "#023020",
            color: "white",
            margin: "20px",
            padding: "5px 5px",
          }}
          onClick={handleCreateandEditUser}
        >
          <span>+</span>
          <span style={{ paddingLeft: "10px" }}>Add User</span>
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ height: 380, width: "70%", backgroundColor: "white" }}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p>Loading data...</p>
            </div>
          ) : (
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row.Id}
              sx={{
                "& .MuiDataGrid-root": {
                  border: "1px solid rgba(224, 224, 224, 1)",
                  fontFamily: '"IBM Plex Sans", sans-serif !important',
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  color: "#023020",
                  fontSize: "14px",
                  fontWeight: "bold",
                  textAlign: "center",
                  borderBottom: "2px solid rgba(224, 224, 224, 1)",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  textAlign: "center",
                  fontWeight: "bold",
                  width: "100%",
                },
                "& .MuiDataGrid-cell": {
                  borderRight: "1px solid rgba(224, 224, 224, 1)",
                  borderBottom: "1px solid rgba(224, 224, 224, 1)",
                  fontSize: "13px",
                  textAlign: "center",
                },
                "& .MuiDataGrid-row": {
                  borderBottom: "1px solid rgba(224, 224, 224, 1)",
                  "&:hover": {
                    backgroundColor: "#f9f9f9",
                  },
                },
                "& .MuiDataGrid-virtualScroller": {
                  overflowX: "auto",
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "2px solid rgba(224, 224, 224, 1)",
                },
              }}
            />
          )}
        </div>
      </div>
      <Modal show={showModal} onHide={handleCross}>
        <Modal.Header closeButton>
          <Modal.Title>{editPage ? "Edit User" : "Create User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <FormGroup
              className="w-full"
              style={{ width: "100%", marginBottom: "20px" }}
            >
              <FormControl
                className="custom-input"
                id="Name"
                Name="Name"
                type="Name"
                placeholder="Enter Name"
                value={userData.Name || ""}
                onChange={(e) =>
                  setUserData({ ...userData, Name: e.target.value })
                }
                required
              />
            </FormGroup>

            <FormGroup style={{ width: "100%", marginBottom: "20px" }}>
              <FormControl
                className="custom-input"
                id="PhoneNumber"
                Name="PhoneNumber"
                placeholder="Enter Phone"
                type="text"
                maxLength="10"
                value={userData.PhoneNumber || ""}
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
                required
              />
              {errors.PhoneNumber && (
                <p style={{ fontSize: "12px", color: "red", marginTop: "5px" }}>
                  {errors.PhoneNumber}
                </p>
              )}
            </FormGroup>
            <FormGroup style={{ width: "100%", marginBottom: "20px" }}>
              <FormControl
                className="custom-input"
                id="Status"
                Name="Status"
                as="select"
                value={userData.Status}
                onChange={(e) =>
                  setUserData({ ...userData, Status: e.target.value })
                }
                required
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Internal Recruiter">Internal Recruiter(super admin)</option>
                <option value="ExternalRecruiter">External Recruiter</option>
                <option value="Interviewer">Interviewer(user)</option>
              </FormControl>
            </FormGroup>

            {userData.Status === "external recruiter" && (
              <>
                <FormGroup style={{ width: "100%", marginBottom: "20px" }}>
                  <FormControl
                    className="custom-input"
                    id="organization_name"
                    name="organization_name"
                    placeholder="Organization Name"
                    type="organization_name"
                    maxLength="300"
                    value={userData.organization_name || ""}
                    onChange={handleOrganizationChange}
                    onBlur={handleOrganizationBlur}
                    required
                  />
                  {errors.organization_name && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "red",
                        marginTop: "5px",
                      }}
                    >
                      {errors.organization_name}
                    </p>
                  )}
                </FormGroup>

                <FormGroup style={{ width: "100%", marginBottom: "20px" }}>
                  <FormControl
                    className="custom-input"
                    id="agreed_fees"
                    name="agreed_fees"
                    placeholder="Agreed Fees"
                    type="agreed_fees"
                    maxLength="20"
                    onChange={handleAgreedFeesChange}
                    onBlur={handleAgreedFeesBlur}
                    value={userData.agreed_fees}
                    required
                  />
                  {errors.agreed_fees && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "red",
                        marginTop: "5px",
                      }}
                    >
                      {errors.agreed_fees}
                    </p>
                  )}
                </FormGroup>
              </>
            )}
            {!editPage && (
              <>
                <FormGroup style={{ width: "100%", marginBottom: "20px" }}>
                  <FormControl
                    className="custom-input"
                    id="EmailId"
                    Name="EmailId"
                    type="email"
                    placeholder="Enter Email"
                    value={userData.EmailId || ""}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    required
                  />
                  {errors.EmailId && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "red",
                        marginTop: "5px",
                      }}
                    >
                      {errors.EmailId}
                    </p>
                  )}
                </FormGroup>
                <FormGroup style={{ width: "100%", marginBottom: "20px" }}>
                  <FormControl
                    className="custom-input"
                    id="password"
                    Name="password"
                    placeholder="Enter Password"
                    type="password"
                    maxLength="300"
                    value={userData.password || ""}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    required
                  />
                  {errors.password && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "red",
                        marginTop: "5px",
                      }}
                    >
                      {errors.password}
                    </p>
                  )}
                </FormGroup>
                <FormGroup style={{ width: "100%", marginBottom: "20px" }}>
                  <FormControl
                    className="custom-input"
                    id="confirmPassword"
                    Name="confirmPassword"
                    placeholder="Confirm Password"
                    type="password"
                    maxLength="300"
                    onChange={handleConfirmPasswordChange}
                    onBlur={handleConfirmPasswordBlur}
                    value={userData.confirmPassword || ""}
                    required
                  />
                  {errors.confirmPassword && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "red",
                        marginTop: "5px",
                      }}
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </FormGroup>
              </>
            )}
            <Button
              type="submit"
              className={`submit-btn form-control-sm mt-1 text-white ${
                isFormValid ? "enabled" : "disabled"
              }`}
              disabled={!isFormValid || Btnloading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Processing...
                </>
              ) : editPage ? (
                "Update"
              ) : (
                "Submit"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        show={isDeleteModalOpen}
        onHide={() => setIsDeleteModalOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Do you really want to delete{" "}
            <strong className="text-danger">{userNameToDelete}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => handleDeleteUser(userIdToDelete)}
          >
            Yes, Delete
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {currentStatus ? "Disable User?" : "Enable User?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {currentStatus
              ? "Disabling will prevent this user from accessing the system."
              : "Enabling will allow this user to access the system."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="error"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmToggle}
            autoFocus
            color="primary"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};
export default Createuser;
