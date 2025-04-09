import { React, useState, useEffect } from "react";
import {
    Col,
    Row,
    Card,
    CardBody,
    Form,
    FormGroup,
    FormControl,
    Button,
    FormLabel,
    FormCheck,
    Container,

} from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { TbBorderRadius } from "react-icons/tb";
import { RxBorderWidth } from "react-icons/rx";
import "../App.css"
import { toast, ToastContainer } from 'react-toastify';
import { Input, Textarea } from "@mui/material";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css"; // Example of another theme
import { projectApiList } from "../config/config";

const card = {
    backgroundColor: 'white',
    fontSize: '15px',
    padding: '3px 8px',
    width: '80vw',
    height: `70vh`,
    marginTop: '2%'
    

};
const main = {
    // backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',

};
function Interview() {
    const [accessToken, setAccessToken] = useState('');
    const [userList, setUserList] = useState('');

    useEffect(() => {
        fetchAccessToken();
    }, []);

    const fetchAccessToken = async () => {
        try {
            const qs = require('qs');
            let data = qs.stringify({
                'grant_type': 'client_credentials',
                'client_id': '####################################',
                'client_secret': '####################################',
                'resource': 'https://graph.microsoft.com'
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://login.microsoftonline.com/####################################/oauth2/token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': 'fpc=####################################; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd'
                },
                data: data
            };
            axios.request(config)
                .then((response) => {
                    setAccessToken(response.data.access_token)
                    getUserList()
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.error('Error fetching the access token:', error);
        }
    };

    const getUserList = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://graph.microsoft.com/v1.0/users',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        };

        axios.request(config)
            .then((response) => {
                setUserList(response.data.value)
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const [formData, setFormData] = useState({
        Name: '',
        PhoneNumber: '',
        CurrentLocation: '',
        HomeLocation: '',
        WillingtoRelocatetoRanchi: '',
        WillingtoWorkfromWhichLocation: '',
        CurrentCTC: '',
        ExpectedCTC: '',
        NoticePeriod: '',
        NoticePeriodNegotiable: '',
        NoofYearsofExperience: '',
        LastWorkingDateorPresentlyWorking: '',
        CoreTechnology: '',
        JobTitle: '',
        InterviewRound: 1,
        Resume: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleDateChange = (date, name) => {
        console.log('datename',date,'popopo',name)
        setFormData({ ...formData, [name]: date });
    };

    const handleSubmit = (e) => {

        e.preventDefault();
        setFormData({
            Name: '',
            PhoneNumber: '',
            CurrentLocation: '',
            HomeLocation: '',
            WillingtoRelocatetoRanchi: '',
            WillingtoWorkfromWhichLocation: '',
            CurrentCTC: '',
            ExpectedCTC: '',
            NoticePeriod: '',
            NoticePeriodNegotiable: '',
            NoofYearsofExperience: '',
            LastWorkingDateorPresentlyWorking: '',
            CoreTechnology: '',
            JobTitle: '',
            InterviewRound: '',
            Resume: ''
        })

        const formattedLastWorkingDate = formData.LastWorkingDateorPresentlyWorking
    ? new Date(formData.LastWorkingDateorPresentlyWorking).toISOString()  // Ensures UTC format
    : '';
      
        const formDataToSend = {
            name: formData.Name,
            PhoneNumber: formData.PhoneNumber,
            CurrentLocation: formData.CurrentLocation,
            HomeLocation: formData.HomeLocation,
            willingToRelocateToRanchi: formData.WillingtoRelocatetoRanchi === 'Yes',
            willingToWorkFromWhichLocation: formData.WillingtoWorkfromWhichLocation,
            currentCtc: parseFloat(formData.CurrentCTC),
            expectedCtc: parseFloat(formData.ExpectedCTC),
            noticePeriod: formData.NoticePeriod,
            NoticePeriodNegotiable: formData.NoticePeriodNegotiable,
            noOfYearsOfExperience: parseFloat(formData.NoofYearsofExperience),
            lastWorkingDateOrPresentlyWorking: formattedLastWorkingDate,
            coreTechnology: formData.CoreTechnology,
            jobTitle: formData.JobTitle,
            interviewRound: String(formData.InterviewRound),
        };
        console.log('love',formDataToSend)
            fetch(projectApiList.createInterview, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataToSend),
        })
            .then(response => response.json())
            .then(data => {
                toast.success('Candidate Details Added successfully!', {
                    autoClose: 3000,
                });
            })
            .catch(error => {
                toast.error('Candidate Details Unsuccessfully added!', {
                    autoClose: 3000,
                });
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .custom-input {
                border: 1px solid #ced4da;
                padding: 0.375rem 0.75rem;
                border-radius: 4px;
                transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                font-size: 0.875rem;
                font-family: "IBM Plex Sans", sans-serif;
                font-weight: 400;
            }

            .custom-input:focus {
                border-color: #80bdff !important;
                box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
                outline: none;
            }

            .custom-input::placeholder {
                color: #495057 !important;
                opacity: 0.7 !important;
                font-size: 0.875rem;
                font-family: "IBM Plex Sans", sans-serif;
                font-weight: 400;
            }
            .custom-radio{
            font-size: 0.875rem;
            font-family: "IBM Plex Sans", sans-serif;
            font-weight: 400;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);


    return (
        <div style={main}>
            <Card style={card}>
                {/* <Card style= {{marginTop:'2%'}}> */}
                <CardBody  >
                    <Form onSubmit={handleSubmit} >
                        <div style={{ display: "flex", height: "65vh", width: '60vw', justifyContent: "space-between", width: "100%",  }}>
                            <Col style={{ display: "flex", height: "100%", flexDirection: "column", justifyContent: "space-evenly", width: "48%",  }}>
                                <Row>
                                    <FormGroup>
                                        <FormControl
                                            id="Name"
                                            name="Name"
                                            placeholder="Enter Name"
                                            type="text"
                                            value={formData.Name}
                                            onChange={handleChange}
                                            required
                                            className="form-control-md custom-input"
                                        />
                                    </FormGroup>

                                </Row>
                                <Row>
                                    <FormGroup>
                                        <FormControl
                                            id="PhoneNumber"
                                            name="PhoneNumber"
                                            placeholder="Phone Number"
                                            type="text"
                                            maxLength='10'
                                            value={formData.PhoneNumber}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d{0,10}$/.test(value)) {
                                                    handleChange(e);
                                                }
                                            }}
                                            required
                                            className="form-control-md custom-input"
                                        />
                                    </FormGroup>
                                </Row>
                                <Row>
                                    <FormGroup>
                                        <FormControl
                                            id="CurrentLocation"
                                            name="CurrentLocation"
                                            placeholder="Enter Current Location"
                                            type="text"
                                            maxLength="300"
                                            value={formData.CurrentLocation}
                                            onChange={handleChange}
                                            required
                                            className="form-control-md custom-input"
                                        />
                                    </FormGroup>
                                </Row>
                                <Row>
                                    <FormGroup>
                                        <FormControl
                                            id="HomeLocation"
                                            name="HomeLocation"
                                            placeholder="Enter Home Location"
                                            type="text"
                                            maxLength="300"
                                            value={formData.HomeLocation}
                                            onChange={handleChange}
                                            required
                                            className="form-control-md custom-input"
                                        />
                                    </FormGroup>
                                </Row>
                                <Row>
                                    <FormGroup>
                                        <FormLabel className="form-control-md custom-radio" >Willing to Relocate to Ranchi</FormLabel>
                                        <div>
                                            <FormCheck
                                                type="radio"
                                                id="WillingtoRelocatetoRanchiYes"
                                                name="WillingtoRelocatetoRanchi"
                                                value="Yes"
                                                label="Yes"
                                                checked={formData.WillingtoRelocatetoRanchi === 'Yes'}
                                                onChange={handleChange}
                                                inline
                                                required
                                                className="form-control-md custom-input"

                                            />
                                            <FormCheck
                                                type="radio"
                                                id="WillingtoRelocatetoRanchiNo"
                                                name="WillingtoRelocatetoRanchi"
                                                value="No"
                                                label="No"
                                                checked={formData.WillingtoRelocatetoRanchi === 'No'}
                                                onChange={handleChange}
                                                inline
                                                required
                                                className="form-control-md custom-input"
                                            />
                                        </div>
                                    </FormGroup>
                                </Row>
                                <Row>
                                    <FormGroup>
                                        <FormControl
                                            id="WillingtoWorkfromWhichLocation"
                                            name="WillingtoWorkfromWhichLocation"
                                            placeholder="Willing to Work from Which Location"
                                            type="text"
                                            value={formData.WillingtoWorkfromWhichLocation}
                                            onChange={handleChange}
                                            required
                                            className="form-control-md custom-input"
                                        />
                                    </FormGroup>
                                </Row>
                                <Row> <FormGroup>
                                    <FormControl
                                        id="CurrentCTC"
                                        name="CurrentCTC"
                                        placeholder="Current CTC (In Lakhs)"
                                        type="text"
                                        value={formData.CurrentCTC}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*\.?\d*$/.test(value)) {
                                                handleChange(e);
                                            }
                                        }}
                                        required
                                        className="form-control-md custom-input"
                                    />
                                </FormGroup></Row>
                                <Row>
                                    <FormGroup>
                                        <FormControl
                                            id="ExpectedCTC"
                                            name="ExpectedCTC"
                                            placeholder="Expected CTC (In Lakhs)"
                                            type="text"
                                            value={formData.ExpectedCTC}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d*\.?\d*$/.test(value)) {
                                                    handleChange(e);
                                                }
                                            }}
                                            required
                                            className="form-control-md custom-input"
                                        />
                                    </FormGroup>
                                </Row>
                            </Col>

                            <Col style={{ display: "flex", height: "100%", marginLeft: '20px', flexDirection: "column", justifyContent: "space-evenly", width: "48%" }}>
                                <Row style={{}}>
                                    <FormGroup>
                                        <FormControl
                                            id="NoticePeriod"
                                            name="NoticePeriod"
                                            placeholder="Notice Period(In Days)"
                                            type="text"
                                            value={formData.NoticePeriod}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d*\.?\d*$/.test(value)) {
                                                    handleChange(e);
                                                }
                                            }}
                                            required
                                            className="form-control-md custom-input"
                                        />
                                    </FormGroup>
                                </Row>
                                <Row>
                                    <FormGroup>
                                        <FormControl
                                            id="NoticePeriodNegotiable"
                                            name="NoticePeriodNegotiable"
                                            placeholder="Notice Period Negotiable"
                                            type="text"
                                            value={formData.NoticePeriodNegotiable}
                                            onChange={handleChange}
                                            maxLength='200'
                                            required
                                            className="form-control-md custom-input"
                                        />
                                    </FormGroup>
                                </Row>
                                <Row>
                                    <FormGroup>
                                        <FormControl
                                            id="NoofYearsofExperience"
                                            name="NoofYearsofExperience"
                                            placeholder="Enter No. of Years of Experience(In years)"
                                            type="text"
                                            value={formData.NoofYearsofExperience}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d*\.?\d*$/.test(value)) {
                                                    handleChange(e);
                                                }
                                            }}
                                            required
                                            className="form-control-md custom-input"
                                        />
                                    </FormGroup>
                                </Row>
                                <Row>
                                    <FormGroup >

                                        <Flatpickr
                                            id="LastWorkingDateorPresentlyWorking"
                                            placeholder="Last Working Date"
                                            value={formData.LastWorkingDateorPresentlyWorking}
                                            onChange={([date]) => handleDateChange(date, "LastWorkingDateorPresentlyWorking")}
                                            options={{
                                                dateFormat: "d-m-Y", // Format as YYYY-MM-DD
                                                enableTime: false, // Disable time selection
                                            }}
                                            className="form-control-md custom-input"
                                        />
                                    </FormGroup>
                                </Row>
                                <Row>
                                    <FormGroup>
                                        <FormControl
                                            id="CoreTechnology"
                                            name="CoreTechnology"
                                            placeholder="Core Technology"
                                            type="text"
                                            value={formData.CoreTechnology}
                                            onChange={handleChange}
                                            maxLength='200'
                                            required
                                            className="form-control-md custom-input"
                                        />
                                    </FormGroup>
                                </Row>
                                <Row>
                                    <FormGroup>
                                        <FormControl
                                            id="JobTitle"
                                            name="JobTitle"
                                            placeholder="Job Title"
                                            as="select"
                                            value={formData.JobTitle}
                                            onChange={handleChange}
                                            required
                                            className="form-control-md custom-input"
                                        >
                                            <option value="">Select Job Title</option>
                                            <option value=".Net">.Net</option>
                                            <option value="React js">React js</option>
                                            <option value="Java">Java</option>
                                            <option value="Python">Python</option>
                                            <option value="Angular">Angular</option>
                                        </FormControl>
                                    </FormGroup>
                                </Row>
                                <Row>
                                    <FormGroup>
                                        <FormControl
                                            id="InterviewRound"
                                            name="InterviewRound"
                                            placeholder="Enter interview round"
                                            type="text"
                                            min="1"
                                            value={formData.InterviewRound}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d{0,9}$/.test(value)) {
                                                    handleChange(e);
                                                }
                                            }}
                                            required
                                            maxLength='1'
                                            className="form-control-md custom-input"
                                        />
                                    </FormGroup>
                                </Row>
                               
                                <ToastContainer />
                            </Col>
                        </div>
                       
                    </Form>
                </CardBody>
                <Row style={{
                    width: "20vw",
                    fontSize: "1.2rem",
                    marginTop: '20px'
                }}>
                    <Button type='button' onClick={() => document.querySelector('form').requestSubmit()}
                        style={{
                           
                            background: "linear-gradient(45deg, #1e3c72, #2a5298)", // Gradient background
                            border: "none",
                            color: "white",
                            fontWeight: "bold",
                            transition: "all 0.3s ease-in-out", // Smooth transition for hover effect
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = "linear-gradient(45deg, #2a5298, #1e3c72)"; // Reverse gradient on hover
                            e.target.style.transform = "scale(1.05)"; // Slightly increase button size on hover
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "linear-gradient(45deg, #1e3c72, #2a5298)"; // Reset gradient on hover out
                            e.target.style.transform = "scale(1)"; // Reset size
                        }}
                    >
                        Save and schedule the interview
                    </Button>

                </Row>
            </Card>
        </div >

    );
}

export default Interview;