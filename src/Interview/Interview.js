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
import "flatpickr/dist/themes/material_blue.css";
import { projectApiList } from "../config/config";
import Select from "react-select";
import technologyOptions from "./Technology";

const card = {
    backgroundColor: 'white',
    fontSize: '15px',
    padding: '3px 8px',
    width: '80vw',
    height: `70vh`,
    marginTop: '2%'
};
const main = {
    display: 'flex',
    justifyContent: 'center',
};
function Interview() {
    const [accessToken, setAccessToken] = useState('');
    const [userList, setUserList] = useState('');
    const [selectedTechnologies, setSelectedTechnologies] = useState([]);
    const [fileName, setFileName] = useState("Choose a pdf or docx or doc file only");


    useEffect(() => {
        fetchAccessToken();
    }, []);
    const fetchAccessToken = async () => {
        try {
            const qs = require('qs');
            let data = qs.stringify({
                'grant_type': 'client_credentials',
                'client_id': '######################################',
                'client_secret': '######################################',
                'resource': 'https://graph.microsoft.com'
            });
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://login.microsoftonline.com/######################################/oauth2/token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': 'fpc=######################################; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd'
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
        CoreTechnology: [],
        JobTitle: '',
        InterviewRound: 1,
        resume: '',
        EmailId: ''
    });
    const [errors, setErrors] = useState({
        EmailId: ''
    });
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'EmailId') {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            setErrors((prevErrors) => ({
                ...prevErrors,
                EmailId: emailPattern.test(value) ? '' : 'Please enter a valid email address.',
            }));
        }
        if (name === 'resume') {
            const file = files[0];
            if (file) {
                const fileExtension = file.name.split('.').pop().toLowerCase();
                if (!['pdf', 'doc', 'docx'].includes(fileExtension)) {
                    alert('Only PDF, DOC, and DOCX files are allowed.');
                    e.target.value = ''; // Clear the file input
                    setFileName("Choose Resume");
                    return;
                }
                setFileName(file.name ? file.name :'');
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    resume: file, 
                }));
            }
        }
        else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };
    const handleDateChange = (date, name) => {
        setFormData({ ...formData, [name]: date });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedLastWorkingDate = formData.LastWorkingDateorPresentlyWorking
            ? new Date(formData.LastWorkingDateorPresentlyWorking).toISOString().split("T")[0]
            : '';
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.Name);
        formDataToSend.append("PhoneNumber", formData.PhoneNumber);
        formDataToSend.append("CurrentLocation", formData.CurrentLocation);
        formDataToSend.append("HomeLocation", formData.HomeLocation);
        formDataToSend.append("willing_to_relocate_to_ranchi", formData.WillingtoRelocatetoRanchi === 'Yes');
        formDataToSend.append("willing_to_work_from_which_location", formData.WillingtoWorkfromWhichLocation);
        formDataToSend.append("current_ctc", formData.CurrentCTC.replace(/,/g, "")); 
        formDataToSend.append("expected_ctc", formData.ExpectedCTC.replace(/,/g, "")); 
        formDataToSend.append("notice_period", formData.NoticePeriod);
        formDataToSend.append("NoticePeriodNegotiable", formData.NoticePeriodNegotiable);
        formDataToSend.append("no_of_years_of_experience", formData.NoofYearsofExperience);
        formDataToSend.append("last_working_date_or_presently_working", formattedLastWorkingDate);
        formDataToSend.append("core_technology", formData.CoreTechnology.map(option => option.value).join(','));
        formDataToSend.append("job_title", formData.JobTitle);
        formDataToSend.append("email_id", formData.EmailId);
        formDataToSend.append("interview_round", formData.InterviewRound);
        if (formData.resume) {
            formDataToSend.append("resume", formData.resume);
        }
        try {
            const response = await fetch(projectApiList.createInterview, {
                method: 'POST',
                headers: {
                },
                body: formDataToSend,
            });
            if (!response.ok) {
                throw new Error('Failed to submit data');
            }
            toast.success('Candidate Details Added successfully!', {
                autoClose: 3000,
            });
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
                CoreTechnology: [],
                JobTitle: '',
                InterviewRound: 1,
                resume: '',
                EmailId: ''
            });
            document.getElementById('resume').value = '';
        } catch (error) {
            toast.error('Candidate Details Unsuccessfully added!', {
                autoClose: 3000,
            });
            console.error('Error:', error);
        }
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
    const handleTechnologyChange = (selectedOptions) => {
        setFormData({
            ...formData,
            CoreTechnology: selectedOptions, 
        });
    };
    const jobTitleOptions = [
        "Chief Architect", "Software Architect",
        "Engineering Project Manager/Engineering Manager",
        "Technical Lead/Engineering Lead/Team Lead",
        "Principal Software Engineer", "Senior Software Engineer/Senior Software Developer",
        "Software Engineer", "Software Developer",
        "Junior Software Developer", "Intern Software Developer"
    ];
    return (
        <div style={main}>
            <Card style={card}>
                <CardBody  >
                    <Form onSubmit={handleSubmit} >
                        <div style={{ display: "flex", height: "65vh", width: '60vw', justifyContent: "space-between", width: "100%", }}>
                            <Col style={{ display: "flex", height: "100%", flexDirection: "column", justifyContent: "space-evenly", width: "48%", }}>
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
                                                if (/^[6-9][0-9]{0,9}$/.test(value) || value === '') {
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
                                                style={{width:'20%'}}
                                                
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
                                                style={{width:'20%'}}
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
                                        placeholder="Current CTC (In Rs)"
                                        type="text"
                                        value={formData.CurrentCTC}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/,/g, "");
                                            if (/^\d*\.?\d*$/.test(value)) {
                                                let formattedValue = value ? new Intl.NumberFormat("en-IN").format(value) : "";

                                                handleChange({ target: { name: e.target.name, value: formattedValue } });
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
                                            placeholder="Expected CTC (In Rs)"
                                            type="text"
                                            value={formData.ExpectedCTC}
                                            onChange={(e) => {
                                                let value = e.target.value.replace(/,/g, ""); // Remove existing commas
                                                if (/^\d*\.?\d*$/.test(value)) {
                                                    let formattedValue = value ? new Intl.NumberFormat("en-IN").format(value) : ""; // Keep empty when cleared

                                                    handleChange({ target: { name: e.target.name, value: formattedValue } });
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
                                            id="EmailId"
                                            name="EmailId"
                                            placeholder="Enter Email Id"
                                            type="text"
                                            value={formData.EmailId}
                                            onChange={handleChange}
                                            maxLength="200"
                                            required
                                            className="form-control-md custom-input"
                                        />
                                        {errors.EmailId && <small style={{ color: 'red' }}>{errors.EmailId}</small>}
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
                                                dateFormat: "d-m-Y", 
                                                enableTime: false, 
                                            }}
                                            className="form-control-md custom-input"
                                        />
                                    </FormGroup>
                                </Row>
                                <Select
                                    id="CoreTechnology"
                                    name="CoreTechnology"
                                    options={technologyOptions}
                                    isMulti
                                    placeholder="Select Core Technology"
                                    value={formData.CoreTechnology}
                                    onChange={(selectedOptions) => setFormData({
                                        ...formData,
                                        CoreTechnology: selectedOptions || []
                                    })}
                                />
                                <Row>
                                    <FormGroup>
                                        <FormControl
                                            id="JobTitle"
                                            name="JobTitle"
                                            as="select"
                                            value={formData.JobTitle}
                                            onChange={handleChange}
                                            className="form-control-md custom-input"
                                            required
                                        >
                                            <option value="">Select Job Title</option>
                                            {jobTitleOptions.map((job, index) => (
                                                <option key={index} value={job}>
                                                    {job}
                                                </option>
                                            ))}
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
                                <Row>
                                    <FormGroup>
                                        <FormControl
                                            as="select"
                                            id="NoticePeriodNegotiable"
                                            name="NoticePeriodNegotiable"
                                            value={formData.NoticePeriodNegotiable}
                                            onChange={handleChange}
                                            required
                                            className="form-control-md custom-input"
                                        >
                                            <option value="">Notice Period Negotiable</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </FormControl>
                                    </FormGroup>
                                </Row>
                               
                                <Row>
                                    <FormGroup>
                                        <div className="custom-file">
                                            <input
                                                type="file"
                                                className="custom-file-input"
                                                id="resume"
                                                name="resume"
                                                onChange={handleChange}
                                                accept=".pdf,.doc,.docx"
                                                hidden
                                            />
                                            <label
                                                className="custom-file-label btn btn-primary"
                                                htmlFor="resume"
                                                style={{
                                                    cursor: "pointer",
                                                    padding: "8px 12px",
                                                    display: "inline-block",
                                                    textAlign: "center",
                                                    borderRadius: "4px",
                                                    color: "white",
                                                }}
                                            >
                                                Choose Resume
                                            </label>
                                            <span
                                                style={{
                                                    marginLeft: "12px",  // Add left margin for spacing
                                                    fontSize: "0.875rem",
                                                    fontFamily: '"IBM Plex Sans", sans-serif',
                                                    fontWeight: 400,
                                                }}
                                            >
                                                {fileName}
                                            </span>
                                        </div>
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
                            background: "linear-gradient(45deg, #1e3c72, #2a5298)", 
                            border: "none",
                            color: "white",
                            fontWeight: "bold",
                            transition: "all 0.3s ease-in-out", 
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = "linear-gradient(45deg, #2a5298, #1e3c72)"; 
                            e.target.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "linear-gradient(45deg, #1e3c72, #2a5298)"; 
                            e.target.style.transform = "scale(1)";
                        }}
                    >
                        Save
                    </Button>
                </Row>
            </Card>
        </div >
    );
}
export default Interview;