const mongoose = require("mongoose")


const scheduleSchema = new mongoose.Schema({
    scheduleId:{type:Number,unique:true},
    courseId:{type:Number,required:true},
    tutorId:{type:Number,required:true},
    studentId:{type:Number,required:true}
},{timestamps:true})

scheduleSchema.pre('save', async function(next){
    if (!this.isNew) {
        return next();
    }

    const count = await Schedule.countDocuments()
    if(count == 0){
        //console.log("You are seeing this log because, you are enrolling first registration.")
        this.scheduleId = count + 120000;

        return next();
    }

    const schObj = await Schedule.findOne().sort({ createdAt: -1 })

    this.scheduleId = schObj.scheduleId +1;

    return next();
})

const Schedule = mongoose.model("Schedule",scheduleSchema)

module.exports = Schedule