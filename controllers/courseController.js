const asyncHandler = require("express-async-handler")
const Course = require("../models/courseModel")


const createCourse = asyncHandler(async (req,res)=>{
    const{name,description,maxStrength,startDate,endDate,taughtInLanguage,modeOfTeaching,location} = req.body

    if(!name||!description||!maxStrength||!startDate||!endDate||!taughtInLanguage||!modeOfTeaching||!location){
        res.status(400)
        throw new Error("All fields are mandatory! for course to get registered")
    }

    const courseObj = await Course.create({
        name,description,maxStrength,startDate,endDate,taughtInLanguage,modeOfTeaching,location
    })

    res.json({response:"Course Created Successfully!",createdCourse:courseObj})
    //res.json({message:"Welcome to course creation page"})
})


const getAllCourses = asyncHandler(async (req,res)=>{
    const idParam = req.params.id
    // console.log("Id param value is: ",idParam)
    if(!idParam){
        const coursObj = await Course.find()
        res.json({message:"Courses !! Assemble !!!",assembly:coursObj})
    }else{
        // const cId = "COURSE-"+idParam
        const cId = idParam
        const couObj = await Course.findOne({courseId:cId})

        if(!couObj){
            res.json({message:`NO such course exists with course Id as: ${cId}`})
        }else{
            res.json({message:"Course Details are: ",couObj})
        }
    }
})

const updateIds = asyncHandler(async (req,res)=>{
    // const allCrs = await Course.find();
  
    // for (let crs of allCrs) {
    //     crs.courseId = crs.courseId.substring(7);
    //   await crs.save();
    // }
    
    const bulkOperations = [];
    const docs = await Course.find().exec();
    docs.forEach(document => {
        if (!isNaN(parseInt(document.courseId))) {
            bulkOperations.push({
              updateOne: {
                filter: { _id: document._id },
                update: { $set: { courseId: parseInt(document.courseId) } }
              }
            });
        }
      });

    Course.bulkWrite(bulkOperations, { ordered: false })

    res.json("process done.");
    
  })

module.exports = {createCourse,getAllCourses,updateIds}