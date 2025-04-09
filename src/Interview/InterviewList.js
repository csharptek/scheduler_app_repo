import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl, Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import { projectApiList } from '../config/config';
import { MdOutlineDeleteForever } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid";
import { propTypes } from 'react-bootstrap/esm/Image';

function ListofInterview(props) {
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [del_id, setdel_id] = useState(0);
    const [loggedInUser, setloggedInUser] = useState('');
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [interviewDate, setInterviewDate] = useState('');
    const [interviewsetdata, setInterviewSetData] = useState('');
    const [interviewRound, setInterviewRound] = useState('');
    const [inviteLink, setInviteLink] = useState('');
    const [gettoken, setGettoken] = useState('');
    const [interviewDetails, setInterviewDetails] = useState(null);
    const [interviewers, setInterviewers] = useState([]);
    const [selectedInterviewer, setSelectedInterviewer] = useState('');
    const [userList, setUserList] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchJobTitle, setSearchJobTitle] = useState('');
    const [searchTechnology, setSearchTechnology] = useState('');
    const [searchRecruiter, setSearchRecruiter] = useState('');
    const [selectedEmail, setSelectedEmail] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [useridToDelete, setUseridToDelete] = useState('');
    const [userNameToDelete, setUserNameToDelete] = useState('');
    const [externalcandidateid, setExternalCandidateid] = useState('');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [interviewType, setInterviewType] = useState('internal');
    const filteredData = data?.filter((item) => {
        return (
            (searchName === '' || item.name.toLowerCase().includes(searchName.toLowerCase())) &&
            (searchJobTitle === '' || (item.job_title || item.jobTitle).toLowerCase().includes(searchJobTitle.toLowerCase())) &&
            (searchTechnology === '' || (item.core_technology || item.core_technology).toLowerCase().includes(searchTechnology.toLowerCase())) &&
            (searchRecruiter === '' || item.recruiter?.toLowerCase().includes(searchRecruiter.toLowerCase()))
        );
    });
    const handleShowDetailsModal = (candidate) => {
        console.log("datattata", candidate);
     
        setSelectedCandidate(candidate);
        setShowDetailsModal(true);
    };
    const fetchInterviewData = () => {
        if ((props.account.roles[0] === "Admin") || props.account.roles === "Admin") {
            if (interviewType !== 'internal' && interviewType !== 'external') {
                console.warn("Invalid interviewType:", interviewType);
                setLoading(false);
                return; // Do nothing if interviewType is invalid
            }

            setLoading(true);
            console.log("gjhinterviewType", interviewType);

            const apiUrl = interviewType === 'internal'
                ? projectApiList.ScheduleInterviewList  // Internal interviews
                : projectApiList.ExternalInterviewList; // External interviews

            axios.get(apiUrl)
                .then((response) => {
                    setData(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching interviews:", error);
                    setLoading(false);
                });
        }
        setLoading(false);
    }
    console.log("propppps", props.account.roles[0])
    const interviewDates = new Date(interviewDate);
    const formattedDate = interviewDates.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
    useEffect(() => {
        const user = props.account?.name.split('|');
        const user_name = user[0];
        setloggedInUser(user_name);
        tokenGet();



        // Fetch the correct interview data
        fetchInterviewData();


        // Fetch interviewers (only once)
        axios.get(projectApiList.getUsers)
            .then((response) => {
                setInterviewers(response.data);
                console.log('koko', response.data)
            })
            .catch((error) => {
                console.error("Error fetching interviewers:", error);
            });
    }, [interviewType])
    const handleInterviewerChange = (e) => {
        const interviewerid = e.target.value;
        setSelectedInterviewer(interviewerid);
        const selectedInterviewerObj = interviewers.find(interviewer => interviewer.Id === parseInt(interviewerid));
        if (selectedInterviewerObj) {
            setSelectedEmail(selectedInterviewerObj.EmailId);
            setSelectedName(selectedInterviewerObj.Name)
        }
    };
    const handleShowModal = (item) => {
        setExternalCandidateid(item.row.Id)
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
                        <li><strong>Candidate Name:</strong> ${interviewDetails.row.Name}</li>
                        <li><strong>Job Title:</strong> ${interviewDetails.row.JobTitle}</li>
                        <li><strong>Interview Round:</strong> ${interviewRound}</li>
                        <li><strong>Date:</strong> ${formattedDate}</li>
                        <li><strong>Experience:</strong> ${interviewDetails.row.NoOfYearsOfExperience} years</li>
                       <li>
                             <strong>Resume:</strong>  
                             <a href="${interviewDetails.row.Resume}" download style="text-decoration: none;">
                                <button style="background-color: #4CAF50; color: white; padding: 5px 10px; font-size: 12px; border: none; border-radius: 5px; cursor: pointer;">
                             Download Resume
                            </button>
                            </a>
                        </li>
                    </ul>
                    <p>Best regards,</p>
                    <p>Csharptek</p>`
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
            url: `https://graph.microsoft.com/v1.0/users/${props.account?.oid}/calendar/events`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Prefer': 'outlook.timezone="Pacific Standard Time"'
            },
            data: data
        };
        try {
            const isInternal = interviewType === 'internal';
            const res = await axios.request(config);
            const teamsLink = res.data.onlineMeeting.joinUrl;
            setInviteLink(teamsLink);
            console.log("gasdfhjkhasdf", interviewsetdata)
            const interviewschedule = {
                Meetinglink: teamsLink,
                Interviewdatetime: interviewsetdata.date,
                InterviewerId: interviewsetdata.interviewer,
                ...(isInternal
                    ? { InternalCandidateId: interviewsetdata.interviewid }
                    : { ExternalCandidateId: externalcandidateid }),
            };
            console.log("Savedsdfsdffgfg:", interviewschedule);
            try {
                const response = await axios.post(projectApiList.InterviewSchedule,
                    interviewschedule,
                    {
                        headers: {
                            Authorization: `Bearer ${gettoken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log("Saved interview data:", response.data);
            } catch (error) {
                console.error("Error saving interview data:", error);
            }
        } catch (err) {
            console.error('Error creating event:', err);
        }
    };
    const handleDeleteCandidate = (id) => {
        axios
            .delete(projectApiList.DeleteCandidate(id))
            .then(() => {
                setIsDeleteModalOpen(false)
                axios
                    .get(projectApiList.ScheduleInterviewList)
                    .then((response) => {
                        setData(response.data);
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
            url: `https://graph#######################################com')`,
            headers: {
                'Authorization': `Bearer ${tkn}`,
                'ConsistencyLevel': 'eventual'
            }
        };
        axios.request(config)
            .then((response) => {
                setUserList(response.data.value);
                sendMessage(tkn, selectedName && selectedEmail ? `${selectedName}||${selectedEmail}` : "", interviewDate);
                console.log("can_id", interviewDate)
                setShowModal(false);
                toast.success('Interview Scheduled successfully!', {
                    autoClose: 3000,
                });
                console.log("getUserList api called :", response.data.value)
            })
            .catch((error) => {
                setShowModal(false);
                toast.error('Interview Not Scheduled', {
                    autoClose: 3000,
                });
            });
    }
    // console.log("propssssss",props)
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
    const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    });
    const getToken = async () => {
        const url = 'https://login.microsoftonline.com/######################################/oauth2/v2.0/token';
        const body = new URLSearchParams({
            client_id: '######################################',
            client_secret: '######################################',
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
            interviewid: interviewDetails.id,
            candidateDetails: {
                name: interviewDetails.name,
                phone_number: interviewDetails.phone_number,
                yearsOfExperience: interviewDetails.noOfYearsOfExperience,
                jobTitle: interviewDetails.job_title,
                resume: interviewDetails.resume
            }
        };
        console.log("interviewdata", interviewData)
        setInterviewSetData(interviewData)
        setSelectedInterviewer("")
        setInterviewDate("")
        setInterviewRound("")
        getUserList(gettoken);
    };
    const columns = [
        {
            field: "serialNumber", headerName: "S.No", minWidth: 50, flex: 0.5, renderCell: (params) => params.api.getRowModels().size > 0
                ? [...params.api.getRowModels().keys()].indexOf(params.id) + 1
                : "",
        },
        { field: "Name", headerName: "Candidate Name", minWidth: 150, flex: 1 },
        { field: "PhoneNumber", headerName: "Phone Number", minWidth: 120, flex: 1 },
        { field: "EmailId", headerName: "Email id", minWidth: 165, flex: 1 },
        { field: "CurrentCtc", headerName: "Current CTC", minWidth: 100, flex: 0.8 },
        { field: "ExternalRecruiterName", headerName: "Recruiter Name", minWidth: 100, flex: 0.8 },
        { field: "ExpectedCtc", headerName: "Expected CTC", minWidth: 100, flex: 0.8 },
        { field: "CoreTechnology", headerName: "Core Technology", minWidth: 140, flex: 1 },
        { field: "JobTitle", headerName: "Job Title", minWidth: 130, flex: 1 },
        {
            field: "Resume",
            headerName: "Resume",
            minWidth: 100,
            flex: 1,
            renderCell: (params) => (
                params.value ? (
                    <a
                        href={params.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        style={{
                            padding: "5px 10px",
                            backgroundColor: "#1976d2",
                            color: "white",
                            textDecoration: "none",
                            borderRadius: "5px",
                            fontSize: "12px",
                            textAlign: "center",
                            whiteSpace: "nowrap"
                        }}
                    >
                        Download
                    </a>
                ) : (
                    <span style={{ color: "gray" }}>No Resume</span>
                )
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 210,
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <div style={{ display: "flex", gap: "10px" }}>
                   {(props.account.Roles==="Admin"||props.account.roles?.[0] === 'Admin')&& (
                    <Button
                        style={{
                            padding: "5px 10px",
                            backgroundColor: "green",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            marginTop: '10px'
                        }}
                        onClick={() => handleShowModal(params)}
                    >
                        Schedule
                    </Button>
        )}
                    <Button
                        style={{
                            padding: "5px 10px",
                            backgroundColor: "#1976d2",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            marginTop: '10px'
                        }}
                        onClick={() => handleShowDetailsModal(params.row)}
                    >
                        Details
                    </Button>
                    {(props.account.Roles==="Admin"||props.account.roles?.[0] === 'Admin')&& (
                    <MdOutlineDeleteForever
                        size={23}
                        style={{ cursor: "pointer", color: "red", marginTop: '10px' }}
                        onClick={() => {
                            setIsDeleteModalOpen(true);
                            setUseridToDelete(params.row.id);
                            setUserNameToDelete(params.row.name);
                        }}
                    />
                    )}
                </div>
            ),
        },

    ];
    const isFormValid = selectedInterviewer && interviewDate && interviewRound;
    const modalStyleTitle = { fontFamily: `"IBM Plex Sans", sans-serif  !important`, fontWeight: 400 };
    const modalStyle = { fontFamily: `"IBM Plex Sans", sans-serif !important`, };



    console.log("dataaaaa --- ", data);
    // console.log("Get Users List:",getUserList);
    const handleInternalInterviewsClick = () => setInterviewType('internal');
    const handleExternalInterviewsClick = () => setInterviewType('external');

    useEffect(() => {
        if (
            props?.account?.roles?.[0] === 'ExternalRecruiter' ||
            props?.account?.roles === 'ExternalRecruiter'
        ) {
            console.log('hj');
            const eId=props.account.oid;
            // console.log("EIDDDDDDDD",eId)
            axios
                .get(projectApiList.ExternalCandidateList(eId))
                .then((response) => {
                    setData(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching interviews:", error);
                    setLoading(false);
                });
        }
    }, [props?.account]);

    
    
    return (
        <>
            {(props.account.roles?.[0] === 'Admin' || props.account.roles === 'Admin') && (
                <div style={{ marginBottom: '20px' }}>
                    <button
                        className={`btn ${interviewType === 'internal' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={handleInternalInterviewsClick}
                        style={{ marginRight: '10px' }}
                    >
                        Internal Interviews
                    </button>
                    <button
                        className={`btn ${interviewType === 'external' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={handleExternalInterviewsClick}
                    >
                        External Interviews
                    </button>
                </div>
            )}

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    marginTop: "20px",
                }}
            >
                <div
                    style={{
                        height: "auto",
                        width: "98%",
                        backgroundColor: "white",
                        padding: "10px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                >
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p>Loading data...</p>
                        </div>
                    ) : (
                        <DataGrid
                            rows={data}
                            columns={columns}
                            pageSize={10}
                            getRowId={(row) => row.Id}
                            autoHeight
                            disableSelectionOnClick
                            sx={{
                                "& .MuidataGrid-root": {
                                    border: "1px solid rgba(224, 224, 224, 1)",
                                    fontFamily: '"IBM Plex Sans", sans-serif !important',
                                },
                                "& .MuidataGrid-columnHeaders": {
                                    backgroundColor: "#f5f5f5",
                                    color: '#023020',
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    borderBottom: "2px solid rgba(224, 224, 224, 1)",
                                },
                                "& .MuidataGrid-columnHeaderTitle": {
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    width: "100%",
                                },
                                "& .MuidataGrid-cell": {
                                    borderRight: "1px solid rgba(224, 224, 224, 1)",
                                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                                    fontSize: "13px",
                                    textAlign: "center",
                                },
                                "& .MuidataGrid-row": {
                                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                                    "&:hover": {
                                        backgroundColor: "#f9f9f9",
                                    },
                                },
                                "& .MuidataGrid-virtualScroller": {
                                    overflowX: "auto",
                                },
                                "& .MuidataGrid-footerContainer": {
                                    borderTop: "2px solid rgba(224, 224, 224, 1)",
                                },
                            }}
                        />
                    )}
                </div>
            </div>
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered size="xl" style={{ marginTop: "-50px" }}>
                <Modal.Header closeButton>
                    <Modal.Title>Candidate Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCandidate && (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "4px",
                            padding: "10px",
                            backgroundColor: "#f9f9f9",
                            borderRadius: "8px"
                        }}>
                            {[
                                ["Name", selectedCandidate.Name],
                                ["Phone Number", selectedCandidate.PhoneNumber],
                                ["Email id", selectedCandidate.EmailId],
                                ["Current Location", selectedCandidate.CurrentLocation],
                                ["Home Location", selectedCandidate.HomeLocation],
                                ["Willing to Relocate", selectedCandidate.WillingToRelocateToRanchi ? "Yes" : "No"],
                                ["Preferred Work Location", selectedCandidate.WillingToWorkFromWhichLocation],
                                ["Current CTC", selectedCandidate.CurrentCtc ? formatter.format(selectedCandidate.current_ctc) : "N/A"],
                                ["Expected CTC", selectedCandidate.ExpectedCtc ? formatter.format(selectedCandidate.expected_ctc) : "N/A"],
                                ["Notice Period", selectedCandidate.NoticePeriod],
                                ["Negotiable", selectedCandidate.NoticePeriodNegotiable ? "Yes" : "No"],
                                ["Experience", `${selectedCandidate.NoOfYearsOfExperience} years`],
                                ["Last Working Date / Presently Working", selectedCandidate.LastWorkingDateOrPresentlyWorking],
                                ["Core Technology", selectedCandidate.CoreTechnology],
                                ["Job Title", selectedCandidate.JobTitle],
                                ["Interview Round", selectedCandidate.InterviewRound],
                            ].map(([label, value], index) => (
                                <div key={index} style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    backgroundColor: "#fff",
                                    padding: "10px",
                                    borderRadius: "6px",
                                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)"
                                }}>
                                    <strong style={{ color: "#007BFF", fontSize: "14px", marginBottom: "5px" }}>{label}:</strong>
                                    <span style={{ color: "#333", fontSize: "14px" }}>{value || "N/A"}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Modal.Body>
            </Modal>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton style={modalStyleTitle}>
                    <Modal.Title>Schedule Interview</Modal.Title>
                </Modal.Header>
                <Modal.Body style={modalStyle}>
                    <Form>
                        <Form.Group controlid="interviewerSelect" style={modalStyle}>
                            <Form.Label style={modalStyle}>Select Interviewer</Form.Label>
                            <Form.Control
                                as="select"
                                style={modalStyle}
                                value={selectedInterviewer}
                                onChange={handleInterviewerChange}
                            >
                                <option value="" style={modalStyle}>Select Interviewer</option>
                                {interviewers && interviewers.length > 0 ? (
                                    interviewers
                                        .filter(interviewer => interviewer.IsEnabled === true || interviewer.Roles == "interviewer")
                                        .map(interviewer => (
                                            <option key={interviewer.Id} value={interviewer.Id}>
                                                {interviewer.Name}
                                            </option>
                                        ))
                                ) : (
                                    <option>No interviewers available</option>
                                )}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlid="interviewDate">
                            <Form.Label style={modalStyle}>Date & Time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={interviewDate}
                                style={modalStyle}
                                onChange={(e) => {
                                    const newDate = e.target.value;
                                    setInterviewDate(newDate);
                                }}
                            />
                        </Form.Group>
                        <Form.Group controlid="interviewRound">
                            <Form.Label style={modalStyle}>Interview Round Number</Form.Label>
                            <Form.Control
                                style={modalStyle}
                                type="number"
                                value={interviewRound}
                                onChange={(e) => setInterviewRound(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={modalStyle}>
                    <Button variant="secondary" onClick={handleCloseModal} style={modalStyle}>
                        Close
                    </Button>
                    <Button style={{ fontFamily: `"IBM Plex Sans", sans-serif !important`, color: 'whilte', backgroundColor: isFormValid ? 'green' : 'grey', borderColor: isFormValid ? 'green' : 'grey', cursor: isFormValid ? 'pointer' : 'not-allowed', }} onClick={handleSubmit} disabled={!isFormValid}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={isDeleteModalOpen}
                onHide={() => setIsDeleteModalOpen(false)}
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
                        onClick={() => handleDeleteCandidate(useridToDelete)}
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

