const express = require("express")
const { registrationProcess, loginTheTutorGET,loginTheTutorPOST, profilePage, getAllTutors, updateIds } = require("../controllers/tutorController")
const validateToken = require("../middleware/validateTokenHandler")
const router = express.Router()

router.route("/getTutor").get(getAllTutors)

router.route("/getTutor/:id").get(getAllTutors)

router.route("/register").post(registrationProcess)

router.route("/login").get(loginTheTutorGET).post(loginTheTutorPOST)
// router.route("/loginprocess").post(loginTheTutorPOST)

router.get("/profile",validateToken,profilePage)

router.route("/current").get((req,res)=>{
    res.json({Message:"I am from current user route"})
})

// router.route("/update").get(updateIds)

module.exports = router