import { React, useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Button,
    Alert
} from 'react-bootstrap';
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { projectApiList } from "../config/config";

const Interviewerpage = () => {
    const [interviewers, setInterviewers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(projectApiList.getEnabledInterviewers)
            .then((response) => {
                setInterviewers(response.data.map(row => ({
                    ...row,
                    id: row.Id  // Ensure consistent id field
                })));
                setError('');
            })
            .catch((error) => {
                console.error('Error fetching interviewers:', error);
                setError('Failed to fetch interviewers. Please try again.');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleEnableDisable = (interviewerId, currentStatus) => {
        const newStatus = !currentStatus;
        const patchData = [
            { "op": "replace", "path": "/IsEnabled", "value": newStatus }
        ];
    
        setActionLoading(true);
        
        axios.patch(projectApiList.updateEnabledInterviewers(interviewerId), patchData, {
            headers: {
                'Content-Type': 'application/json-patch+json',
                'accept': '*/*'
            }
        })
        .then(() => {
            // Fetch fresh data after successful update
            return axios.get(projectApiList.getEnabledInterviewers);
        })
        .then(response => {
            setInterviewers(response.data.map(row => ({
                ...row,
                id: row.Id
            })));
            setSuccess(`Interviewer ${newStatus ? 'enabled' : 'disabled'} successfully`);
            setTimeout(() => setSuccess(''), 3000);
        })
        .catch((error) => {
            console.error('Error updating interviewer status:', error);
            setError('Failed to update interviewer status. Please try again.');
        })
        .finally(() => setActionLoading(false));
    };
    
    const columns = [
        { field: "id", headerName: "ID", width: 100 },  // Using id directly
        { field: "Name", headerName: "Name", width: 250 },
        { field: "EmailId", headerName: "Email", width: 320 },
        {
            field: "Status",
            headerName: "Status",
            width: 150,
            renderCell: (params) => (
                <span style={{ color: params.row.IsEnabled ? 'green' : 'red' }}>
                    {params.row.IsEnabled ? 'Enabled' : 'Disabled'}
                </span>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params) => (
                <Button
                    variant={params.row.IsEnabled ? "danger" : "success"}
                    onClick={() => handleEnableDisable(params.row.id, params.row.IsEnabled)}
                    disabled={actionLoading}
                    size="sm"
                >
                    {actionLoading ? 'Processing...' : (params.row.IsEnabled ? 'Disable' : 'Enable')}
                </Button>
            ),
        }
    ];

    return (
        <Card style={{ width: '80%', margin: '0 auto', padding: '20px' }}>
            <CardBody>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid 
                        rows={interviewers} 
                        columns={columns} 
                        pageSize={5}
                        loading={loading}
                        getRowId={(row) => row.id}
                        disableSelectionOnClick
                    />
                </div>
            </CardBody>
        </Card>
    );
};

export default Interviewerpage;