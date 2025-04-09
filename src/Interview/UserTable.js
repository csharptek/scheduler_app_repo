import React from 'react'
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from '@mui/material';
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";



const UserTable = (setEditPage) => {
// console.log("props",props)
    const rows = [
        { id: 1, name: "Alice", email: "jdfhlf@test.com" ,phone:23894637856},
        { id: 2, name: "Bob", email: "jdfhlf@test.com" ,phone:23894637856},
        { id: 3, name: "Charlie", email: "jdfhlf@test.com" ,phone:23894637856},
    ];
    
    const columns = [
        { field: "id", headerName: "ID", width: 50 },
        { field: "name", headerName: "Name", width: 150 },
        { field: "email", headerName: "Email", width: 150 },
        { field: "phone", headerName: "Phone No.", width: 150 },
    
        {
            field: "actions",
            headerName: "Actions",
            width: 100,
            renderCell: (params) => (
              <div>
                <IconButton
                  color="primary"
                  onClick={() => console.log(`Edit row: ${params.row.id}`)}
                //   onClick={() => setEditPage(true)}

                >
                  <CiEdit />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => console.log(`Delete row: ${params.row.id}`)}
                >
                  <MdOutlineDelete />
                </IconButton>
              </div>
            ),
          },
    ];

    return (
        <>
            <div style={{ height: 400, width: "100%" }}>
                <DataGrid rows={rows} columns={columns} />
            </div>
        </>
    )
}

export default UserTable