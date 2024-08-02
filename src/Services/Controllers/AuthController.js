"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../../models/user");
const Role = require("../../../models/role");

const dns = require("dns");
const { getKey, verifyUsingDNS } = require("verify-domain");
const { promisify } = require("util");

const { SendEmail } = require("../../libs/Helper");
const { generateTempPassword } = require("../../../utills/authUtils");

const fs = require("fs");

const crypto = require("crypto");
const Joi = require("joi");

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports.SignIn = async (req, res, next) => {
  try {
    const { email, password ,fcm_token} = req.body;
console.log("req.body++++++",req.body)
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required!" });
    }

    // Find user by email
    const user = await User.findOne({
      where: { email },
    });

    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "Email or password is incorrect",
      });
    } else {
      const id = user.roleId;
      const role = await Role.findOne({
        where: { id },
      });

      console.log("role.name", role);
      // Generate JWT token
      const token = jwt.sign(
        { user_id: user.id, role: role.name },
        process.env.JWT_TOKEN_KEY,
        { expiresIn: "8h" }
      );

      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: role.name,
        company: user.company,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      // Send response with user details and token
     
      const response =   await User.update(
          { fcmToken: fcm_token },
          { where: { id: user.id } }
        );
      console.log("response++++",response)
      return res.status(200).json({
        user: userData,
        token,
        fcm_token,
        success: true,
        message: "Logged in successfully",
      });
    }
  } catch (error) {
    console.log("SignIn error -------", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.SignUp = async (req, res, next) => {
  const { username, email, phone, role, company, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    let userRole = await Role.findOne({ where: { name: role } });
    if (!userRole) {
      // Role doesn't exist, create it
      userRole = await Role.create({ name: role });
    }

    // Hash the password
    const saltRounds = 10; // Number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      phone,
      role,
      company,
      password: hashedPassword,
      roleId: userRole.id,
    });

    // Prepare user data to send in response
    const userData = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      company: newUser.company,
    };

    // Send response with user details
    return res.status(200).json({
      user: userData,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error in sign up:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.ForgetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    console.log(email);
    if (!email) {
      return res.status(400).send({ message: "email cannot be empty" });
    }
    const user = await User.findOne({ email });

    console.log("user");
    if (!user) {
      return res
        .status(200)
        .json({ message: "User not exist!", success: false });
    }

    if (user.role == "superadmin") {
      return res
        .status(200)
        .json({ message: "Something went wrong", success: false });
    }
    if (user.accountStatus == "InActive") {
      return res.status(200).json({
        message:
          "Your account Is deactivated.Please Check with your organisation",
        success: false,
      });
    }
    if (user.deleted_user == "Deleted") {
      return res
        .status(200)
        .json({ message: "Your account Is Deleted.", success: false });
    }

    // Generate reset token and expiry time
    // const resetToken = crypto.randomBytes(20).toString("hex");
    // const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save reset token and expiry to user document
    // user.resetPasswordToken = resetToken;
    // user.resetPasswordExpires = resetTokenExpiry;
    // Generate a temporary password

    let resetToken;
    if (user.role == "admin") {
      resetToken = jwt.sign(
        { user_id: user._id, role: "admin" },
        process.env.jwt_token_key,
        { expiresIn: "48h" }
      );
    }

    if (user.role == "user") {
      resetToken = jwt.sign(
        { user_id: user._id, role: "user" },
        process.env.jwt_token_key,
        { expiresIn: "48h" }
      );
    }

    const emailParameters = {
      user_email: email,
      verify_email_link: `${process.env.CLIENT_URL}/reset-email-password/${resetToken}/${user._id}`,
    };

    let emailTemplate = await promisify(fs.readFile)(
      `${appRoot}/src/Services/view/email-templates/forgetPassTemplate.html`,
      "utf8"
    );

    emailTemplate = emailTemplate.replace(
      /user_email|tempPassword|verify_email_link/gi,
      function (matched) {
        return emailParameters[matched];
      }
    );

    const mailOptions = {
      html: emailTemplate,
      to: email,
      subject: "Forget password reset link",
      from: `${process.env.SUPER_ADMIN_NAME} <${process.env.SUPER_ADMIN}>`,
      attachments: [
        {
          filename: "secureAZ.png",
          path: `${process.env.CLIENT_URL}/images/secureAZ.png`,
          cid: "secureAZ",
        },
      ],
    };

    await SendEmail(mailOptions);

    res.json({
      message: "Reset password email sent Successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.ResetForgetPassword = async (req, res, next) => {
  const { password, id } = req.body;

  console.log(password, id);
  if (!id || !password) {
    return res
      .status(400)
      .send({ message: "email and password cannot be empty" });
  }
  try {
    let newPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);

    const findEmail = await User.findById(id);

    if (findEmail) {
      const UpdatePassword = await User.findByIdAndUpdate(findEmail._id, {
        password: newPassword,
      });

      if (UpdatePassword) {
        return res.json({
          status: 200,
          success: true,
          message: "Password update successfully",
        });
      }
    } else {
      return res.json({
        status: 400,
        success: false,
        message: "User Not Found",
      });
    }
  } catch (error) {
    console.log("ResetPassword error -------", error);
    return res.json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

module.exports.ResetPassword = async (req, res, next) => {
  const { password, email, oldPassword } = req.body;

  console.log(password, email, oldPassword);
  if (!email || !password || !oldPassword) {
    return res
      .status(400)
      .send({ message: "email and password cannot be empty" });
  }
  try {
    var enPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    var oldEnPassword = bcrypt.hashSync(
      oldPassword,
      bcrypt.genSaltSync(10),
      null
    );

    const findEmail = await User.findOne({ email: email });
    const isPassword = await bcrypt.compare(oldPassword, findEmail.password);

    console.log("isPassword", isPassword);

    if (!isPassword) {
      return res.json({
        status: 400,
        success: false,
        message: "Incorrect old password",
      });
    }

    if (findEmail) {
      const { password, email } = req.body;
      const UpdatePassword = await User.findByIdAndUpdate(findEmail._id, {
        password: enPassword,
      });

      if (UpdatePassword) {
        return res.json({
          status: 200,
          success: true,
          message: "Password update successfully",
        });
      }
    } else {
      return res.json({
        status: 400,
        success: false,
        message: "User Not Found",
      });
    }
  } catch (error) {
    console.log("ResetPassword error -------", error);
    return res.json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

module.exports.EmailResetPassword = async (req, res, next) => {
  const { password, id, oldPassword } = req.body;

  console.log(password, id, oldPassword);

  // return res.send("ok")
  if (!id || !password || !oldPassword) {
    return res
      .status(400)
      .send({ message: "email and password cannot be empty" });
  }
  try {
    var enPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    var oldEnPassword = bcrypt.hashSync(
      oldPassword,
      bcrypt.genSaltSync(10),
      null
    );

    const findEmail = await User.findById(id);
    const isPassword = await bcrypt.compare(oldPassword, findEmail.password);

    console.log("isPassword", isPassword);

    if (!isPassword) {
      return res.json({
        status: 400,
        success: false,
        message: "wrong old password",
      });
    }

    if (findEmail) {
      const { password, email } = req.body;
      const UpdatePassword = await User.findByIdAndUpdate(findEmail._id, {
        password: enPassword,
      });

      if (UpdatePassword) {
        return res.json({
          status: 200,
          success: true,
          message: "Password update successfully",
        });
      }
    } else {
      return res.json({
        status: 400,
        success: false,
        message: "User Not Found",
      });
    }
  } catch (error) {
    console.log("ResetPassword error -------", error);
    return res.json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};
