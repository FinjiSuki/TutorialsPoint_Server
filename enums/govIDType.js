// const govtIdTypeEnum = Object.freeze({
//     0:"Aadhaar_Card",
//     1:"PAN_Card",
//     2:"Voter_ID",
//     3:"Driving_License_Number",
//     4:"Electricity_Bill_Number",
//     5:"Ration_Card"
// })

const govtIdTypeEnum = {
    values: ["Aadhaar_Card","PAN_Card","Voter_ID","Driving_License_Number","Electricity_Bill_Number","Ration_Card"],
    message: 'Govt ID Type must be any among "Aadhaar_Card","PAN_Card","Voter_ID","Driving_License_Number","Electricity_Bill_Number","Ration_Card"'
};

module.exports = govtIdTypeEnum