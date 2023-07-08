const express = require("express")
const { registerStudent, bulkRegisterStudents, loginTheStudent, getAllStudents } = require("../controllers/studentController")
const { updateIds } = require("../controllers/studentController")
const router = express.Router()


router.route("/getStudent").get(getAllStudents)
router.route("/getStudent/:id").get(getAllStudents)

router.route("/register").post(registerStudent)
router.route("/bulkRegister").post(bulkRegisterStudents)

router.route("/login").post(loginTheStudent)

router.route("/profile").get()

// router.route("/update").get(updateIds)
module.exports = router