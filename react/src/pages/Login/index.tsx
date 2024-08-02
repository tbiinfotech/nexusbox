import { Box, Button, TextField, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { login } from "../../utils/method";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import showEye from "../../assets/images/view.png";
import hideEye from "../../assets/images/hide.png";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/userslice";

export default function Login() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });
      const { token, user, success, message } = response.data;
      if (success) {
        dispatch(addUser(user));
        localStorage.setItem("token", token);
        toast.success(message, {
          duration: 2000,
        });
        if (user?.role == "superadmin") {
          navigate("/Welcome");
        } else {
          toast.error("You are not authorized to this website", {
            duration: 2000,
          });
        }
      } else {
        toast.error(message, {
          duration: 2000,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        duration: 2000,
      });
    }
  };

  return (
    <>
      <Box
        id="login"
        sx={{ backgroundImage: `url(${"images/login-after.svg"})` }}>
        <Box className="login_flex">
          <Box className="one">
            <Box className="one_inner">
              <img src="images/login_logo.svg" />
              <Typography component="h2">Client Emergency</Typography>
            </Box>
          </Box>
          <Box className="two">
            <Box className="two_inner">
              <Typography component="h2">Log in</Typography>
              <TextField
                label="Email"
                placeholder="Insert email"
                error={!!errors.email}
                helperText={errors.email ? "*Email is required" : ""}
                {...register("email", { required: true })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment className="icon" position="start">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="10" fill="#29AAE1" />
                        <path
                          d="M5.5 9.5L9 13L14.5 7.5"
                          stroke="#EFEFEF"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                type={show ? "text" : "password"}
                label="Password"
                placeholder="Insert password"
                error={!!errors.password}
                helperText={errors.password ? "*Password is required" : ""}
                {...register("password", { required: true })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment className="icon" position="start">
                      <img
                        src={show ? hideEye : showEye}
                        alt="show/hide password"
                        onClick={() => setShow(!show)}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <Button className="login_btn" onClick={handleSubmit(onSubmit)}>
                Login
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
