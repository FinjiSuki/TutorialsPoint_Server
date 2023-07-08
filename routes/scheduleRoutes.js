const express = require("express")
const { doACourseStudentTutorRegistration, doBulkEnrollments,getAllEnrollments, testGetFunc } = require("../controllers/scheduleController")
const router = express.Router()


router.route("/enroll").post(doACourseStudentTutorRegistration)


router.route("/bulkEnroll").post(doBulkEnrollments)

router.route("/getAllEnrollmentsList").get(getAllEnrollments)

router.route("/testing").get(testGetFunc)
router.route("/testing/:id").get(testGetFunc)


module.exports = router