
import React, {useEffect, useState} from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from "axios";
import moment from "moment";

const data = [
    {
        id: 1,
        departmentName: 'IT',
        date: '2023-06-20',
        time: '10:00',
        customerName: 'John Doe',
        contactPerson: 'Jane Smith',
        phoneNo: '+1234567890',
        emailId: 'johndoe@example.com',
        jobDescription: 'Software Developer',
        interviewRound: 1,
        status: 'Pending',
        comments: 'N/A',
        meetingDate: '2023-06-21',
        meetingTime: '10:30',
        candidateName: 'Candidate1',
        Resume: ''
    },
    // Add more data as needed
];

function AssignInterviewList(props) {

    const [loggedInUser, setloggedInUser] = useState('');

    const [data, setData] = useState([])
    useEffect(() => {
        const user = props.account?.name.split('|');
        const user_name = user[0];
        setloggedInUser(user_name);
        axios.post('#################################/schedulerAPI/interviews')
            .then((response) => {
                console.log('dfvdf', props.account)
                setData(response.data)
            }, (error) => {
                console.log(error);
            });
    }, []);

    const downloadFile = (file, name) => {
        const split_base64 = file?.split('base64,')
        const actual_file = split_base64[1].replace("',)", '');
        const file_type = split_base64[0]?.replace('data:', '')?.replace("('", '')
        console.log('458', file_type, actual_file)

        const byteCharacters = atob(actual_file);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: file_type });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = name;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Date Time</th>
                        <th>Meeting Time</th>
                        <th>Job Description</th>
                        <th>Resume</th>
                    </tr>
                </thead>
                <tbody>
                    {(data||[]).filter((fil)=> fil.candidate_name == props.account.oid).sort((a,b)=> b.id - a.id).map((item) => (
                        <tr key={item.id}>
                            {/* <td>{item.id}</td> */}
                            <td>{moment.utc(item.data_time).local().format("MM/DD/YYYY HH:mm")}</td>
                            <td>{moment.utc(item.meeting_date_time).local().format("MM/DD/YYYY HH:mm")}</td>
                            <td>{item.description}</td>
                            <td>
                                <Button
                                    variant="info"
                                    size="sm"
                                    onClick={() => downloadFile(item.resume_file_base64, item.candidate_id)}
                                >
                                    Download
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
    );
}
export default AssignInterviewList;