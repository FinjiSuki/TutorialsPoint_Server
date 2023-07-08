const asyncHandler = require("express-async-handler")
const Schedules = require("../models/scheduleModel")
const Courses = require("../models/courseModel")
const Students = require("../models/studentModel")
const Tutors = require("../models/tutorModel")


const doACourseStudentTutorRegistration = asyncHandler(async (req, res) => {
  const { courseId, tutorId, studentId } = req.body

  if (!courseId || !tutorId || !studentId) {
    res.status(400)
    throw new Error("All fields are mandatory!!!")
  }

  const schObj = await Schedules.create({
    courseId, tutorId, studentId
  })

  res.status(201)
  res.json({ message: "Enrollment was successful", schObj })
})

const doBulkEnrollments = asyncHandler(async (req, res) => {
  const count = Object.keys(req.body).length

  const createdSchedulesArray = new Array();

  for (let i = 0; i < count; i++) {
    const { courseId, tutorId, studentId } = req.body[i]

    if (!courseId || !tutorId || !studentId) {
      res.status(400)
      throw new Error("All fields are mandatory!!!")
    }

    const schObj = await Schedules.create({
      courseId, tutorId, studentId
    })

    createdSchedulesArray.push(schObj)

  }

  res.status(201)
  res.json({ message: "Bulk Enrollments is Done", createdSchedulesArray })
})

const getAllEnrollments = asyncHandler(async (req, res) => {
  const allEnrolls = await Schedules.find()
  res.json({ message: "All Exported Schdules are here for you!", allEnrolls })
})

const testGetFunc = asyncHandler(async (req, res) => {

  const allMatches = await Tutors.find({
    tutorId: {$in:await Schedules.aggregate([
      {
        $group: {
          _id: '$tutorId',
          RegStudsCnt: { $addToSet: '$studentId' }
        }
      },
      {
        $project: {
          _id: 1,
          StudentsCount: { $size: '$RegStudsCnt' }
        }
      },
      {
        $sort: {
          StudentsCount: -1
        }
      },
      {
        $project: {
          _id: 1
        }
      },
      {
        $limit: 3
      }
    ])} 
  });

  res.json({ ProgramFor: "WAP to get tutor details who teach max number of unique students?[scalable]", allMatches })


})

module.exports = { doACourseStudentTutorRegistration, doBulkEnrollments, getAllEnrollments, testGetFunc }