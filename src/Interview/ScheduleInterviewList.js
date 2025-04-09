import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";

function ScheduleInterviewList(props) {
  const [del_id, setdel_id] = useState(0);
  const [loggedInUser, setloggedInUser] = useState('');

  const [data, setData] = useState([])
  useEffect(() => {
    const user = props.account?.name.split('|');

    const user_name = user[0];
    setloggedInUser(user_name);
    axios.post('https://##############################/schedulerAPI/interviews')
      .then((response) => {
        setData(response.data)
      }, (error) => {
        console.log(error);
      });
  }, [del_id]);

  const delete_interview = (id) => {
    const _id = Number(id);
    axios.delete(`https://##########################################/schedulerAPI/interviews/${_id}/`)
      .then((response) => {
        alert('Data Deleted');
        setdel_id(_id);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
     
        alert('Data Deleted');
        setdel_id(_id);
      });
  };

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
         
          <th>Customer Name</th>
          <th>Email Id</th>
          <th>Job Description</th>
          <th>Interview Round</th>
          <th>Status</th>
          <th>Comments</th>
          <th>Meeting Date Time</th>
          <th>Candidate Name</th>
          <th>Meeting Link</th>
          <th>Resume</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data?.sort((a, b) => b.id - a.id).map((item) => (
          <tr key={item.id}>
           
            <td>{item.customer_name}</td>
            <td>{item.email_id}</td>
            <td>{item.description}</td>
            <td>{item.interview_round}</td>
            <td>{item.status}</td>
            <td>{item.comments}</td>
            <td>{moment.utc(item.meeting_date_time).local().format("MM/DD/YYYY HH:mm")}</td>
            <td>{item.candidate_id}</td>
            <td>{item.meeting_link}</td>
            <td>
              <Button
                variant="info"
                size="sm"
                onClick={() => downloadFile(item.resume_file_base64, item.candidate_id)}
              >
                Download
              </Button>
              
            </td>
            <td>
              <Link to={`/dashboard/${item.id}`}>Edit</Link>
              <Button variant="danger" size="sm" onClick={() => delete_interview(item.id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ScheduleInterviewList;
