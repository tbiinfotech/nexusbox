let express = require("express");
const multer = require("multer");
const Joi = require("joi");

const router = express.Router();

/*** Middleware ***/
const authorize = require("../middleware/authorize");
const { validateLogin } = require("../middleware/validateRequest");

/*** Application Controllers ***/
const AuthController = require("./Controllers/AuthController");
const UserController = require("./Controllers/UserController");
const AlarmController = require("./Controllers/AlarmController");

console.log("server is running");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "public/uploads/audios";
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "public/uploads/videos"; // Adjust destination path for CSV files
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate filename based on original filename and timestamp
    const timestamp = Date.now();
    const filename = file.originalname;
    cb(null, `${timestamp}-${filename}`);
  },
});

const upload = multer({ storage: storage });
const uploadCSV = multer({ storage: csvStorage });

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

/*** Auth Routers ***/
router.post("/api/SignIn", validateLogin, AuthController.SignIn);
router.post("/api/SignUp", AuthController.SignUp);
router.post("/api/ForgetPassword", AuthController.ForgetPassword);
router.post("/api/ResetPassword", authorize(), AuthController.ResetPassword);
router.post(
  "/api/resetForgetPassword",
  authorize(),
  AuthController.ResetForgetPassword
);
router.post(
  "/api/EmailResetPassword",
  authorize(),
  AuthController.EmailResetPassword
);

/*** Super Admin ***/
router.post("/api/create-user", authorize(), UserController.createUser);
router.get("/api/get-user-by-role", authorize(), UserController.getUsersByRole);
router.put("/api/update-user/:id", authorize(), UserController.updateUser);
router.delete("/api/delete-user/:id", authorize(), UserController.deleteUser);
router.post(
  "/api/client-alert-message",
  authorize(),
  UserController.createClientAlert
);
router.post(
  "/api/update-client-alert-message",
  authorize(),
  UserController.updateClientAlert
);
router.get("/api/get-all-alert", authorize(), UserController.getALLAlerts);

router.post("/api/get-alert-by-id", authorize(), UserController.getIdBasedAlerts);


router.get("/api/get-all-user", authorize(), UserController.getALLUser);
router.put(
  "/api/update-user-developer/:id",
  authorize(),
  UserController.updateClientsDeveloper
);
router.get(
  "/api/get-user-developer/:id",
  authorize(),
  UserController.getUsersDeveloperById
);

router.post("/save-fcm-token", authorize(), UserController.savefcmtoken);

//AlarmController
router.post("/api/create-alarm", AlarmController.createAlarm);

router.post('/api/upload/:alarmId', upload.single('audioFile'), AlarmController.uploadAlarmSound);
router.get('/api/get-alarm/:userId', AlarmController.getAlarmsByUserId);

module.exports = router;
