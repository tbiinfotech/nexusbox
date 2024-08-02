import axios from "axios";

const paths = async (path, method, token, data, contentType) => {
  const url = import.meta.env.VITE_API_URL;
  return await axios({
    method: method,
    url: `${url}${path}`,
    data: data,
    headers: {
      authorization: "Bearer " + token,
      "Content-Type": `${contentType}`,
      "ngrok-skip-browser-warning": "true",
    },
  });
};

const apiPaths = {
  signIn: "/SignIn",
  resetPassword: "/ResetPassword",
  emailResetPassword: "/EmailResetPassword",
};

const login = (data) => {
  let contentType = "application/json";
  let response = paths(apiPaths.signIn, "post", "null", data, contentType);
  return response;
};

const changePassword = (tokenData, data) => {
  let contentType = "application/json";

  let response = paths(
    apiPaths.resetPassword,
    "post",
    tokenData,
    data,
    contentType
  );
  return response;
};

const emailChangePassword = (tokenData, data) => {
  let contentType = "application/json";

  let response = paths(
    apiPaths.emailResetPassword,
    "post",
    tokenData,
    data,
    contentType
  );
  return response;
};

export { login, emailChangePassword, changePassword };
