const express = require("express")
const router = express.Router()
const {createCourse, getAllCourses} = require("../controllers/courseController")
const { updateIds } = require("../controllers/courseController")

router.route("/create").post(createCourse)

router.route("/getCourse").get(getAllCourses)
router.route("/getCourse/:id").get(getAllCourses)

// router.route("/update").get(updateIds)

module.exports = router