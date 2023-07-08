const mongoose = require("mongoose")
const genderEnum = require("../enums/genderEnum")
const govtIdTypeEnum = require("../enums/govIDType")
const langEnums = require("../enums/languagesEnum")


const studentSchema = new mongoose.Schema({
    studentId:{type:Number,unique:true},
    name:{type:String,requied:[true,"Student Name is necessary"]},
    email:{type:String,required:[true,"Without email address no student can registered"],unique:true},
    password:{type:String,required:true},
    gender:{type:String,required:true,enum:genderEnum},
    dob:{type:Date,required:true},
    motherTongue:{type:String,required:true,enum:langEnums},
    mobileNumber:{type:String,required:true,unique:[true,"This Mobile Number is already registered with us!!!"]},
    govtIDType:{type:String,required:true,enum:govtIdTypeEnum},
    governmentIdentificationNumber:{type:String,required:true,unique:true}
},{timestamps:true})

studentSchema.pre("save",async function(next){
    if (!this.isNew) {
    return next();
    }

    const count = await Student.countDocuments()
    if(count == 0){
        console.log("You are seeing this log because, you are registering first student.")
        const idNumber = count + 1;
        // this.studentId = `STUDENT-${idNumber}`;
        this.studentId = idNumber;

        return next();
    }

    const stuObj = await Student.findOne().sort({ createdAt: -1 })

    // console.log("the last entered doc ID is: ",stuObj.studentId)

    const idNumber = Number(stuObj.studentId) +1;
    // this.studentId = `STUDENT-${idNumber}`;
    this.studentId = idNumber;

    return next();
})

const Student = mongoose.model('Student',studentSchema)

module.exports = Student