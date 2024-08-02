import { Box, Typography, Button, IconButton, InputAdornment } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import toast from "react-hot-toast";
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Clients() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    email: "",
    phone: "",
    company: "",
    password: "",
  });
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const [selectedProjectManager, setSelectedProjectManager] = useState("");
  const [selectedServerStaff, setSelectedServerStaff] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10; // Number of clients per page
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const HeaderAuthorization = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const [companynameError, setcompanyNameError] = useState("");
  const [contactnameError, setcontactNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [companynameAccError, setcompanyNameAccError] = useState("");
  const [contactnameAccError, setcontactNameAccError] = useState("");
  const [emailAccError, setEmailAccError] = useState("");
  const [phoneAccError, setPhoneAccError] = useState("");
  const [passwordAccError, setPasswordAccError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [newAccountData, setNewAccountData] = useState({
    company: "",
    Name: "",
    phone: "",
    email: "",
    password: "",
    role: 'client'
  });

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    setNewAccountData({
      company: "",
      Name: "",
      phone: "",
      email: "",
      password: "",
      role: 'client'
    });
    setcompanyNameAccError();
    setcontactNameAccError();
    setEmailAccError();
    setPhoneAccError();
    setPasswordAccError();
  }

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };


  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/get-all-user`, {
        ...HeaderAuthorization,
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();

        setUsers(data.user);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return;
    }
  };

  const clients = users?.filter((user) => user?.roleId === 3);
  console.log("clients++++++", clients)
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = async (client) => {
    try {
      const response = await fetch(
        `${API_URL}/get-user-developer/${client.id}`,
        {
          ...HeaderAuthorization,
          method: "GET",
        }
      );
      const data = await response.json();
      console.log("reponse++++++++",data)

      if (data.success == true) {

        setFormData({
          id: client.id,
          username: client.username,
          email: client.email,
          phone: client.phone,
          company: client.company,
          password: "1234==*1",
        });
        setSelectedDeveloper(data.users.developerId || "");
        setSelectedProjectManager(data.users.projectManagerId || "");
        setSelectedServerStaff(data.users.serverStaffId || "");
      } else {
        // Reset form data and selected values if user not found
        setFormData({
          id: client.id,
          username: client.username,
          email: client.email,
          phone: client.phone,
          company: client.company,
          password: "1234==*1",
        });
        setSelectedDeveloper("");
        setSelectedProjectManager("");
        setSelectedServerStaff("");
      }
    } catch (error) {
      console.error("Error fetching user developer data:", error);
      // Handle fetch error
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setIsDeleting(false);

  };

  const handleChangeDeveloper = (event) => {
    setSelectedDeveloper(event.target.value);
  };

  const handleChangeProjectManager = (event) => {
    setSelectedProjectManager(event.target.value);
  };

  const handleChangeServerStaff = (event) => {
    setSelectedServerStaff(event.target.value);
  };


  const validateForm = () => {
    let valid = true;

    // Validate name
    if (formData.company.trim() === "") {
      setcompanyNameError("Company Name cannot be empty");
      valid = false;
    } else {
      setcompanyNameError("");
    }

    if (formData.username.trim() === "") {
      setcontactNameError("Contact Name cannot be empty");
      valid = false;
    } else {
      setcontactNameError("");
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
    } else {
      setPasswordError("");
    }
    return valid;
  };
  const handleclientEdit = async () => {
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
        setOpen(false);
        setTimeout(() => {
          setIsEditing(false);
          setIsDeleting(false);
        }, 1000);
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
  const handleEdit = async () => {
    try {
      let obj = {
        selectedDeveloper,
        selectedProjectManager,
        selectedServerStaff,
      };
      const response = await fetch(
        `${API_URL}/update-user-developer/${formData.id}`,
        {
          ...HeaderAuthorization,
          method: "PUT",
          body: JSON.stringify(obj),
        }
      );
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

  const totalPages = Math.ceil(clients.length / perPage);

  const paginatedClients = clients.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    handleClose();
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
    handleClose();
  };



  const handleNewAccountChange = (e) => {
    setNewAccountData({ ...newAccountData, [e.target.name]: e.target.value });
  };


  const validateAccountForm = () => {
    let valid = true;

    // Validate name
    if (newAccountData.company.trim() === "") {
      setcompanyNameAccError("Company name cannot be empty");
      valid = false;
    } else {
      setcompanyNameAccError("");
    }

    if (newAccountData.Name.trim() === "") {
      setcontactNameAccError("Contact Name cannot be empty");
      valid = false;
    } else {
      setcontactNameAccError("");
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

  const handleCreateAccount = async () => {
    console.log("newAccountData+++++++", newAccountData)
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
        company: "",
        Name: "",
        phone: "",
        email: "",
        password: "",
        role: 'client'
      });
    } else {
      toast.error(data.message, {
        duration: 2000,
      });
      console.error("Failed to fetch users");
    }
    handleModalClose();
  };
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpen1 = async () => {
    setIsEditing(true);
    setIsDeleting(false);

  }
  const handleClose1 = () => setIsEditing(false);
  const handleEdit1 = () => {
    // Handle edit logic
    setIsEditing(false);
  };
  const handleDelete = () => {
    // Handle delete logic
    setIsDeleting(true);
  };
  const handleCloseDel = async () => {
    // Start collapsing by setting `open` to false
    setOpen(false);
  
    // Delay state change to allow Collapse animation to complete
    setTimeout(() => {
      // Smoothly scroll to the top or desired position after collapse
      window.scrollTo({
        top: 0, // Change this value if you want to scroll to a different position
        behavior: 'smooth'
      });
      
      setIsDeleting(false);
      setIsEditing(false);
    }, 300); // Adjust this delay to match the transition duration
  };
  
  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));

    // Clear corresponding error when user starts typing again
    switch (field) {
      case "company":
        setcompanyNameError("");
        break;
      case "username":
        setcontactNameError("");
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


  const handleOnDelete = async () => {
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
        setOpen(false);
        setTimeout(() => {
          setIsEditing(false);
          setIsDeleting(false);
        }, 1000);
      } else {
        toast.error("Failed to delete user. Try again later.", {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };


  return (
    <React.Fragment>
      <Box className="page_heding">
        <Box className="heading_inner">
          <Box className="heading_icn_head">
            <Box className="heading_icon">
              <img src="images/CLIENTS.svg" alt="" />
            </Box>
            <Typography component="h1" variant="h1">
              Clients
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
                  <TableCell>Company</TableCell>
                  <TableCell>Contact Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell className="num_title">Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Data section */}
                {paginatedClients?.map((client) => (
                  <React.Fragment key={client.id}>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      key={client.id}>
                      <TableCell>
                        <Typography variant="span" component="span">
                          {client.company}
                        </Typography>
                      </TableCell>
                      <TableCell className="table_name">
                        <Typography variant="span" component="span">
                          {client.username}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="span" component="span">
                          {client.phone}
                        </Typography>
                      </TableCell>
                      <TableCell className="client_email">
                        <Typography variant="span" component="span">
                          {client.email}
                        </Typography>
                        <Button
                          className="email_selector"
                          onClick={() => handleOpen(client)}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M6 9L12 15L18 9"
                              stroke="black"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Button>
                      </TableCell>
                    </TableRow>


                    {/* Edit section */}
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={4}
                        className="collapsable_table">
                        <Collapse in={open && formData.id === client.id} timeout="auto" unmountOnExit>
                          <Table aria-label="simple table">
                            <TableBody>
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": { border: 0 },
                                }}>
                                <TableCell className="company">
                                  <Typography variant="span" component="span">
                                    {formData.company}
                                  </Typography>
                                </TableCell>
                                <TableCell className="contact_name">
                                  <Typography variant="span" component="span">
                                    {formData.username}
                                  </Typography>
                                </TableCell>
                                <TableCell className="phone">
                                  <Typography variant="span" component="span">
                                    {formData.phone}
                                  </Typography>
                                </TableCell>
                                <TableCell className="client_email">
                                  <Typography variant="span" component="span">
                                    {formData.email}
                                  </Typography>
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
                                <TableCell colSpan={4} className="collaps_nested">
                                  <Table aria-label="simple table">
                                    <TableHead>
                                      <TableRow
                                        sx={{
                                          "&:last-child td, &:last-child th": {
                                            border: 0,
                                          },
                                        }}>
                                        <TableCell className="platform_head">
                                          <Typography variant="h4" component="h4">
                                            Platform
                                          </Typography>
                                        </TableCell>
                                        <TableCell className="platform_btns">
                                          <Box className="actions">
                                            <Button className="act_btn edit" onClick={handleOpen1}>
                                              Edit
                                            </Button>
                                            <Button className="act_btn delete" onClick={handleDelete}>
                                              Delete
                                            </Button>
                                          </Box>
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>

                                    <TableBody id="user-info">
                                      {!isDeleting && !isEditing && (
                                        <>
                                          <TableRow
                                            sx={{
                                              "&:last-child td, &:last-child th": {
                                                border: 0,
                                              },
                                            }}>
                                            <TableCell className="platform_val">
                                              <Typography
                                                variant="span"
                                                component="span">
                                                Developer Assigned
                                              </Typography>
                                            </TableCell>
                                            <TableCell className="platform_val">
                                              <FormControl>
                                                <InputLabel id="demo-simple-select-label" style={{ margin: '-6px -10px' }}>
                                                  Select Developer
                                                </InputLabel>
                                                <Select
                                                  label="Status"
                                                  labelId="demo-simple-select-label"
                                                  id="developer-select"
                                                  value={selectedDeveloper}
                                                  onChange={handleChangeDeveloper}>
                                                  {users
                                                    ?.filter(
                                                      (user) => user.roleId === 2
                                                    ) // Filter users with roleId 2 (Developer Staff)
                                                    ?.map((user) => (
                                                      <MenuItem
                                                        key={user.id}
                                                        value={user.id}>
                                                        {user.username}
                                                      </MenuItem>
                                                    ))}
                                                </Select>
                                              </FormControl>
                                            </TableCell>
                                          </TableRow>

                                          <TableRow
                                            sx={{
                                              "&:last-child td, &:last-child th": {
                                                border: 0,
                                              },
                                            }}>
                                            <TableCell className="platform_val">
                                              <Typography
                                                variant="span"
                                                component="span">
                                                Project Manager Assigned
                                              </Typography>
                                            </TableCell>
                                            <TableCell className="platform_val">
                                              <FormControl>
                                                <InputLabel id="demo-simple-select-label" style={{ margin: '-6px -10px' }}>
                                                  Select Project Manager
                                                </InputLabel>
                                                <Select
                                                  label="Status"
                                                  labelId="demo-simple-select-label"
                                                  id="project-manager-select"
                                                  value={selectedProjectManager}
                                                  onChange={handleChangeProjectManager}>
                                                  {users
                                                    ?.filter(
                                                      (user) => user.roleId === 4
                                                    ) // Filter users with roleId 3 (ProjectManager Staff)
                                                    ?.map((user) => (
                                                      <MenuItem
                                                        key={user.id}
                                                        value={user.id}>
                                                        {user.username}
                                                      </MenuItem>
                                                    ))}
                                                </Select>
                                              </FormControl>
                                            </TableCell>
                                          </TableRow>

                                          <TableRow
                                            sx={{
                                              "&:last-child td, &:last-child th": {
                                                border: 0,
                                              },
                                            }}>
                                            <TableCell className="platform_val">
                                              <Typography
                                                variant="span"
                                                component="span">
                                                Server Staff Assigned
                                              </Typography>
                                            </TableCell>
                                            <TableCell className="platform_val">
                                              <FormControl>
                                                <InputLabel id="demo-simple-select-label" style={{ margin: '-6px -10px' }}>
                                                  Select Server Staff
                                                </InputLabel>
                                                <Select
                                                  // label="Status"
                                                  labelId="demo-simple-select-label"
                                                  value={selectedServerStaff}
                                                  onChange={handleChangeServerStaff}>
                                                  {users
                                                    ?.filter(
                                                      (user) => user.roleId === 5
                                                    ) // Filter users with roleId 4 (Server Staff)
                                                    ?.map((user) => (
                                                      <MenuItem
                                                        key={user.id}
                                                        value={user.id}>
                                                        {user.username}
                                                      </MenuItem>
                                                    ))}
                                                </Select>
                                              </FormControl>
                                            </TableCell>
                                          </TableRow>

                                          {/* <TableRow
                                    sx={{
                                      "&:last-child td, &:last-child th": {
                                        border: 0,
                                      },
                                    }}>
                                    <TableCell className="platform_val">
                                      <Typography
                                        variant="span"
                                        component="span">
                                        + Add new
                                      </Typography>
                                    </TableCell>
                                    <TableCell className="platform_val">
                                      <Box className="add_btn">
                                        <Button className="act_btn">Add</Button>
                                      </Box>
                                    </TableCell>
                                  </TableRow> */}


                                          <TableRow
                                          >
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
                                        </>
                                      )}
                                    </TableBody>

                                    {isEditing && !isDeleting && (
                                      <TableRow>
                                        <TableCell
                                          style={{ paddingBottom: 0, paddingTop: 0 }}
                                          colSpan={4}
                                          className="collapsable_table edit_delete_collps">
                                          <Collapse in={open} timeout={800} unmountOnExit>
                                            <Table aria-label="edit table">
                                              <TableBody>
                                                <TableRow>
                                                  <TableCell className="platform_val">
                                                    <Typography
                                                      variant="span"
                                                      component="span">
                                                      Company
                                                    </Typography>
                                                  </TableCell>
                                                  <TableCell className="platform_val">
                                                    <TextField
                                                      id="company"
                                                      placeholder="Enter company name"
                                                      value={formData.company}
                                                      onChange={(e) =>
                                                        handleInputChange(
                                                          "company",
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                  </TableCell>
                                                </TableRow>
                                                {companynameError && (
                                                  <Typography variant="body2" color="error">
                                                    {companynameError}
                                                  </Typography>
                                                )}
                                                <TableRow>
                                                  <TableCell className="platform_val">
                                                    <Typography
                                                      variant="span"
                                                      component="span">
                                                      Conatct Name
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

                                                {contactnameError && (
                                                  <Typography variant="body2" color="error">
                                                    {contactnameError}
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
                                                  <Typography variant="body2" color="error">
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
                                                    <Typography variant="span" component="span">

                                                    </Typography>
                                                  </TableCell>
                                                  <TableCell className="platform_val submit_save">
                                                    <Box className="save_btn" style={{ display: 'flex', justifyContent: 'end' }}>
                                                      <Button className="act_btn" style={{ marginRight: 15 }} onClick={handleclientEdit}>
                                                        Save
                                                      </Button>
                                                      <Button className="act_btn cancle" onClick={handleCloseDel}>
                                                        Cancel
                                                      </Button>
                                                    </Box>
                                                  </TableCell>
                                                </TableRow>

                                              </TableBody>
                                            </Table>
                                          </Collapse>
                                        </TableCell>


                                      </TableRow>
                                    )}
                                    {isDeleting && (
                                      <TableRow>
                                        <TableCell
                                          style={{ paddingBottom: 0, paddingTop: 0 }}
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
                                                <TableCell className="platform_val" style={{ width: '100%' }}>
                                                  <Typography
                                                    variant="span"
                                                    component="span"
                                                    className="deleting"
                                                    >
                                                    You want to delete {formData.username}
                                                  </Typography>
                                                </TableCell>
                                                <TableCell className="platform_val"  >
                                                  <Box className="actions">
                                                    <Button
                                                      className="act_btn delete"
                                                      onClick={handleOnDelete}>
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
                                    )}
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
          {clients.length > perPage && (
            <Box className="navigation bottom">
              <Button
                className="navig_buttn"
                disabled={currentPage === 1}
                onClick={handlePrevPage}>
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
                disabled={currentPage === totalPages}
                onClick={handleNextPage}>
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
            name="company"
            label="Company"
            type="text"
            fullWidth
            variant="outlined"
            value={newAccountData.company}
            onChange={handleNewAccountChange}
          />
          {companynameAccError && (
            <Typography variant="body2" color="error">
              {companynameAccError}
            </Typography>
          )}
          <TextField
            margin="dense"
            name="Name"
            label="Contact Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newAccountData.Name}
            onChange={handleNewAccountChange}
          />
          {contactnameAccError && (
            <Typography variant="body2" color="error">
              {contactnameAccError}
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
