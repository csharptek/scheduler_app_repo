import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";

function ScheduleInterviewList(props) {
  //const data = [{"id": 1, "data_time": null, "createdon": null, "updatedon": null, "customer_name": "abcd", "contact_person": "manjika", "phone_no": null, "email_id": null, "status": null, "comments": null, "candidate_name": "ravi kumar", "candidate_id": null, "description": null, "meeting_date_time": null, "interview_round": null, "createdby": null, "resume_file_base64": null, "meeting_link": null}, {"id": 2, "data_time": null, "createdon": "2024-06-19T10:04:05.979Z", "updatedon": null, "customer_name": "xyz", "contact_person": "ashwika", "phone_no": null, "email_id": null, "status": null, "comments": null, "candidate_name": "rahul kumar", "candidate_id": null, "description": null, "meeting_date_time": null, "interview_round": null, "createdby": null, "resume_file_base64": null, "meeting_link": null}];
  const [del_id, setdel_id] = useState(0);
  const [loggedInUser, setloggedInUser] = useState('');

  const [data, setData] = useState([])
  useEffect(() => {
    const user = props.account?.name.split('|');
    console.log('99999999', props.account?.oid);

    const user_name = user[0];
    setloggedInUser(user_name);
    axios.post('https://interviewschedulerapi.azurewebsites.net/schedulerAPI/interviews')
      .then((response) => {
        setData(response.data)
      }, (error) => {
        console.log(error);
      });
  }, [del_id]);

  const delete_interview = (id) => {
    const _id = Number(id);
    axios.delete(`https://interviewschedulerapi.azurewebsites.net/schedulerAPI/interviews/${_id}/`)
      .then((response) => {
        alert('Data Deleted');
        setdel_id(_id);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        // Actions to perform regardless of success or failure
        // e.g., resetting form, updating state, etc.
        console.log('Delete request completed.');
        alert('Data Deleted');
        setdel_id(_id);
      });
  };

  const downloadFile = (file, name) => {
    // data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQABgAIAGe3r1h/YZZinAEAALMIAAATAAgCW0NvbnR
    const split_base64 = file?.split('base64,')
    const actual_file = split_base64[1].replace("',)", '');
    const file_type = split_base64[0]?.replace('data:', '')?.replace("('", '')
    // Convert base64 to Blob
    console.log('458', file_type, actual_file)

    const byteCharacters = atob(actual_file);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: file_type });

    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(link.href);
  };

  // const create_sendChat = async (can_id, dt, mlink) => {
  //   let token__ = ''
  //   let config = {
  //     method: 'get',
  //     maxBodyLength: Infinity,
  //     url: 'https://interviewschedulerapi.azurewebsites.net/schedulerAPI/interviews/token/',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //     }
  //   };
  //   await axios.request(config)
  //     .then((response) => {
  //       console.log('99999999', response);
  //       token__ = response.data.tokenData.access_token;
  //       sendMessage(token__, can_id, dt, mlink)

  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  // const sendMessage = async (tkn, can_id, dt, mlink) => {
  //   const accessToken = tkn; // Replace with your actual access token
  //   const email_can = can_id?.split('||');
  //   const candidate_email = email_can[1]
  //       // Calculate start and end time for the event
  //       const currentDateTime = new Date(dt);
  //       const startDateTime = new Date(currentDateTime.getTime() + 1 * 60 * 60 * 1000); // 1 hour from now
  //       const endDateTime = new Date(startDateTime.getTime() + 0.5 * 60 * 60 * 1000); // 30 mins duration

  //       const data = {
  //           subject: "Interview scheduled",
  //           body: {
  //               contentType: "HTML",
  //               content: "Interview meeting link: " + mlink
  //           },
  //           start: {
  //               dateTime: startDateTime.toISOString(), // Convert to ISO string
  //               timeZone: "Pacific Standard Time"
  //           },
  //           end: {
  //               dateTime: endDateTime.toISOString(), // Convert to ISO string
  //               timeZone: "Pacific Standard Time"
  //           },
  //           location: {
  //               displayName: "Csharptek interviews"
  //           },
  //           attendees: [
  //               {
  //                   emailAddress: {
  //                       address: candidate_email.replace(/ /g,''),
  //                       name: email_can[0]
  //                   },
  //                   type: "required"
  //               }
  //           ],
  //           allowNewTimeProposals: true,
  //           // transactionId: "7E163156-7762-4BEB-A1C6-729EA81755A7"
  //       };
        
  //       const config = {
  //           method: 'post',
  //           url: `https://graph.microsoft.com/v1.0//users/${props.account?.oid}/calendar/events`,
  //           headers: {
  //               'Authorization': `Bearer ${accessToken}`,
  //               'Content-Type': 'application/json',
  //               'Prefer': 'outlook.timezone="Pacific Standard Time"'
  //           },
  //           data: data
  //       };

  //       try {
  //           const res = await axios.request(config);
  //           console.log('Event created:', res.data);
  //       } catch (err) {
  //           console.error('Error creating event:', err);
  //       }
  // };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {/* <th>ID</th> */}
          {/* <th>Date Time</th>
          <th>Customer Name</th>
          <th>Contact Person</th> */}
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
            {/* <td>{item.id}</td> */}
            {/* <td>{moment.utc(item.data_time).local().format("MM/DD/YYYY HH:mm")}</td>
            <td>{item.customer_name}</td>
            <td>{item.contact_person}</td> */}
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
              {/* <Button
                variant="info"
                size="sm"
                onClick={() => create_sendChat(item.candidate_id, moment.utc(item.meeting_date_time).local(), item.meeting_link)}
              >
                Notify
              </Button> */}
            </td>
            <td>
              {/* <Button variant="primary" size="sm">Edit</Button> */}
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
