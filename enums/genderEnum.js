// const genderEnum = Object.freeze({
//     0:"female",
//     1:"male",
//     2:"others"
// })

const genderEnum = {
    values: ['female', 'male', 'other'],
    message: 'Gender must be either male, female or other'
};

module.exports = genderEnum