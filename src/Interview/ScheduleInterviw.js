
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import moment from "moment";
import {useParams, useHistory} from "react-router-dom";

function ScheduleInterviw(props) {
    const inter_id  = useParams('pk')
    const [accessToken, setAccessToken] = useState('');
    const [userList, setUserList] = useState('');
    const [loggedInUser, setloggedInUser] = useState('');

    const history = useHistory();

    const [formData, setFormData] = useState({
        Date: new Date(),
        Time: '',
        CustomerName: '',
        CandidateId: '',
        ContactPerson: 'default',
        PhoneNo: '1234567890',
        EmailId: '',
        JobDescription: '',
        InterviewRound: 1,
        Status: '',
        Comments: '',
        MeetingDate: new Date(),
        MeetingTime: '',
        CandidateName: '',
        Resume: '',
        meeting_link:''
    });
    
    useEffect(() => {
        const user = props.account?.name.split('|');
        const user_name = user[0];
        setloggedInUser(user_name);
        fetchAccessToken();
        console.log('sdv', inter_id?.pk);
    }, [])

    useEffect(() => {
        if (inter_id?.pk) {
            axios.get(`https://interviewschedulerapi.azurewebsites.net/schedulerAPI/interviews/${inter_id?.pk}/`)
            .then((response) => {
              console.log('567', response);
              const fillData = response.data;
              const dt = new Date(fillData.data_time) || new Date();
              const mdt = new Date(fillData.meeting_date_time) || new Date();
              setFormData(
                {
                    Date: dt,
                    Time: moment(dt).format('HH:mm'),
                    CustomerName: fillData.customer_name,
                    CandidateId: fillData.candidate_id,
                    ContactPerson: fillData.contact_person,
                    PhoneNo: fillData.phone_no,
                    EmailId: fillData.email_id,
                    JobDescription: fillData.description,
                    InterviewRound: fillData.interview_round,
                    Status: fillData.status,
                    Comments: fillData.comments,
                    MeetingDate: mdt,
                    MeetingTime: moment(mdt).format('HH:mm'),
                    CandidateName: fillData.candidate_name,
                    Resume: fillData.resume_file_base64,
                    meeting_link: fillData.meeting_link
                }
              );
            }, (error) => {
              console.log(error);
            });
        }
    }, [inter_id?.pk])

    const fetchAccessToken = async () => {

        try {

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'https://interviewschedulerapi.azurewebsites.net/schedulerAPI/interviews/token/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            };
            axios.request(config)
                .then((response) => {
                    console.log('99999999',response);
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
            url: 'https://graph.microsoft.com/v1.0/users?$select=id,displayName,accountEnabled,userPrincipalName&$count=true&$filter=accountEnabled eq true and endsWith(userPrincipalName,%27@csharptek.com%27)',
            headers: { 
              'Authorization': `Bearer ${tkn}`, 
              'ConsistencyLevel': 'eventual'
            }
          };
           
          axios.request(config)
          .then((response) => {
            setUserList(response.data.value)
          })
          .catch((error) => {
            console.log(error);
          });
    }

    const handleChange = async(e) => {
        const { name, value } = e.target;
        if (name == 'CandidateName') {
            const val = e.target.options[e.target.selectedIndex].value
            const tex = e.target.options[e.target.selectedIndex].text
            await setFormData({ ...formData, ['CandidateName']: val,['CandidateId']: tex });

        } else {
            setFormData({ ...formData, [name]: value });
        }
        console.log('tyse', formData)
    };

    const handleDateChange = (date, name) => {
        setFormData({ ...formData, [name]: date });
    };
    const date_time_func = (date, time) => {
        const date_formated = moment(date).format('YYYY/MM/DD')
        const isoDateTime = moment(`${date_formated} ${time}`,"YYYY-MM-DD HH:mm");
        const date_time_iso = isoDateTime.format('YYYY-MM-DDTHH:mm:ssZ');

        return date_time_iso;
    }

    const updateFunc = (data) => {
        console.log('sd3555',data);

        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `https://interviewschedulerapi.azurewebsites.net/schedulerAPI/interviews/${inter_id?.pk}/`,
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
           
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            alert("Interview Updated!");
            setFormData({Date: new Date(),
                Time: '',
                CustomerName: '',
                CandidateId: '',
                ContactPerson: '',
                PhoneNo: '',
                EmailId: '',
                JobDescription: '',
                InterviewRound: 1,
                Status: '',
                Comments: '',
                MeetingDate: new Date(),
                MeetingTime: '',
                CandidateName: '',
                Resume: ''});
            history.push(`/InterviewList`);
          })
          .catch((error) => {
            console.log(error);
          });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('sd34',formData.Resume);
        let data = JSON.stringify({
            // "data_time":date_time_func(formData.Date, formData.Time),
            "data_time":date_time_func(formData.MeetingDate, formData.MeetingTime),
            "customer_name": formData.CustomerName,
            // "customer_name": 'default',
            // "contact_person": formData.ContactPerson,
            "contact_person": 'default',
            // "phone_no": formData.PhoneNo,
            "phone_no": '1234567890',
            "email_id": formData.EmailId,
            "status": formData.Status,
            "comments": formData.Comments,
            "candidate_name": formData.CandidateName,
            "candidate_id": formData.CandidateId,
            "resume_file_base64": formData.Resume,
            "description": formData.JobDescription,
            "meeting_date_time": date_time_func(formData.MeetingDate, formData.MeetingTime),
            "interview_round": formData.InterviewRound,
            "meeting_link": formData.meeting_link,
            "updatedon": null,
            "createdby": loggedInUser,
            "createdon": null
          });

          if (inter_id?.pk) {
            updateFunc(data)
            return;
          }
           
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://interviewschedulerapi.azurewebsites.net/schedulerAPI/interviews/create/',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
           
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            create_sendChat(formData.CandidateId, date_time_func(formData.MeetingDate, formData.MeetingTime), formData.meeting_link)
            alert("Interview saved!");
            setFormData({Date: new Date(),
                Time: '',
                CustomerName: '',
                CandidateId: '',
                ContactPerson: '',
                PhoneNo: '',
                EmailId: '',
                JobDescription: '',
                InterviewRound: 1,
                Status: '',
                Comments: '',
                MeetingDate: new Date(),
                MeetingTime: '',
                CandidateName: '',
                meeting_link: '',
                Resume: ''});
          })
          .catch((error) => {
            console.log(error);
          });
        // Handle form submission
        console.log(formData);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setFormData({ ...formData, Resume: base64String });
            console.log("Base64 String:", base64String);
            console.log("data String:", formData);
        };
        reader.readAsDataURL(file);
    };

    const create_sendChat = async (can_id, dt, mlink) => {
        let token__ = ''
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'https://interviewschedulerapi.azurewebsites.net/schedulerAPI/interviews/token/',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        };
        await axios.request(config)
          .then((response) => {
            console.log('99999999', response);
            token__ = response.data.tokenData.access_token;
            sendMessage(token__, can_id, dt, mlink)
    
          })
          .catch((error) => {
            console.log(error);
          });
      }
    
      const sendMessage = async (tkn, can_id, dt, mlink) => {
        const accessToken = tkn; // Replace with your actual access token
        const email_can = can_id?.split('||');
        const candidate_email = email_can[1]
            // Calculate start and end time for the event
            const currentDateTime = new Date(dt);
            const startDateTime = new Date(currentDateTime.getTime());
            const endDateTime = new Date(startDateTime.getTime() + 0.5 * 60 * 60 * 1000); // 30 mins duration
    
            const data = {
                subject: "Interview scheduled",
                body: {
                    contentType: "HTML",
                    content: "Interview meeting link: " + mlink
                },
                start: {
                    dateTime: startDateTime.toISOString(), // Convert to ISO string
                    timeZone: "Pacific Standard Time"
                },
                end: {
                    dateTime: endDateTime.toISOString(), // Convert to ISO string
                    timeZone: "Pacific Standard Time"
                },
                location: {
                    displayName: "Csharptek interviews"
                },
                attendees: [
                    {
                        emailAddress: {
                            address: candidate_email.replace(/ /g,''),
                            name: email_can[0]
                        },
                        type: "required"
                    }
                ],
                allowNewTimeProposals: true,
                // transactionId: "7E163156-7762-4BEB-A1C6-729EA81755A7"
            };
            
            const config = {
                method: 'post',
                url: `https://graph.microsoft.com/v1.0//users/${props.account?.oid}/calendar/events`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'outlook.timezone="Pacific Standard Time"'
                },
                data: data
            };
    
            try {
                const res = await axios.request(config);
                console.log('Event created:', res.data);
            } catch (err) {
                console.error('Error creating event:', err);
            }
      };

    return (
        <>
            <Card className="addDepartment">
                <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                    Schedule Interview
                </CardTitle>
                <CardBody>
                    <Form onSubmit={handleSubmit}>
                        {/* <Row>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Date</FormLabel>
                                    <DatePicker
                                        selected={formData.Date}
                                        onChange={(date) => handleDateChange(date, 'Date')}
                                        minDate={new Date()}
                                        className="form-control"
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Time</FormLabel>
                                    <FormControl
                                        id="Time"
                                        name="Time"
                                        type="time"
                                        value={formData.Time}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Customer Name</FormLabel>
                                    <FormControl
                                        id="CustomerName"
                                        name="CustomerName"
                                        placeholder="Enter customer name"
                                        type="text"
                                        maxLength="300"
                                        value={formData.CustomerName}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row> */}
                        <Row>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Customer Name</FormLabel>
                                    <FormControl
                                        id="CustomerName"
                                        name="CustomerName"
                                        placeholder="Enter customer name"
                                        type="text"
                                        maxLength="300"
                                        value={formData.CustomerName}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Meeting Link</FormLabel>
                                    <FormControl
                                        id="meeting_link"
                                        name="meeting_link"
                                        placeholder="Enter customer name"
                                        type="text"
                                        maxLength="300"
                                        value={formData.meeting_link}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            {/* <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Contact Person</FormLabel>
                                    <FormControl
                                        id="ContactPerson"
                                        name="ContactPerson"
                                        placeholder="Enter contact person"
                                        type="text"
                                        maxLength="300"
                                        value={formData.ContactPerson}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col> */}
                            {/* <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Phone No</FormLabel>
                                    <FormControl
                                        id="PhoneNo"
                                        name="PhoneNo"
                                        placeholder="Enter phone number"
                                        type="text"
                                        value={formData.PhoneNo}
                                        onChange={handleChange}
                                        pattern="[0-9+\-\s]+"
                                        required
                                    />
                                </FormGroup>
                            </Col> */}
                        </Row>
                        <Row>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Email Id</FormLabel>
                                    <FormControl
                                        id="EmailId"
                                        name="EmailId"
                                        placeholder="Enter email"
                                        type="email"
                                        value={formData.EmailId}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Job Description</FormLabel>
                                    <FormControl
                                        id="JobDescription"
                                        name="JobDescription"
                                        placeholder="Enter job description"
                                        as="textarea"
                                        rows={3}
                                        value={formData.JobDescription}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Resume</FormLabel>
                                    <FormControl
                                        id="Resume"
                                        name="Resume"
                                        type="file"
                                        accept=".doc,.docx,.pdf,.xlsx,.jpg,.png"
                                        onChange={handleFileChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl
                                        id="Status"
                                        name="Status"
                                        as="select"
                                        value={formData.Status}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Rescheduled">Rescheduled</option>
                                    </FormControl>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Comments</FormLabel>
                                    <FormControl
                                        id="Comments"
                                        name="Comments"
                                        placeholder="Enter comments"
                                        type="text"
                                        value={formData.Comments}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Meeting Date</FormLabel>
                                    <DatePicker
                                        selected={formData.MeetingDate}
                                        onChange={(date) => handleDateChange(date, 'MeetingDate')}
                                        minDate={new Date()}
                                        className="form-control"
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Meeting Time</FormLabel>
                                    <FormControl
                                        id="MeetingTime"
                                        name="MeetingTime"
                                        type="time"
                                        value={formData.MeetingTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Candidate Name</FormLabel>
                                    <FormControl
                                        id="CandidateName"
                                        name="CandidateName"
                                        as="select"
                                        value={formData.CandidateName}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="0" key={'Select Candidate'}>Select Candidate</option>
                                        {(userList || []).map((ul) =>(
                                            <option value={ul.id} key={ul.id}>{ul.displayName + ' || ' + ul.userPrincipalName}</option>
                                            ))
                                        }
                                    </FormControl>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Interview Round</FormLabel>
                                    <FormControl
                                        id="InterviewRound"
                                        name="InterviewRound"
                                        placeholder="Enter interview round"
                                        type="number"
                                        min="1"
                                        value={formData.InterviewRound}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Button type="submit" className="mt-2">
                            Submit
                        </Button>
                    </Form>
                </CardBody>
            </Card>
        </>
    );
}

export default ScheduleInterviw;