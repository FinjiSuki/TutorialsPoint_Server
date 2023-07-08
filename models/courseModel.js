const mongoose = require("mongoose")
const langEnums = require("../enums/languagesEnum")


const courseSchema = new mongoose.Schema({
    courseId:{
        type:Number,
        unique:true
    },
    name:{
        type:String,
        required:[true,"Course Name is necessary to identify what is this subject"],
        unique:true
    },
    description:{
        type:String,
        required:[true,"Proper course description is required to let people around know what it is about"]
    },
    maxStrength:{
        type:Number
    },
    startDate:{
        type:Date,
        required:[true,"People want to know when will course start"]
    },
    endDate:{
        type:Date,
        required:[true,"People want to know when will course end"]
    },
    taughtInLanguage:{
        type:String,
        required:true,
        enum:langEnums
    },
    modeOfTeaching:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    }
},{timestamps:true})


courseSchema.pre('save', async function(next) {
    if (!this.isNew) {
      return next();
    }
  
    const count = await Course.countDocuments()
    if(count == 0){
      console.log("You are seeing this log because, you are registering first course.")
      const idNumber = count + 350000;
    //   this.courseId = `COURSE-${idNumber}`;
      this.courseId = idNumber;
  
      return next();
    }

    const courseObj = await Course.findOne().sort({ createdAt: -1 })

    // console.log("the last entered doc ID is: ",tutObj.tutorId)

    const idNumber = Number(courseObj.courseId) +1;
    // this.courseId = `COURSE-${idNumber}`;
    this.courseId = idNumber;
  
    return next();
});


const Course = mongoose.model('Course',courseSchema)

module.exports = Course