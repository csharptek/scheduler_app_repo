import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl, Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import { projectApiList } from '../config/config';
import { MdOutlineDeleteForever } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid";


function ListofInterview(props) {
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);
    const [del_id, setdel_id] = useState(0);
    const [loggedInUser, setloggedInUser] = useState('');
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedInterviewer, setSelectedInterviewer] = useState('');
    const [interviewDate, setInterviewDate] = useState('');
    const [interviewRound, setInterviewRound] = useState('');
    const [inviteLink, setInviteLink] = useState('');
    const [gettoken, setGettoken] = useState('');
    const [interviewDetails, setInterviewDetails] = useState(null);
    const [interviewers, setInterviewers] = useState([]);
    const [userList, setUserList] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchJobTitle, setSearchJobTitle] = useState('');
    const [searchTechnology, setSearchTechnology] = useState('');
    const [searchRecruiter, setSearchRecruiter] = useState('');
    const [selectedEmail, setSelectedEmail] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');
    const [userNameToDelete, setUserNameToDelete] = useState('');


    const filteredData = data?.filter((item) => {
        return (
            (searchName === '' || item.name.toLowerCase().includes(searchName.toLowerCase())) &&
            (searchJobTitle === '' || (item.job_title || item.jobTitle).toLowerCase().includes(searchJobTitle.toLowerCase())) &&
            (searchTechnology === '' || (item.core_technology || item.coreTechnology).toLowerCase().includes(searchTechnology.toLowerCase())) &&
            (searchRecruiter === '' || item.recruiter?.toLowerCase().includes(searchRecruiter.toLowerCase()))
        );
    });
    useEffect(() => {
        const user = props.account?.name.split('|');
        const user_name = user[0];
        setloggedInUser(user_name);
        tokenGet();
        setLoading(true);

        axios.get(projectApiList.ScheduleInterviewList)
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });

        axios.get(projectApiList.getUsers)
            .then((response) => {
                setInterviewers(response.data);
                setLoading(false);
                response.data.forEach(interviewer => {
                });
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [del_id]);
    const handleInterviewerChange = (e) => {
        const interviewerId = e.target.value;
        setSelectedInterviewer(interviewerId);
        const selectedInterviewerObj = interviewers.find(interviewer => interviewer.id === parseInt(interviewerId));
        if (selectedInterviewerObj) {
            setSelectedEmail(selectedInterviewerObj.emailId);
            setSelectedName(selectedInterviewerObj.name)
        }
    };
    const handleShowModal = (item) => {
        setInterviewDetails(item);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedInterviewer("")
        setInterviewDate("")
        setInterviewRound("")
    }
    const sendMessage = async (tkn, can_id, dt) => {

        const accessToken = tkn;
        if (!can_id || typeof can_id !== "string" || !can_id.includes("||")) {
            console.error("Invalid can_id format:", can_id);
            return;
        }
        const email_can = can_id.split("||");
        const candidate_email = email_can[1]?.trim();
        if (!candidate_email) {
            console.error("Invalid candidate email extracted:", candidate_email);
            return;
        }
        const currentDateTime = new Date(dt);
        if (isNaN(currentDateTime.getTime())) {
            console.error("Invalid date format provided:", dt);
            return;
        }
        const startDateTime = new Date(currentDateTime.getTime());
        const endDateTime = new Date(startDateTime.getTime() + 0.5 * 60 * 60 * 1000);
        const data = {
            subject: "Interview Scheduled",
            body: {
                contentType: "HTML",
                content: `
                    <p>Dear ${selectedName},</p>
                    <p>Your interview has been scheduled.</p>
                    <p><strong>Details:</strong></p>
                    <ul>
                        <li><strong>Interviewer:</strong> ${interviewDetails.name}</li>
                        <li><strong>Job Title:</strong> ${interviewDetails.jobTitle}</li>
                        <li><strong>Interview Round:</strong> ${interviewRound}</li>
                        <li><strong>Date:</strong> ${interviewDate}</li>
                        <li><strong>Experience:</strong> ${interviewDetails.noOfYearsOfExperience} years</li>
                    </ul>
                    <p>Best regards,</p>
                    <p>Csharptek</p>
                `
            },
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: "Pacific Standard Time",
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: "Pacific Standard Time",
            },
            location: {
                displayName: "Csharptek interviews",
            },
            attendees: [
                {
                    emailAddress: {
                        address: candidate_email.replace(/ /g, ''),
                        name: email_can[0],
                    },
                    type: "required",
                },
            ],
            allowNewTimeProposals: true,
            isOnlineMeeting: true,
            onlineMeetingProvider: "teamsForBusiness",
        };
        const config = {
            method: 'post',
            url: `################################################`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Prefer': 'outlook.timezone="Pacific Standard Time"'
            },
            data: data
        };
        try {
            const res = await axios.request(config);
            const teamsLink = res.data.onlineMeeting.joinUrl;
            setInviteLink(teamsLink);
        } catch (err) {
            console.error('Error creating event:', err);
        }
    };

    const handleDeleteCandidate =(id) => {
        axios
            .delete(projectApiList.DeleteCandidate(id))
            .then(() => {
                setIsDeleteModalOpen(false)
                axios
                    .get(projectApiList.ScheduleInterviewList)
                    .then((response) => {
                        setData(response.data); // Set fetched data to state
                        toast.success("Candidate Deleted successfully!", {
                            autoClose: 3000,  
                        });
                    })
                    .catch((error) => {
                        console.error("Error fetching users after deletion:", error);
                        toast.error("Candidate not deleted . Please try again.", {
                            autoClose: 3000,  
                        });
                    });
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
                setError("Failed to delete user. Please try again.");
            });
    }

    const getUserList = async (tkn) => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://grap####################################alName&$count=trm')`,
            headers: {
                'Authorization': `Bearer ${tkn}`,
                'ConsistencyLevel': 'eventual'
            }
        };

        axios.request(config)
            .then((response) => {
                setUserList(response.data.value);
                sendMessage(tkn, selectedName && selectedEmail ? `${selectedName}||${selectedEmail}` : "", interviewDate);
                setShowModal(false);
                toast.success('Interview Scheduled successfully!', {
                    autoClose: 3000,
                });
            })
            .catch((error) => {
                setShowModal(false);
                toast.error('Interview Not Scheduled', {
                    autoClose: 3000,
                });
            });
    }

    const tokenGet = async () => {
        fetch(projectApiList.scheduleInterviewToken, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setGettoken(data.access_token);
                } else {
                    console.error('Error:', data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching the access token:', error);
            });
    }

    const getToken = async () => {
        const url = 'https://login.microsoftonline.com/####################################/oauth2/v2.0/token';
        const body = new URLSearchParams({
            client_id: '####################################',
            client_secret: '####################################',
            grant_type: 'client_credentials',
            scope: 'https://graph.microsoft.com/.default'
        });
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body
            });

            if (!response.ok) {
                throw new Error('Failed to retrieve token');
            }

            const data = await response.json();
            setToken(data.access_token);
        } catch (err) {
            setError(err.message);
        }
        return (
            <div>
                <button onClick={getToken}>Get Token</button>
                {token && <p>Token: {token}</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            </div>
        );
    };
    const handleSubmit = async () => {
        const interviewData = {
            interviewer: selectedInterviewer,
            date: interviewDate,
            round: interviewRound,
            interviewId: interviewDetails.id,
            candidateDetails: {
                name: interviewDetails.name,
                phoneNumber: interviewDetails.phoneNumber,
                yearsOfExperience: interviewDetails.noOfYearsOfExperience,
                jobTitle: interviewDetails.job_title
            }
        };
        setSelectedInterviewer("")
        setInterviewDate("")
        setInterviewRound("")
        getUserList(gettoken);
    };

    return (
        <>
            <div className="mb-3 p-3" style={{ backgroundColor: '#f7f7f7', borderRadius: '8px' }}>
                <h5>Filter Interviews</h5>

                <Row className="g-3">
                    <Col md={4}>
                        <InputGroup>
                            <InputGroup.Text>Candidate Name</InputGroup.Text>
                            <FormControl
                                type="text"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                placeholder="Search by Candidate Name"
                            />
                        </InputGroup>
                    </Col>
                    <Col md={4}>
                        <InputGroup>
                            <InputGroup.Text>Job Title</InputGroup.Text>
                            <FormControl
                                type="text"
                                value={searchJobTitle}
                                onChange={(e) => setSearchJobTitle(e.target.value)}
                                placeholder="Search by Job Title"
                            />
                        </InputGroup>
                    </Col>
                    <Col md={4}>
                        <InputGroup>
                            <InputGroup.Text>Technology</InputGroup.Text>
                            <FormControl
                                type="text"
                                value={searchTechnology}
                                onChange={(e) => setSearchTechnology(e.target.value)}
                                placeholder="Search by Technology"
                            />
                        </InputGroup>
                    </Col>
                </Row>
            </div>
            <Card className="shadow-lg p-4 rounded-3">
                <div className="table-responsive">
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p>Loading data...</p>
                        </div>
                    ) : (
                        <Table className="custom-table" hover striped bordered>
                            <thead className="table- text-center">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Job Title</th>
                                    <th>Technology</th>
                                    <th>CTC</th>
                                    <th>Experience</th>
                                    <th>Location</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData?.length > 0 ? (
                                    filteredData.sort((a, b) => b.id - a.id).map((item, index) => (
                                        <tr key={item.id} className="text-center">
                                            <td style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{index + 1}</td>
                                            <td style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{item.name}</td>
                                            <td style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{item.jobTitle}</td>
                                            <td style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{item.coreTechnology}</td>
                                            <td style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>${item.current_ctc || item.currentCtc}</td>
                                            <td style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{item.noOfYearsOfExperience} yrs</td>
                                            <td style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{item.currentLocation}</td>
                                            <td><div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                                <Button variant="primary" size="sm" onClick={() => handleShowModal(item)}>
                                                    Schedule
                                                </Button>
                                                <MdOutlineDeleteForever
                                                    size={23}
                                                    style={{ cursor: "pointer", color: 'red' }}
                                                    onClick={() => {
                                                        setIsDeleteModalOpen(true);
                                                        setUserIdToDelete(item.id);
                                                        setUserNameToDelete(item.name);
                                                    }}
                                                />


                                            </div>

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center text-muted py-3">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </div>
            </Card>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Schedule Interview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="interviewerSelect">
                            <Form.Label>Select Interviewer</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedInterviewer}
                                onChange={handleInterviewerChange}
                            >
                                <option value="">Select Interviewer</option>
                                {interviewers && interviewers.length > 0 ? (
                                    interviewers
                                        .filter(interviewer => interviewer.isEnabled === true)
                                        .map(interviewer => (
                                            <option key={interviewer.id} value={interviewer.id}>
                                                {interviewer.name}
                                            </option>
                                        ))
                                ) : (
                                    <option>No interviewers available</option>
                                )}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="interviewDate">
                            <Form.Label>Date & Time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={interviewDate}
                                onChange={(e) => {
                                    const newDate = e.target.value;
                                    setInterviewDate(newDate);
                                }}
                            />
                        </Form.Group>
                        <Form.Group controlId="interviewRound">
                            <Form.Label>Interview Round Number</Form.Label>
                            <Form.Control
                                type="number"
                                value={interviewRound}
                                onChange={(e) => setInterviewRound(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={isDeleteModalOpen}
                onHide={() => setIsDeleteModalOpen(false)} // Close modal on clicking outside or cancel button
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        Do you really want to delete <strong className="text-danger">{userNameToDelete}</strong>?
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => handleDeleteCandidate(userIdToDelete)}
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
            <ToastContainer />
        </>
    );
}
export default ListofInterview;
