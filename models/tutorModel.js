const mongoose = require("mongoose");
const genderEnum = require("../enums/genderEnum")
const langEnums = require("../enums/languagesEnum")
const govtIDTypeEnums = require("../enums/govIDType")

const tutorSchema = new mongoose.Schema({
    tutorId:{
        type:Number,
        unique:true
    },
  name: { type: String, required: [true, "Tutor name is a complusory field"] },
  email: { type: String, required: [true, "Without Email Address You Can't Login Or Register"], unique: true },
  password: { type: String, required: [true, "Password is required as a level for authentication"] },
  gender: { type: String, required: true, enum:genderEnum },
  motherTongue: { type: String, required: true,enum:langEnums },
  dateOfBirth: { type: Date, required: true },
  mobileNumber: { type: String, required: true },
  govtIDType: { type: String, required: true, enum:govtIDTypeEnums },
  governmentIdentificationNumber: { type: String, unique:true, required: [true, "This Identification Number is already used by another user"] }
}, { timestamps: true });

tutorSchema.pre('save', async function(next) {
    if (!this.isNew) {
      return next();
    }
  
    const count = await Tutor.countDocuments()
    if(count == 0){
      console.log("You are seeing this log because, you are registering first document.")
      const idNumber = count + 1000;
      // this.tutorId = `TUTOR-${idNumber}`;
      this.tutorId = idNumber;
  
      return next();
    }

    const tutObj = await Tutor.findOne().sort({ createdAt: -1 })

    // console.log("the last entered doc ID is: ",tutObj.tutorId)

    const idNumber = Number(tutObj.tutorId) +1;
    // this.tutorId = `TUTOR-${idNumber}`;
    this.tutorId = idNumber;
  
    return next();
  });

const Tutor = mongoose.model('Tutor', tutorSchema);
module.exports = Tutor;
