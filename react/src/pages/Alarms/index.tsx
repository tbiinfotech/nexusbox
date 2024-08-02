import React, { useState, useRef, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Alarms() {
  const [issueData, setIssueData] = useState({});
  const [alarmId, setAlarmId] = useState(null);
  const [alarmDetails, setAlarmDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const [alarmName, setAlarmName] = useState('');
  const fileInputRefs = useRef({});
  const userInfo = useSelector((state) => state.user.userInfo);
  const [selectedAlarmId, setSelectedAlarmId] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const alarmsPerPage = 5;

  const handleAlarmSelect = (id) => {
    setSelectedAlarmId(id);
  };

  useEffect(() => {
    const fetchAlarmDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-alarm/${userInfo.id}`);
        const alarms = response.data.alarms;
        console.log("alarms", alarms);
        if (alarms) {
          // const url = process.env.VITE_API_URL;
          // const fileUrl = url?.split('api')
          setAlarmDetails(alarms);
          alarms.forEach(alarm => {
            setIssueData(prevData => ({
              ...prevData,
              [alarm.id]: {
                audioFile: null,
                previewUrl: alarm.audioFilename ? `http://localhost:6091/uploads/audios/${alarm.audioFilename}` : null,
                preview: false,
                showPreviewButton: !!alarm.audioFilename
              }
            }));
          });
        }
      } catch (error) {
        console.error('Error fetching alarm details:', error);
      }
    };

    fetchAlarmDetails();
  }, [userInfo.id]);

  const handleFileChange = (event, alarmId) => {
    const file = event.target.files[0];
    if (file && alarmId) {
      const url = URL.createObjectURL(file);
      setIssueData(prevData => ({
        ...prevData,
        [alarmId]: { audioFile: file, previewUrl: url, preview: false, showPreviewButton: true }
      }));
      toast.success('You can preview or save the file');
    }
  };

  const handleCreateAlarm = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/create-alarm`, {
        alarmName,
        userId: userInfo.id
      });

      const newAlarmId = data.alarm.id;
      setAlarmId(newAlarmId);
      setOpen(false);
      setAlarmName('');

      const alarmDetailsResponse = await axios.get(`${API_URL}/get-alarm/${userInfo.id}`);
      setAlarmDetails(alarmDetailsResponse.data.alarms);
      setSelectedAlarmId(alarmDetailsResponse.data.alarms.id);
      toast.success('Alarm created successfully!');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data.error || 'Bad Request');
        } else if (error.response.status === 500) {
          toast.error('Internal Server Error');
        } else {
          toast.error('An unexpected error occurred');
        }
      } else if (error.request) {
        toast.error('No response received from the server');
      } else {
        toast.error('Error creating alarm');
      }

      console.error('Error creating alarm:', error);
    }
  };

  const handleUploadClick = (issue) => {
    fileInputRefs.current[issue].click();
  };

  const handleUpload = async (alarmId) => {
    const issue = issueData[alarmId];
    if (issue && issue.audioFile && alarmId && userInfo.id) {
      const formData = new FormData();
      formData.append('audioFile', issue.audioFile);
      formData.append('alarmId', alarmId);
      formData.append('userId', userInfo.id); // Add userId to formData
  
      try {
        await axios.post(`http://localhost:6091/api/upload/${alarmId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('File uploaded successfully!');
  
        // Update the preview state after successful upload
        setIssueData(prevData => ({
          ...prevData,
          [alarmId]: { ...prevData[alarmId], preview: true, showPreviewButton: true }
        }));
      } catch (error) {
        // Ensure to access the error message from error.response
        const errorMessage = error.response?.data?.message || 'Error uploading file';
        console.error('Error uploading file:', error);
        toast.error(errorMessage);
      }
    }
  };
  
  
  

  const handlePreview = (issue) => {
    setIssueData(prevData => ({
      ...prevData,
      [issue]: { ...prevData[issue], preview: !prevData[issue].preview }
    }));
    if (issueData[issue]?.previewUrl && !issueData[issue]?.preview) {
      const audio = new Audio(issueData[issue].previewUrl);
      audio.play();
    }
  };

  // Get alarms for current page
  const indexOfLastAlarm = currentPage * alarmsPerPage;
  const indexOfFirstAlarm = indexOfLastAlarm - alarmsPerPage;
  const currentAlarms = alarmDetails.slice(indexOfFirstAlarm, indexOfLastAlarm);

  // Handle page change
  const handlePageChange = (direction) => {
    if (direction === 'next') {
      setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(alarmDetails.length / alarmsPerPage)));
    } else if (direction === 'prev') {
      setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    }
  };

  return (
    <React.Fragment>
      <ToastContainer />

      <Box className="page_heding">
        <Box className="heading_inner">
          <Box className="heading_icn_head">
            <Box className="heading_icon">
              <img src="images/DATA.svg" alt="" />
            </Box>
            <Typography component="h1" variant="h1">
              Alarms
            </Typography>
          </Box>
          <Box className="head_butn">
            <Button
              className="common_buttn-desgn"
              onClick={() => setOpen(true)}
            >
              New Alarm
            </Button>
          </Box>
        </Box>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Alarm</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Alarm Name"
            type="text"
            fullWidth
            variant="standard"
            value={alarmName}
            onChange={(e) => setAlarmName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateAlarm}>Create</Button>
        </DialogActions>
      </Dialog>

      <Box className="page_content">
        <Box className="page_table">
          <Box className="table_title">
            <Typography variant="h2" component="h2">
              Alarm Settings
            </Typography>
            <Box className="navigation">
              <Button className="navig_buttn" onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.75 21.25L7.5 15L13.75 8.75" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22.5 21.25L16.25 15L22.5 8.75" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
              <Button className="navig_buttn" onClick={() => handlePageChange('next')} disabled={currentPage === Math.ceil(alarmDetails.length / alarmsPerPage)}>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.25 21.25L22.5 15L16.25 8.75" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7.5 21.25L13.75 15L7.5 8.75" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
            </Box>
          </Box>
          <Box className="issue_types">
            {currentAlarms.length > 0 && currentAlarms.map((alarm) => (
              <Box className="single_issue" key={alarm.id} onClick={() => handleAlarmSelect(alarm.id)}>
                <Box className="issue_heading">
                  <Typography component="h3" variant="h3">
                    {alarm.alarmName || 'Alarm Issue'}
                  </Typography>
                </Box>
                <Box className="issue_actions">
                  <Box className="label">
                    <Typography component="h4" variant="h4">
                      Upload sound
                    </Typography>
                  </Box>
                  <Box className="issue_act_btns">
                    <Box className="actions left">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(event) => handleFileChange(event, alarm.id)}
                        style={{ display: "none" }}
                        ref={ref => fileInputRefs.current[alarm.id] = ref}
                      />
                      {issueData[alarm.id]?.showPreviewButton && (
                        <Button
                          className="act_btn white_bg"
                          onClick={() => handlePreview(alarm.id)}
                          disabled={!issueData[alarm.id]?.previewUrl}
                        >
                          Preview
                        </Button>
                      )}
                      {!issueData[alarm.id]?.preview && (
                        <Button
                          className="act_btn outlined"
                          onClick={() => fileInputRefs.current[alarm.id]?.click()}
                        >
                          Upload
                        </Button>
                      )}
                    </Box>
                    {!issueData[alarm.id]?.preview && (
                      <Box className="actions right">
                        <Button
                          className="act_btn with_bg"
                          onClick={() => handleUpload(alarm.id)} // Trigger upload for the specific alarm
                          disabled={!issueData[alarm.id]?.audioFile} // Disable if no file is selected
                        >
                          Save
                        </Button>
                      </Box>
                    )}
                    {issueData[alarm.id]?.preview && issueData[alarm.id]?.previewUrl && (
                      <Box>
                        <audio controls src={issueData[alarm.id].previewUrl} />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}
