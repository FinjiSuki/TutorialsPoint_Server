const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const Student = require("../models/studentModel")

const registerStudent = asyncHandler(async (req,res)=>{
    const{name,email,password,dob,gender,motherTongue,mobileNumber,govtIDType,governmentIdentificationNumber} = req.body

    if(!name||!email||!password||!dob||!gender||!motherTongue||!mobileNumber||!govtIDType||!governmentIdentificationNumber){
        res.json(400)
        throw new Error("All fields are mandatory! Kindly recheck the request body")
    }

    const hashedPass = await bcrypt.hash(password,11)

    const stuObj = await Student.create({
        name,
        email,
        password:hashedPass,
        dob,
        gender,
        motherTongue,
        mobileNumber,
        govtIDType,
        governmentIdentificationNumber
    })

    
    res.json({response:"Student Registered Successfully!",createdStudent:stuObj})
    
    // res.json({message:"Welcome to student registration page"})
})

const bulkRegisterStudents = asyncHandler(async (req,res) => {
    const countOfStuBodiesinRequest = Object.keys(req.body).length;
    console.log("The countOfStuBodiesinRequest is: ",countOfStuBodiesinRequest)

    const createdStudentsArray = new Array();

    for(let i=0;i<countOfStuBodiesinRequest;i++){
        const{name,email,password,dob,gender,motherTongue,mobileNumber,govtIDType,governmentIdentificationNumber} = req.body[i]

        if(!name||!email||!password||!dob||!gender||!motherTongue||!mobileNumber||!govtIDType||!governmentIdentificationNumber){
            res.json(400)
            throw new Error("All fields are mandatory! Kindly recheck the request body")
        }

        const hashedPass = await bcrypt.hash(password,11)

        const singleStuObj = await Student.create({
            name,
            email,
            password:hashedPass,
            dob,
            gender,
            motherTongue,
            mobileNumber,
            govtIDType,
            governmentIdentificationNumber
        })

        createdStudentsArray.push(singleStuObj)
    }

    res.status(201).json({message:"Students(s) Registered Successfully.","Created Student(s)":createdStudentsArray})
})

const loginTheStudent = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;

    const stuObj = await Student.findOne({email})

    if(stuObj && (await bcrypt.compare(password,stuObj.password))){

        res.json({message:`Welcome to Student's Page ${stuObj.name}. You unique identification number with our platform is ${stuObj.studentId.substring(8)}`})

    }else{
        res.json({message:"Either the Email you entered is not yet registered with us or Password you had entered is incorrect"})
    }
})

const getAllStudents = asyncHandler(async (req,res)=>{
    if(!req.params.id){
        const studs = await Student.find()
        res.json({message:"Students !!! Assemble !!!!!",studs})
    }else{
        // const sId = "STUDENT-"+req.params.id
        const sId = req.params.id
        const stuObj = await Student.findOne({studentId:sId})

        if(!stuObj){
            res.json({message:`NO Student is available with the id: ${sId}`})
        }else{
            res.json({message:"Solo Student Record Is: ",stuObj})
        }
    }
})

const updateIds = asyncHandler(async (req,res)=>{
    // const allStuds = await Student.find();
  
    // for (let stu of allStuds) {
    //     stu.studentId = Int32Array() (stu.studentId);
    //   await stu.save();
    // }
    
    // res.json("process done.");
    const bulkOperations = [];
    const docs = await Student.find().exec();
    docs.forEach(document => {
        if (!isNaN(parseInt(document.studentId))) {
            bulkOperations.push({
              updateOne: {
                filter: { _id: document._id },
                update: { $set: { studentId: parseInt(document.studentId) } }
              }
            });
        }
      });

    Student.bulkWrite(bulkOperations, { ordered: false })

    
    res.json("process done.");
    
  })
  
module.exports = {registerStudent,bulkRegisterStudents,loginTheStudent,getAllStudents,updateIds}