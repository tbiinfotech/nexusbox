import { Box, Typography, Button, TextField, IconButton, InputAdornment } from "@mui/material";
import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Developers() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    email: "",
    phone: "",
    password: "", 
  });
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameAccError, setNameAccError] = useState("");
  const [emailAccError, setEmailAccError] = useState("");
  const [phoneAccError, setPhoneAccError] = useState("");
  const [passwordAccError, setPasswordAccError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newAccountData, setNewAccountData] = useState({
    Name: "",
    phone: "",
    email: "",
    password: "",
    role: 'projectmanager'
  });

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    setNewAccountData({ 
      Name: "",
      phone: "",
      email: "",
      password: "",
      role: 'projectmanager'
    });
    setNameAccError();
    setEmailAccError();
    setPhoneAccError();
    setPasswordAccError();
  }
    
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const HeaderAuthorization = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  const role = "projectmanager";

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/get-user-by-role?role=${role}`, {
        ...HeaderAuthorization,
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = (user) => {
    setFormData({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      password: "1234==*1",
    });
    setOpen(true);
    setOpenDel(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDel = (user) => {
    setFormData({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      password: user.password,
    });
    setOpenDel(true);
    setOpen(false);
  };

  const handleCloseDel = () => {
    setOpenDel(false);
  };

  const validateForm = () => {
    let valid = true;

    // Validate name
    if (formData.username.trim() === "") {
      setNameError("Name cannot be empty");
      valid = false;
    } else {
      setNameError("");
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() === "") {
      setEmailError("Email cannot be empty");
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      setEmailError("Invalid email format");
      valid = false;
    } else {
      setEmailError("");
    }

    // Validate phone number (basic validation for demonstration)
    const phoneRegex = /^\d{10}$/;
    if (formData.phone.trim() === "") {
      setPhoneError("Phone number cannot be empty");
      valid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      setPhoneError("Invalid phone number format");
      valid = false;
    } else {
      setPhoneError("");
    }

    if (formData.password.trim() === "") {
      setPasswordError("Password cannot be empty");
      valid = false;
    } else if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      valid = false;
    }else {
      setPasswordError("");
    }
    return valid;
  };

  const handleEdit = async () => {
    try {
      if (!validateForm()) {
        return;
      }
     
      const response = await fetch(`${API_URL}/update-user/${formData.id}`, {
        ...HeaderAuthorization,
        method: "PUT",
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message, {
          duration: 2000,
        });
        fetchUsers();
        handleClose();
      } else {
        const data = await response.json();
        toast.error(data.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));

    // Clear corresponding error when user starts typing again
    switch (field) {
      case "username":
        setNameError("");
        break;
      case "email":
        setEmailError("");
        break;
      case "phone":
        setPhoneError("");
        break;
      default:
        break;
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${API_URL}/delete-user/${formData.id}`,
        {
          ...HeaderAuthorization,
          method: "DELETE",
        }
      );
      if (response.ok) {
        toast.success("User deleted successfully", {
          duration: 2000,
        });
        fetchUsers();
        handleCloseDel();
      } else {
        toast.error("Failed to delete user. Try again later.", {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const goToNextPage = () => {
    if (currentPage < Math.ceil(users?.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
       handleClose();
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
       handleClose();
    }
  };

  // Calculate the users to display based on the current page
  const currentUsers = users?.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const validateAccountForm = () => {
    let valid = true;

    // Validate name
    if (newAccountData.Name.trim() === "") {
      setNameAccError("Name cannot be empty");
      valid = false;
    } else {
      setNameAccError("");
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newAccountData.email.trim() === "") {
      setEmailAccError("Email cannot be empty");
      valid = false;
    } else if (!emailRegex.test(newAccountData.email)) {
      setEmailAccError("Invalid email format");
      valid = false;
    } else {
      setEmailAccError("");
    }

    // Validate phone number (basic validation for demonstration)
    const phoneRegex = /^\d{10}$/;
    if (newAccountData.phone.trim() === "") {
      setPhoneAccError("Phone number cannot be empty");
      valid = false;
    } else if (!phoneRegex.test(newAccountData.phone)) {
      setPhoneAccError("Invalid phone number format");
      valid = false;
    } else {
      setPhoneAccError("");
    }

    if (newAccountData.password.trim() === "") {
      setPasswordAccError("Password cannot be empty");
      valid = false;
    } else if (newAccountData.password.length < 8) {
      setPasswordAccError("Password must be at least 8 characters");
      valid = false;
    } else {
      setPasswordAccError("");
    }
    return valid;
  };


  const handleNewAccountChange = (e) => {
    setNewAccountData({ ...newAccountData, [e.target.name]: e.target.value });
  };

  const handleCreateAccount = async() => {

    if (!validateAccountForm()) {
      return;
    }

    const response = await fetch(`${API_URL}/create-user`, {
      ...HeaderAuthorization,
      method: "POST",
      body: JSON.stringify(newAccountData),
    });
    const data = await response.json();
    if (response.ok) {
      toast.success(data.message, {
        duration: 2000,
      });
      fetchUsers();
      setNewAccountData({ 
        Name: "",
        phone: "",
        email: "",
        password: "",
        role: 'projectmanager'
      });
    } else {
      toast.error(data.message, {
        duration: 2000,
      });
      console.error("Failed to fetch users");
    }
    handleModalClose();
  };

  return (
    <React.Fragment>
      <Box className="page_heding">
        <Box className="heading_inner">
          <Box className="heading_icn_head">
            <Box className="heading_icon">
              <img src="images/developr_icon.svg" alt="" />
            </Box>
            <Typography component="h1" variant="h1">
              Project Managers
            </Typography>
          </Box>
          <Box className="head_butn">
            <Button className="common_buttn-desgn" onClick={handleModalOpen}>New Account</Button>
          </Box>
        </Box>
      </Box>
      <Box className="page_content">
        <Box className="page_table">
          <TableContainer component={Paper} className="custom_table">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell className="num_title">Edit / Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Data section */}
                {currentUsers?.map((user) => (
                       <React.Fragment key={user.id}>
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                    key={user.id}>
                    <TableCell>
                      <Typography variant="span" component="span">
                        {user.username}
                      </Typography>
                    </TableCell>
                    <TableCell className="table_name">
                      <Typography variant="span" component="span">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="span" component="span">
                        {user.phone}
                      </Typography>
                    </TableCell>
                    <TableCell className="edit_delete">
                      <Box className="actions">
                        <Button
                          className="act_btn edit"
                          onClick={() => handleOpen(user)}>
                          Edit
                        </Button>
                        <Button
                          className="act_btn delete"
                          onClick={() => handleOpenDel(user)}>
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>


                {/* Edit section */}
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={4}
                    className="collapsable_table edit_delete_collps">
                    <Collapse in={open && formData.id === user.id} timeout="auto" unmountOnExit>
                      <Table aria-label="simple table">
                        <TableBody>
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}>
                            <TableCell className="company">
                              <Typography variant="span" component="span">
                                {formData.username}
                              </Typography>
                            </TableCell>
                            <TableCell className="contact_name">
                              <Typography variant="span" component="span">
                                {formData.email}
                              </Typography>
                            </TableCell>
                            <TableCell className="phone">
                              <Typography variant="span" component="span">
                                {formData.phone}
                              </Typography>
                            </TableCell>
                            <TableCell className="edit_delect_close">
                              <Button
                                className="email_selector"
                                onClick={handleClose}>
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M15 9L9 15"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M9 9L15 15"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              style={{ paddingBottom: 0, paddingTop: 0 }}
                              colSpan={4}
                              className="collaps_nested">
                              <Collapse in={open} timeout="auto" unmountOnExit>
                                <Table aria-label="edit table">
                                  <TableBody>
                                    <TableRow>
                                      <TableCell className="platform_val">
                                        <Typography
                                          variant="span"
                                          component="span">
                                          Name
                                        </Typography>
                                      </TableCell>
                                      <TableCell className="platform_val">
                                        <TextField
                                          id="username"
                                          placeholder="Enter name"
                                          value={formData.username}
                                          onChange={(e) =>
                                            handleInputChange(
                                              "username",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </TableCell>
                                    </TableRow>
                                    {nameError && (
                                      <Typography variant="body2" color="error">
                                        {nameError}
                                      </Typography>
                                    )}
                                    <TableRow>
                                      <TableCell className="platform_val">
                                        <Typography
                                          variant="span"
                                          component="span">
                                          Email
                                        </Typography>
                                      </TableCell>
                                      <TableCell className="platform_val">
                                        <TextField
                                          id="email"
                                          placeholder="Enter email"
                                          value={formData.email}
                                          onChange={(e) =>
                                            handleInputChange(
                                              "email",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </TableCell>
                                    </TableRow>
                                    {emailError && (
                                      <Typography color="error">
                                        {emailError}
                                      </Typography>
                                    )}
                                    <TableRow>
                                      <TableCell className="platform_val">
                                        <Typography
                                          variant="span"
                                          component="span">
                                          Phone
                                        </Typography>
                                      </TableCell>
                                      <TableCell className="platform_val">
                                        <TextField
                                          id="phone"
                                          placeholder="Enter phone"
                                          value={formData.phone}
                                          onChange={(e) =>
                                            handleInputChange(
                                              "phone",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </TableCell>
                                    </TableRow>
                                    {phoneError && (
                                      <Typography variant="body2" color="error">
                                        {phoneError}
                                      </Typography>
                                    )}
                                    <TableRow>
                                        <TableCell className="platform_val">
                                          <Typography variant="span" component="span">
                                            Password
                                          </Typography>
                                        </TableCell>
                                        <TableCell className="platform_val">
                                          <TextField
                                            id="password"
                                            type="password"
                                            placeholder="Enter password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange("password", e.target.value)}
                                          />
                                        </TableCell>
                                      </TableRow>
                                      {passwordError && (
                                      <Typography variant="body2" color="error">
                                        {passwordError}
                                      </Typography>
                                    )}
                                    <TableRow>
                                      <TableCell className="platform_val">
                                        <Typography
                                          variant="span"
                                          component="span"></Typography>
                                      </TableCell>
                                      <TableCell className="platform_val submit_save">
                                        <Box className="save_btn">
                                          <Button
                                            className="act_btn"
                                            onClick={handleEdit}>
                                            Save
                                          </Button>
                                        </Box>
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Collapse>
                  </TableCell>
                </TableRow>

                {/* Delete section */}
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={4}
                    className="collapsable_table edit_delete_collps">
                    <Collapse in={openDel && formData.id === user.id} timeout="auto" unmountOnExit>
                      <Table aria-label="simple table">
                        <TableBody>
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}>
                            <TableCell className="company">
                              <Typography variant="span" component="span">
                                {formData.username}
                              </Typography>
                            </TableCell>
                            <TableCell className="contact_name">
                              <Typography variant="span" component="span">
                                {formData.email}
                              </Typography>
                            </TableCell>
                            <TableCell className="phone">
                              <Typography variant="span" component="span">
                                {formData.phone}
                              </Typography>
                            </TableCell>
                            <TableCell className="edit_delect_close">
                              <Button
                                className="email_selector"
                                onClick={handleCloseDel}>
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M15 9L9 15"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M9 9L15 15"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="collaps_nested deleting_row">
                              <Table aria-label="simple table">
                                <TableBody>
                                  <TableRow
                                    sx={{
                                      "&:last-child td, &:last-child th": {
                                        border: 0,
                                      },
                                    }}>
                                    <TableCell className="platform_val">
                                      <Typography
                                        variant="span"
                                        component="span"
                                        className="deleting">
                                        You want to delete {formData.username}
                                      </Typography>
                                    </TableCell>
                                    <TableCell className="platform_val">
                                      <Box className="actions">
                                        <Button
                                          className="act_btn delete"
                                          onClick={handleDelete}>
                                          Delete
                                        </Button>
                                        <Button
                                          className="act_btn cancle"
                                          onClick={handleCloseDel}>
                                          Cancel
                                        </Button>
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Collapse>
                  </TableCell>
                </TableRow>
                  </React.Fragment>
                ))}

              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {users?.length > 10 && (
            <Box className="navigation bottom">
              <Button
                className="navig_buttn"
                onClick={goToPreviousPage}
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
                onClick={goToNextPage}
                disabled={
                  currentPage === Math.ceil(users?.length / usersPerPage)
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
      </Box>
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        PaperProps={{
          style: {
            width: '700px', 
          },
        }}
      >
        <DialogTitle>Create New Account</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="Name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newAccountData.Name}
            onChange={handleNewAccountChange}
          />
          {nameAccError && (
            <Typography variant="body2" color="error">
              {nameAccError}
            </Typography>
          )}
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            variant="outlined"
            value={newAccountData.phone}
            onChange={handleNewAccountChange}
          />
          {phoneAccError && (
            <Typography variant="body2" color="error">
              {phoneAccError}
            </Typography>
          )}
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newAccountData.email}
            onChange={handleNewAccountChange}
          />
          {emailAccError && (
            <Typography variant="body2" color="error">
              {emailAccError}
            </Typography>
          )}
         <TextField
          margin="dense"
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          variant="outlined"
          value={newAccountData.password}
          onChange={handleNewAccountChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {passwordAccError && (
          <Typography variant="body2" color="error">
            {passwordAccError}
          </Typography>
        )}
        </DialogContent>
        <DialogActions sx={{ marginRight: 2 }}>
          <Button
            onClick={handleModalClose}
            sx={{
              backgroundColor: "white",
              color: "#29AAE1",
              "&:hover": {
                backgroundColor: "#29AAE1",
                color: "white",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateAccount}
            sx={{
              backgroundColor: "#29AAE1",
              color: "white",
              "&:hover": {
                backgroundColor: "white",
                color: "#29AAE1",
              },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
