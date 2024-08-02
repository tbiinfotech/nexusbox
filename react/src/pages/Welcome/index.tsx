import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Welcome() {
  const [alarms, setAlarms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/get-all-alert`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setAlarms(data.alarms);
        console.log("alarms",data.alarms)
      } else {
        console.error("Failed to fetch alarm data");
      }
    } catch (error) {
      console.error("Error fetching alarm data:", error);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = alarms.slice(indexOfFirstItem, indexOfLastItem);
  console.log("currentItems++++++++++",currentItems)

  return (
    <React.Fragment>
      <Box className="page_heading">
        <Box className="heading_inner">
          <Box className="heading_icn_head">
            <Box className="heading_icon">
              <img src="images/head_icon.svg" alt="" />
            </Box>
            <Typography component="h1" variant="h1">
              Welcome
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="page_content">
        <Box className="page_table">
          <Box className="table_title">
            <Typography variant="h2" component="h2">
              Alarm history
            </Typography>
            {alarms.length > itemsPerPage && (
              <Box className="navigation">
                <Button
                  className="navig_buttn"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13.75 21.25L7.5 15L13.75 8.75"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22.5 21.25L16.25 15L22.5 8.75"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
                <Button
                  className="navig_buttn"
                  onClick={handleNextPage}
                  disabled={
                    currentPage === Math.ceil(alarms.length / itemsPerPage)
                  }>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16.25 21.25L22.5 15L16.25 8.75"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.5 21.25L13.75 15L7.5 8.75"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </Box>
            )}
          </Box>
          <TableContainer component={Paper} className="custom_table">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="num_title">No</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Task / Issue</TableCell>
                  <TableCell>Who answered</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell className="status_th">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((alarm, index) => (
                  <TableRow key={alarm.id}>
                    <TableCell className="num_value">
                      <Typography variant="span" component="span">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell className="table_name">
                      <Typography variant="span" component="span">
                        {alarm?.Client?.username ? alarm?.Client?.username: ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="span" component="span">
                        {alarm?.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="span" component="span">
                      {alarm?.Developer && alarm?.Developer?.username ? alarm?.Developer?.username : 'Not Assigned'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="span" component="span">
                      {alarm?.createdAt}
                      </Typography>
                    </TableCell>
                    <TableCell className="status_td">
                      <Typography
                        variant="span"
                        component="span"
                        className={`status ${alarm.status == 'pending' ? "open" : "picked"}`}>
                        {alarm.status == 'pending' ? "open" : "picked"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </React.Fragment>
  );
}
