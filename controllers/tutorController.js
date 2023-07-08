const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const Tutor = require("../models/tutorModel")
const jwt = require("jsonwebtoken")
const path = require("path")

const registrationProcess = asyncHandler(async (req, res) => {
  const { name, email, password, gender, motherTongue, dateOfBirth, mobileNumber, govtIDType, governmentIdentificationNumber } = req.body;
  //console.log("received details list are: ",name,email,password,gender,motherTongue,dateOfBirth,mobileNumber,govtIDType,governmentIdentificationNumber);

  if (!name || !email || !password || !gender || !motherTongue || !dateOfBirth || !mobileNumber || !govtIDType || !governmentIdentificationNumber) {
    res.status(400)
    throw new Error("All fields are mandatory!")
  }

  //Hashing the Password
  const hashedPass = await bcrypt.hash(password, 13);

  const creationTut = await Tutor.create({
    name,
    email,
    password: hashedPass,
    gender,
    motherTongue,
    dateOfBirth,
    mobileNumber,
    govtIDType,
    governmentIdentificationNumber
  })

  res.json({ response: "Creation successful", createdTutDetails: creationTut })
});

const loginTheTutorGET = asyncHandler(async (req, res) => {
  // res.send("<form action='/tutor/loginprocess' method='POST'><label for='email'>Email:</label><input type='text' id='email' name='email' required><br><br><label for='password'>Password:</label><input type='password' id='password' name='password' required><br><br><button type='submit'>Login</button></form>")
  const filePath = path.join(__dirname,'..', 'views', 'login.html');
  // console.log(filePath)
  res.sendFile(filePath);
});

const loginTheTutorPOST = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findTutor = await Tutor.findOne({ email })

  if (findTutor && (await bcrypt.compare(password, findTutor.password))) {

    // res.json({responseMessage:`Welcome onboard '${findTutor.name}'. You are succesfully logged in to Tutors Portal. Your ID is: ${findTutor.tutorId.substring(6)}`})

    //Redirect Approaches
    //1 Sending as query
    //res.redirect('/profile?tutObj='+findTutor)

    //2 Sending as 'POST' request itself and adding object to body
    // res.redirect(200,'/profile',{tutObj : findTutor})

    //creating an access token which is a timebound one
    const accessToken = jwt.sign({
      tutorInfo: {
        name: findTutor.name,
        email: findTutor.email,
        tutorId: findTutor.tutorId
      }
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });

    req.session.tutJWT = accessToken;

    //3 Sending a redirect request after initialising a session object
    req.session.currentTutObj = findTutor
    res.redirect('/tutor/profile')

    //res.redirect(200,'/current')

  } else {
    res.status(401)
    throw new Error("This Email Address OR Password is incorrect. Please check the details you entered.")
  }


})

const profilePage = asyncHandler(async (req, res) => {

  //1 Receiving from query
  // const tutorObj = req.query.tutObj
  // res.json({responseMessage:"Welcome to TUTOR'S PROFILE page",receivedResponse:tutorObj})

  //2 Receiving from body
  // const tutorObj = req.body.tutObj
  // res.json({responseMessage:"Welcome to TUTOR'S PROFILE page",receivedResponse:tutorObj})

  //3 Receiving from session object
  const currentTutorObj = req.session.currentTutObj
  // console.log(currentTutorObj)
  // req.session.currentTutObj = null
  const filePath = path.join(__dirname,'..', 'views', 'profile');
  res.render(filePath,currentTutorObj);
  // res.json({ responseMessage: "Welcome to TUTOR'S PROFILE page: ", receivedResponse: currentTutorObj })
})

const getAllTutors = asyncHandler(async (req, res) => {
  //console.log("Content Stored in params ID: ",req.params.id)
  if (!req.params.id) {
    const allTuts = await Tutor.find();
    // res.json({ message: "Successfully Retrived All Tutors", ListStartsHere: allTuts })
    const filePath = path.join(__dirname,'..', 'views', 'allTutors');
  res.render(filePath,{allTuts});
  } else {
    // const tutId = "TUTOR-"+req.params.id
    const tutId = req.params.id
    //console.log("Modified tutor id: ",tutId)
    const tutObj = await Tutor.findOne({ tutorId: tutId })

    if (!tutObj) {
      res.json({ message: `NO such tutor exists with this id ${tutId}` })
    } else {
      res.json({ message: "Tutor Details are: ", Details: tutObj })
    }

  }


})

const updateIds = asyncHandler(async (req, res) => {
  // const allTuts = await Tutor.find();

  // for (let tut of allTuts) {
  //   tut.tutorId = Number(tut.tutorId);
  //   await tut.save();
  // }

  const bulkOperations = [];
  const docs = await Tutor.find().exec();
  docs.forEach(document => {
    if (!isNaN(parseInt(document.tutorId))) {
      bulkOperations.push({
        updateOne: {
          filter: { _id: document._id },
          update: { $set: { tutorId: parseInt(document.tutorId) } }
        }
      });
    }
  });

  Tutor.bulkWrite(bulkOperations, { ordered: false })

  res.json("process done.");

})

module.exports = { registrationProcess, loginTheTutorGET,loginTheTutorPOST, profilePage, getAllTutors, updateIds }