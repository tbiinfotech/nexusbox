const bcrypt = require("bcrypt");
const User = require("../../../models/user");
const Task = require("../../../models/task");
const Alarm = require("../../../models/alarm");
const DeveloperAssignment = require("../../../models/userAssignment");
const Joi = require("joi");
const { SendEmail } = require("../../libs/Helper");
const { NotificationAdd } = require("./../../libs/Helper");
const path = require("path");
const { generateTempPassword } = require("../../../utills/authUtils");
const jwt = require("jsonwebtoken");

const tempPassword = generateTempPassword();
const password = bcrypt.hashSync(tempPassword, bcrypt.genSaltSync(10), null);

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
const fs = require("fs");
const CryptoJS = require("crypto-js");

const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const { promisify } = require("util");
const csv = require("csv-parser");

require("dotenv").config({
  path: __dirname + "/.env",
});

const Role = require("../../../models/role");
const { Op } = require("sequelize");

// const io = require('../../../socket');


const admin = require('firebase-admin');
const serviceAccount = require('../../../nexusappbuild-firebase-adminsdk-ukuio-c799c2d93d.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'nexusappbuild',
});

const sendNotification = async (fcmToken, title, body) => {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
module.exports.getUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.query;

    // Validate input
    if (!role) {
      return res.status(400).send({ message: "Role can not be empty!" });
    }

    // Find role by name
    const roleRecord = await Role.findOne({ where: { name: role } });
    if (!roleRecord) {
      return res.status(400).send({ message: "Role not found" });
    }

    // Fetch users by role
    const users = await User.findAll({
      where: { roleId: roleRecord.id },
    });

    return res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      users: users,
    });
  } catch (error) {
    console.log("Error while trying to fetch users by role:", error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    let { company, Name, email, phone, password, role } = req.body;
    console.log("req.body++++++", req.body);
    // Validate input
    if (!email || !Name || !phone || !role) {
      return res.status(400).send({ message: "Content can not be empty!" });
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: "Invalid email format" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Email already exists. Please try a different email.",
      });
    }

    // Find role by name
    const roleRecord = await Role.findOne({ where: { name: role } });
    if (!roleRecord) {
      return res.status(400).send({
        success: false,
        message: "Role not found.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create User
    const newUser = await User.create({
      username: Name,
      email,
      phone,
      company: company ? company : "",
      password: hashedPassword,
      roleId: roleRecord.id,
    });

    return res.status(200).send({
      success: true,
      message: "User has been created successfully",
    });
  } catch (error) {
    console.log("Error while trying to create user:", error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports.savefcmtoken = async (req, res, next) => {
  const { token, userId } = req.body;

  if (!token || !userId) {
    return res.status(400).json({ message: 'Token and userId are required' });
  }

  try {
    // Find user and update or create token
    const [user, created] = await User.upsert({
      id: userId,
      fcmToken: token
    });

    res.status(200).json({ message: 'Token saved successfully', user });
  } catch (error) {
    console.error('Error saving FCM token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { company, username, email, phone, password } = req.body;

    const existingUser = await User.findOne({
      where: {
        email: email,
        id: {
          [Op.ne]: id, // Exclude the current user's ID from the query
        },
      },
    });

    if (existingUser) {
      return res.status(400).send({ message: "Email already exists" });
    }

    // Find user by id
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (password !== "1234==*1") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update User
      user.username = username;
      user.email = email;
      user.phone = phone;
      user.company = company ? company : "",
        user.password = hashedPassword;
    } else {

      user.username = username;
      user.company = company ? company : "",
        user.email = email;
      user.phone = phone;
    }

    await user.save();

    return res.status(200).send({
      success: true,
      message: "Update successfully",
      user: user,
    });
  } catch (error) {
    console.log("Error while trying to update user:", error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports.updateClientsDeveloper = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { selectedDeveloper, selectedProjectManager, selectedServerStaff } =
      req.body;

    if (!selectedDeveloper || !selectedProjectManager || !selectedServerStaff) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
    }
    // Check if a UserAssignment record already exists for the userId
    let userAssignment = await DeveloperAssignment.findOne({
      where: {
        userId: id,
      },
    });

    if (!userAssignment) {
      // If no UserAssignment record exists, create a new one
      userAssignment = await DeveloperAssignment.create({
        userId: id,
        developerId: selectedDeveloper,
        projectManagerId: selectedProjectManager,
        serverStaffId: selectedServerStaff,
      });

      return res.status(200).send({
        success: true,
        message: "Added successfully",
        userAssignment,
      });
    }

    // If a UserAssignment record exists, update its fields
    userAssignment.developerId = selectedDeveloper;
    userAssignment.projectManagerId = selectedProjectManager;
    userAssignment.serverStaffId = selectedServerStaff;
    await userAssignment.save();

    return res.status(200).send({
      success: true,
      message: "Updated successfully",
      userAssignment,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate input
    if (!id) {
      return res.status(400).send({ message: "ID can not be empty!" });
    }

    // Find user by id
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Delete User
    await user.destroy();

    return res.status(200).send({
      success: true,
      message: "User has been deleted successfully",
    });
  } catch (error) {
    console.log("Error while trying to delete user:", error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

//saveusertestdetaisls///

module.exports.userLogoutStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user_detail = await User.findById({ _id: id });

    if (user_detail.role == "user") {
      await User.updateOne({ _id: user_detail._id }, { status: "InActive" });

      await UserActivity.updateOne(
        { userId: user_detail._id },
        { status: "InActive" }
      );
    }

    res.status(200).json({ message: "User logout status saved successfully" });
  } catch (error) {
    console.log("Error saving logout status:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving logout status" });
  }
};

module.exports.createClientAlert = async (req, res) => {
  try {
    const {
      role,
      description,
      clientId,
      developerId,
      projectManagerId,
      serverId,
    } = req.body;

    if (!description || !clientId) {
      return res
        .status(400)
        .json({ message: "Description, and role are required" });
    }


    // // Fetch developerId from DeveloperAssignment model
    const developerAssignment = await DeveloperAssignment.findOne({
      where: {
        userId: clientId,
      },
    });

    if (!developerAssignment) {
      console.error("No developer assignment found for client ID", clientId);
      return res.status(404).json({ message: "No developer assignment found" });
    }

    const task = await Task.create({
      description,
      clientId,
    });


    const developerID = developerAssignment.developerId;


    const user = await User.findOne({
      where: { id: developerID }
    });
    // // Emit a newAlert event to the Socket.IO server for the developer
    // io.to(`developer-${developerID}`).emit('newAlert', task);
   // Send notification if FCM token exists
   if (user?.fcmToken) {
    try {
      await sendNotification(user.fcmToken, 'New Task Alert', `A new task has been created: ${description}`);
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError);

    }
  }
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.updateClientAlert = async (req, res) => {
  try {
    const { taskid, developerId } = req.body;

    if (!taskid || !developerId) {
      return res
        .status(400)
        .json({ message: "taskid and developerId are required" });
    }

    const task = await Task.update(
      { status: "pickup", developerId: developerId },
      { where: { id: taskid } }
    );

    const updatedTask = await Task.findByPk(taskid);

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(201).json(updatedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// module.exports.getALLAlerts = async (req, res) => {
//   try {
//     const tasks = await Task.findAll({
//       include: [
//         { model: User, as: "Client", attributes: { exclude: ["password"] } },
//         { model: User, as: "Developer", attributes: { exclude: ["password"] } },
//         {
//           model: User,
//           as: "ProjectManager",
//           attributes: { exclude: ["password"] },
//         },
//         { model: User, as: "Server", attributes: { exclude: ["password"] } },
//       ],
//     });

//     res.status(201).json(tasks);
//   } catch (error) {
//     console.error("Error creating task:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

module.exports.getALLAlerts = async (req, res) => {

  try {

    // Fetch all alarms from the database
    const tasks = await Task.findAll({
      include: [
        { model: User, as: "Client", attributes: { exclude: ["password"] } },
        { model: User, as: "Developer", attributes: { exclude: ["password"] } },
        {
          model: User,
          as: "ProjectManager",
          attributes: { exclude: ["password"] },
        },
        { model: User, as: "Server", attributes: { exclude: ["password"] } },
      ],
      order: [['createdAt', 'DESC']],
    });


    // Send response with alarms data
    res.status(200).json({ success: true, alarms: tasks });
  } catch (error) {
    console.error("Error fetching alarms:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports.getIdBasedAlerts = async (req, res) => {
  const { Username, id } = req.body;

  try {
    console.log("User", Username)
    console.log("id", id)

    let tasks;
    if (Username == 'client') {
      tasks = await Task.findAll({
        where: { clientId: id },
        include: [
          { model: User, as: "Client", attributes: { exclude: ["password"] } },
          { model: User, as: "Developer", attributes: { exclude: ["password"] } },
          {
            model: User,
            as: "ProjectManager",
            attributes: { exclude: ["password"] },
          },
          { model: User, as: "Server", attributes: { exclude: ["password"] } },
        ],
        order: [['createdAt', 'DESC']],
      });
      res.status(200).json({ success: true, tasks });

    } else if (Username == 'developer') {
      const developerAssignment = await DeveloperAssignment.findAll({
        where: { developerId: id },
        attributes: ['userId'],
      });

      console.log("developerAssignment+++++", developerAssignment)

      const userIds = developerAssignment.map((assignment) => assignment.userId);
      console.log("userIds", userIds)

      const tasksPromises = userIds.map((userId) => {
        return Task.findAll({
          where: { clientId: userId },
          include: [
            { model: User, as: "Client", attributes: { exclude: ["password"] } },
            { model: User, as: "Developer", attributes: { exclude: ["password"] } },
            {
              model: User,
              as: "ProjectManager",
              attributes: { exclude: ["password"] },
            },
            { model: User, as: "Server", attributes: { exclude: ["password"] } },
          ],
          order: [['createdAt', 'DESC']],
        });
      });

      let tasks = await Promise.all(tasksPromises);
      console.log("tasks", tasks)

      // Flatten the tasks array
      tasks = tasks.flat();

      res.status(200).json({ success: true, tasks });


    }

    // Send response with tasks data
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports.getUsersDeveloperById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Fetch users by role
    const users = await DeveloperAssignment.findOne({
      where: { userId: id },
      include: [
        {
          model: User,
          as: 'Developer',
          attributes: ['username']
        },
        {
          model: User,
          as: 'ProjectManager',
          attributes: ['username']
        },
        {
          model: User,
          as: 'ServerStaff',
          attributes: ['username']
        }
      ]
    });

    if (!users) {
      return res.status(200).send({
        success: false,
        users: users,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      users: users,
    });
  } catch (error) {
    console.log("Error while trying to fetch users by role:", error);
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getALLUser = async (req, res) => {
  try {
    const user = await User.findAll();

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching alarms:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

async function sendWelcomeEmailToUser(email, userId) {
  try {
    let resetToken = jwt.sign(
      { user_id: userId, role: "user" },
      process.env.jwt_token_key,
      { expiresIn: "48h" }
    );

    const emailParameters = {
      user_email: email,
      verify_email_link: `${process.env.CLIENT_URL}/SuperAdmin/email-password-reset/${resetToken}/${userId}/${tempPassword}`,
    };

    let emailTemplate = await promisify(fs.readFile)(
      `${appRoot}/src/Services/view/email-templates/emailTemplate.html`,
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
      subject: "Welcome to Our Staff",
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
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
