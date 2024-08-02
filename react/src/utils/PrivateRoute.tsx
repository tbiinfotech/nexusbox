import { useSelector } from "react-redux";
import Unauthorized from "../pages/unauthrized";
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { removeUser } from "../redux/userslice";
import { useDispatch } from "react-redux";

const PrivateRoute = ({ children, path }) => {
  const users = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, userInfo } = users;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      localStorage.clear();
      dispatch(removeUser());
      navigate("/Login", { replace: true });
    }
  }, [token, navigate, dispatch]);
  
  function isTokenExpired(token) {
    const expiration = getTokenExpiration(token);
    const currentTime = new Date().getTime() / 1000; 
  
    return expiration < currentTime;
  }
  
 
  function getTokenExpiration(token) {

    const decodedToken = decodeToken(token);
    return decodedToken.exp;
  }
  

  function decodeToken(token) {

    const decodedPayload = JSON.parse(atob(token?.split('.')[1]));
    return decodedPayload;
  }


  if (userInfo?.role !== "superadmin" && !isAuthenticated) {
    return <Unauthorized />;
  }

  return children;
};

export default PrivateRoute;
