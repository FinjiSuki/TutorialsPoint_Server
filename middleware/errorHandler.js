const {CONSTANTS} = require("../constants")

const errorHandler = (err,req,res,next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    //Best practise is not to display error stack trace while error triggered in production environment
    //try a condition that error stack only appear when app is running un development environment
    switch (statusCode) {
        case CONSTANTS.VALIDATION_ERROR:
            res.json({title:"Validation Error","HTTP Status Code": CONSTANTS.VALIDATION_ERROR,message: err.message,stackTrace:err.stack})
            break;
        case CONSTANTS.UNAUTHORIZED:
            res.json({title:"Unauthorized","HTTP Status Code": CONSTANTS.UNAUTHORIZED,message: err.message,stackTrace:err.stack})
            break;
        case CONSTANTS.FORBIDDEN:
            res.json({title:"Forbidden","HTTP Status Code": CONSTANTS.FORBIDDEN,message: err.message,stackTrace:err.stack})
            break;
        case CONSTANTS.NOT_FOUND:
            res.json({title:"Not Found","HTTP Status Code": CONSTANTS.NOT_FOUND,message: err.message,stackTrace:err.stack})
            break;
        case CONSTANTS.SERVER_ERROR:
            res.json({title:"Server Error","HTTP Status Code": CONSTANTS.SERVER_ERROR,message: err.message,stackTrace:err.stack})
            break;
        default:
            console.log("New Error triggered!")
            res.json({title:"New Error","HTTP Status Code": statusCode,message: err.message,stackTrace:err.stack})
            break;
    }
}

module.exports = errorHandler;