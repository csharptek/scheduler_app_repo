import { React, useState, useEffect } from "react";
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
    FormLabel
} from 'react-bootstrap';
import { DataGrid } from "@mui/x-data-grid";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import "../App.css"
import { toast, ToastContainer } from 'react-toastify';
 
const Createuser = (props) => {
    const [editPage, setEditPage] = useState(false);
    const [users, setUsers] = useState([]); // State to hold fetched users
    const [error, setError] = useState('');
    const [userPage, setUserPage] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [userList, setUserList] = useState('');
    const [userData, setUserData] = useState({
        name: "",
        EmailId: "",
        PhoneNumber: "",
        Status: '',
        password: "",
        confirmPassword: "",
    });
 
    useEffect(() => {
        axios.get('http://localhost:8000/createusers/users/')
            .then((response) => {
                setUsers(response.data); // Set fetched data to state
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []); // Empty dependency array means this will run once on mount
 
    const columns = [
        { field: "id", headerName: "ID", width: 75 },
        { field: "name", headerName: "Name", width: 175 },
        { field: "email_id", headerName: "Email", width: 175 },
        { field: "phone_number", headerName: "Phone No.", width: 150 },
        {
            field: 'icon1',
            headerName: 'Actions',
            width: 120,
            renderCell: (params) => (
                <div className='w-16 flex justify-around h-full items-center'>
                    <FaRegEdit size={20} style={{ cursor: 'pointer' }} onClick={() => handleEditUser(params.row)} />
                    <MdOutlineDeleteForever size={23} style={{ cursor: 'pointer' }} onClick={() => handleDeleteUser(params.row.id)} />
                </div>
            ),
        },
    ];
 
    const handleEditUser = (row) => {
        setEditPage(true);
        setUserData({
            name: row.name,
            email_id: row.email_id,
            phone_number: row.phone_number,
            id: row.id, // Store the user ID for updating
        });
    };
 
    const handleCreateandEditUser = () => {
        setUserPage(!userPage);
        setEditPage(false);
    };
 
    const handleCross = () => {
        setUserPage(false);
        setEditPage(false);
        setUserData({
            name: "",
            email_id: "",
            phone_number: "",
            Status: '',
            password: "",
            confirmPassword: "",
        });
    };
    const fetchAccessToken = async () => {
        try {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: '####################################/schedulerAPI/interviews/token/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            };
            axios.request(config)
                .then((response) => {
                    console.log('99999999', response);
                    setAccessToken(response.data.tokenData.access_token)
                    getUserList(response.data.tokenData.access_token)
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.error('Error fetching the access token:', error);
        }
    };
 
    const getUserList = async (tkn) => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://graph.####################################ame&$count=true&$filter=accountEnabled eq true and ####################################)',
            headers: {
                'Authorization': `Bearer ${tkn}`,
                'ConsistencyLevel': 'eventual'
            }
        };
 
        axios.request(config)
            .then((response) => {
                console.log('000000', response);
                setUserList(response.data.value)
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("userData", userData);
   
        // Check password validity
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(userData.password)) {
            setError('Password must be at least 8 characters long, include letters, numbers, and special characters.');
        } else {
            setError('');
   
            if (userData.password !== userData.confirmPassword) {
                setError("Passwords do not match");
   
                axios.post('http://localhost:8000/api/validate-passwords', { password: userData.password, confirmPassword: userData.confirmPassword })
                    .then((response) => {
                        console.log('Password mismatch validation response:', response);
                    })
                    .catch((error) => {
                        console.error('Error validating passwords:', error);
                    });
   
            } else {
                setError("");  // Clear the error message when passwords match
            }
   
            const newUser = {
                name: userData.name,
                email_id: userData.email_id,
                phone_number: userData.phone_number,
                roles: userData.Status,
                password: userData.password,
                confirmPassword: userData.confirmPassword,
            };
   
            // If it's an edit, send a PUT request; otherwise, a POST request
            if (editPage) {
                axios.put(`http://localhost:8000/createusers/users/${userData.id}/`, newUser)
                    .then((response) => {
                        console.log('User updated:', response.data);
                        setUserData({
                            name: "",
                            email_id: "",
                            phone_number: "",
                            Status: '',
                            password: "",
                            confirmPassword: "",
                        });
                        // Refresh user data after update
                        axios.get('http://localhost:8000/createusers/users/')
                            .then((response) => {
                                setUsers(response.data);
                            })
                            .catch((error) => {
                                console.error('Error fetching users after update:', error);
                            });
                    })
                    .catch((error) => {
                        console.error('Error updating user:', error);
                        setError('Failed to update user. Please try again.');
                    });
            } else {
                axios.post(projectApiList.createUser, newUser)
                    .then((response) => {
                        console.log('User created:', response.data);
                        setUserData({
                            name: "",
                            email_id: "",
                            phone_number: "",
                            Status: '',
                            password: "",
                            confirmPassword: "",
                        });
                        toast.success('User Created successfully!', {
                            autoClose: 3000, // Close the toast after 3 seconds
                        });
                        // Refresh user data after creation
                        axios.get('http://localhost:8000/createusers/users/')
                            .then((response) => {
                                setUsers(response.data);
                            })
                            .catch((error) => {
                                console.error('Error fetching users after creation:', error);
                            });
                    })
                    .catch((error) => {
                        console.error('Error creating user:', error);
                        toast.error('Failed to create user. Please try again.', {
                            autoClose: 3000, // Close the toast after 3 seconds
                        });
                    });
            }
        }
    };
   
 
    const handleDeleteUser = (userId) => {
        axios.delete(`http://localhost:8000/createusers/users/${userId}/`)
            .then(() => {
                console.log('User deleted');
                // Refresh the list of users after deletion
                axios.get('http://localhost:8000/createusers/users/')
                    .then((response) => {
                        setUsers(response.data); // Set fetched data to state
                    })
                    .catch((error) => {
                        console.error('Error fetching users after deletion:', error);
                    });
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
                setError('Failed to delete user. Please try again.');
            });
    };
 
    useEffect(() => {
        fetchAccessToken();
        // getUserList()
    }, [])
 
    return (
        <>
            {/* {console.log("userlist", userList)} */}
            <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '15px' }}>
                <button style={{ width: '8%', height: '28px', backgroundColor: 'skyblue', color: 'white' }} onClick={handleCreateandEditUser}>+</button>
            </div>
            <div style={{ width: '100%',height:"70%", display: 'flex', justifyContent: 'space-between' , gap:"10px"}}>
                <div style={{ height: 300, width: "70%", backgroundColor: "white" }}>
                    <DataGrid rows={users} columns={columns} />
                </div>
                {userPage || editPage ? <>
                    <div style={{ display: 'flex',height:"max-content", width:"40%", justifyContent: 'center' }}>
                        <Card style={{  height: '100%',width:"100%", paddingLeft: '15px' }}>
                            <CardTitle tag="h6" className="border-bottom p-3 !font-semibold !text-xl flex justify-between !text-blue-600"
                                style={{ display: 'flex', justifyContent: 'space-between', padding: '9px', color: 'blue', }}
                            >
                                {editPage ? <>Edit user</> : <> Create User</>} <RxCross2 onClick={handleCross} />
                            </CardTitle>
                            <CardBody className="w-[100%] flex justify-evenly ">
                                <Form style={{ display: 'flex', flexDirection: 'column',gap :"15px", height:"100%", justifyContent: 'space-between',alignItems:"center" }} onSubmit={handleSubmit}>
 
 
                                    <FormGroup className="w-full" style={{width: "100%"}}>
                                        <FormControl
                                          className="form-control-sm "
                                            id="name"
                                            name="name"
                                            type="name"
                                            placeholder="Enter Name"
                                            value={userData.name || ''}
                                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                            required
                                        />
                                    </FormGroup >
 
                                    <FormGroup style={{width: "100%"}}>
                                        <FormControl
                                        className="form-control-sm "
                                            id="email_id"
                                            name="email_id"
                                            type="email"
                                            placeholder="Enter Email"
                                            value={userData.email_id || ''}
                                            onChange={(e) => setUserData({ ...userData, email_id: e.target.value })}
                                            required
                                        />
                                    </FormGroup>
 
                                    <FormGroup style={{width: "100%"}}>
                                        <FormControl
                                        className="form-control-sm "
                                            id="phone_number"
                                            name="phone_number"
                                            placeholder="Enter Phone"
                                            type="text"
                                            maxLength="10"
                                            value={userData.phone_number || ''}
                                            onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup style={{width: "100%"}}>
                                        {/* <FormLabel>Status</FormLabel> */}
                                        <FormControl
                                        className="form-control-sm "
                                            id="Status"
                                            name="Status"
                                            as="select"
                                            value={userData.Status}
                                            // onChange={handleChange}
                                            onChange={(e) => setUserData({ ...userData, Status: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Role</option>
                                            <option value="admin">Admin</option>
                                            <option value="internal recruiter">Internal Recruiter</option>
                                            <option value="external recruiter">External Recruiter</option>
                                            <option value="interviewer">Interviewer</option>
                                            {/* <option value="Rejected">Rejected</option>
                                            <option value="Rescheduled">Rescheduled</option> */}
                                        </FormControl>
                                    </FormGroup>
                                       
                                    <FormGroup style={{width: "100%"}}>
                                        <FormControl
                                        className="form-control-sm "
                                            id="password"
                                            name="password"
                                            placeholder="Enter Password"
                                            type="password"
                                            maxLength="300"
                                            value={userData.password}
                                            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                            required
                                        />
                                        <div style={{ fontSize: '10px', color: 'red' }}>{error}</div>
                                    </FormGroup>
                                    <FormGroup style={{width: "100%"}}>
                                        <FormControl
                                        className="form-control-sm "
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            type="password"
                                            maxLength="300"
                                            value={userData.confirmPassword}
                                            onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                                            required
                                        />
                                        <div style={{ fontSize: '10px', color: 'red' }}>{error}</div>
                                    </FormGroup>
                                    <Button type="submit" className="form-control-sm mt-1 text-white">
                                        {editPage ? <>Update</> : <> Submit</>}
                                    </Button>
                                    <ToastContainer />
                                </Form>
                            </CardBody>
                            
                        </Card>
                    </div>
                </> : null}
            </div>
        </>
    );
};
 
export default Createuser;