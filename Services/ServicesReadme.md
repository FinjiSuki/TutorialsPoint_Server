
# Tutorials Point database services


## Tutor Services :

> ### WAP to show all courses taught by the tutor by tutor ID?

``` js
// With 'asyncHandler' being used for the function, we needless to use try catch blocks way of error handling manually
let userReqID = req.params.id;
const allObjs = await Schedule.distinct("courseId",{tutorId : userReqID}, function(err, result) {
        err ? console.log(err) : console.log(result);
    });

res.json({ProgramFor:`WAP to show all courses taught by the tutor by tutor ID = ${userReqID}`,allObjs})
```

> ### WAP to show all the students who taught by the tutor by tutor ID?

```js
// With 'asyncHandler' being used for the function, we needless to use try catch blocks way of error handling manually
let userReqID = req.params.id;
    const allObjs = await Schedule.distinct("studentId",{tutorId : userReqID}, function(err, result) {
        err ? console.log(err) : console.log(result);
    });

    res.json({ProgramFor:`WAP to show all the students who taught by the tutor by tutor ID = ${userReqID}`,allObjs})
```

> ### WAP to show all the courses and students mapping who taught by the tutor by tutor ID?

``` js
let userReqID = req.params.id;
const allObjs = await Schedule.distinct("tutorId",{studentId : userReqID})

res.json({ProgramFor:`WAP to show all tutors who teach student by student ID = ${userReqID}`,allObjs})
```

> ### WAP to get tutor details who teach max number of unique students?
```js
 const allMatches = await Tutors.find({
    tutorId: {$in:await Schedules.aggregate([
      {
        $group: {
          _id: '$tutorId',
          RegStudsCnt: { $addToSet: '$studentId' }
        }
      },
      {
        $project: {
          _id: 1,
          StudentsCount: { $size: '$RegStudsCnt' }
        }
      },
      {
        $sort: {
          StudentsCount: -1
        }
      },
      {
        $project: {
          _id: 1
        }
      },
      {
        $limit: 3
      }
    ])} 
  });

  res.json({ ProgramFor: "WAP to get tutor details who teach max number of unique students?[scalable]", allMatches })

```

> ### WAP to get tutor details who teach max number of unique courses?
```js
const allMatches = await Tutors.find({
    tutorId: {$in:await Schedules.aggregate([
      {
        $group: {
          _id: '$tutorId',
          RegCourses: { $addToSet: '$courseId' }
        }
      },
      {
        $project: {
          _id: 1,
          CoursesCount: { $size: '$RegCourses' }
        }
      },
      {
        $sort: {
          CoursesCount: -1
        }
      },
      {
        $project: {
          _id: 1
        }
      },
      {
        $limit: 1
      }
    ])} 
  });

  res.json({ ProgramFor: "WAP to get tutor details who teach max number of unique courses?[scalable solution: top 3 courses or bottom 3 courses, like that]", allMatches })

```

> ### WAP to show all tutors whose mother tongue matches with among all students in Database?
```sql
select stu.studentId,stu.name,stu.MotherTongue,tut.TutorID,tut.FirstName,tut.MotherTongue 
from Students as stu join Tutors as tut on stu.motherTongue = tut.MotherTongue
```
``` js
const allMatches = await Tutors.aggregate([
    {
        $lookup:{
            from:'students',
            localField: 'motherTongue',
            foreignField: 'motherTongue',
            as:'student'
        }
    },
    // {
    //     $unwind:'$student' // Used this filter when you want all records to be in single object format
    // },
    {
        $project:{
            _id:0,
            'TutorID': '$tutorId',
            'TutorName': '$name',
            'TutorMotherTongue': '$motherTongue',
            'StudentID': '$student.studentId',
            'StudentName': '$student.name',
            'StudentMotherTongue': '$student.motherTongue'
        }
    },
    {
        $sort:{
            'createdAt':1
        }
    }
])

res.json({ProgramFor:"WAP to show all tutors whose mother tongue matches with among all students in Database?",allMatches})

```

> ### WAP to show all tutors whose mother tongue matches with their course registered students mother tongue?
``` sql
select distinct stu.studentId,stu.name,stu.MotherTongue,tut.TutorID,tut.FirstName,tut.MotherTongue from Schedules as sch join Students as stu on sch.studentId = stu.studentId join Tutors as tut on sch.TutorId = tut.TutorID
where stu.MotherTongue = tut.MotherTongue
```
``` js
  const allMatches = await Schedules.aggregate([
    {
        $lookup:{
            from:'students',
            localField: 'studentId',
            foreignField: 'studentId',
            as:'student'
        }
    },
    {
        $unwind:'$student' // Used this filter when you want all records to be in single object format
    },
    {
      $lookup:{
        from:'tutors',
        localField:'tutorId',
        foreignField:'tutorId',
        as:'tutor'
      }
    },
    {
      $unwind:'$tutor'
    },
    {
        $project:{
            _id:0,
            'studentId':1,
            'student.name':1,
            'student.motherTongue':1,
            'tutorId':1,
            'tutor.name':1,
            'tutor.motherTongue':1
            // 'ScheduleID': '$scheduleId',
            // 'StudentID': '$studentId',
            // 'StudentName': '$student.name',
            // 'StudentMotherTongue': '$student.motherTongue',
            // 'TutorID': '$tutorId',
            // 'TutorName': '$tutor.name',
            // 'TutorMotherTongue': '$tutor.motherTongue'
        }
    }
  ])

// To eliminiate similar objects which caused due to multiple students might have mapped with this combination
  const uniqueObjs = Array.from(new Set(allMatches.map(sinObj => JSON.stringify(sinObj)))).map(singleObj => JSON.parse(singleObj));

  let outputObjs = [];
    let allObjs = uniqueObjs;
    for(let eachObj of allObjs){
       if(eachObj.student.motherTongue == eachObj.tutor.motherTongue){
            outputObjs.push(eachObj)
       }
    }

  //   // res.json("Done.")
    console.log(Object.keys(outputObjs).length)

res.json({ProgramFor:"WAP to show all tutors whose mother tongue matches with their course registered students mother tongue?",outputObjs})
```


> ### WAP to show all tutors whose mother tongue matches with among all courses in Database?
```sql
select crs.CourseId,crs.CourseName,crs.TaughtInLanguage,tut.TutorID,tut.FirstName,tut.MotherTongue 
from Courses as crs join Tutors as tut on crs.TaughtInLanguage = tut.MotherTongue
```
``` js
const allMatches = await Tutors.aggregate([
    {
        $lookup:{
            from:'courses',
            localField: 'motherTongue',
            foreignField: 'taughtInLanguage',
            as:'matchedRows'
        }
    },
    //{
        //$unwind:'$matchedRows' // Used this filter when you want all records to be in single object format
    //},
    {
        $project:{
            _id:0,
            'TutorID': '$tutorId',
            'TutorName': '$name',
            'TutorMotherTongue': '$motherTongue',
            'CourseID': '$matchedRows.courseId',
            'CourseName': '$matchedRows.name',
            'TaughtInLanguage': '$matchedRows.taughtInLanguage',
        }
    },
    {
        $sort:{
            'createdAt':1
        }
    }
])

res.json({ProgramFor:"WAP to show all tutors whose mother tongue matches with among all courses in Database?",allMatches})

```

> ### WAP to show all tutors whose mother tongue matches with their courses language to teach which are registered by tutor?
``` sql
select sch.ScheduleId,crs.CourseId,crs.CourseName,crs.TaughtInLanguage,tut.TutorID,tut.FirstName,tut.MotherTongue from Schedules as sch join Courses as crs on sch.CourseId = crs.CourseId join Tutors as tut on sch.TutorId = tut.TutorID
where crs.TaughtInLanguage = tut.MotherTongue
```
``` js
const allMatches = await Schedules.aggregate([
    {
        $lookup:{
            from:'courses',
            localField: 'courseId',
            foreignField: 'courseId',
            as:'course'
        }
    },
    {
        $unwind:'$course' // Used this filter when you want all records to be in single object format
    },
    {
      $lookup:{
        from:'tutors',
        localField:'tutorId',
        foreignField:'tutorId',
        as:'tutor'
      }
    },
    {
      $unwind:'$tutor'
    },
    {
        $project:{
            _id:0,
            'courseId':1,
            'course.name':1,
            'course.taughtInLanguage':1,
            'tutorId':1,
            'tutor.name':1,
            'tutor.motherTongue':1
            // 'ScheduleID': '$scheduleId',
            // 'CourseID': '$courseId',
            // 'CourseName': '$course.name',
            // 'TaughtInLanguage': '$course.taughtInLanguage',
            // 'TutorID': '$tutorId',
            // 'TutorName': '$tutor.name',
            // 'TutorMotherTongue': '$tutor.motherTongue'
        }
    }
  ])

// To eliminiate similar objects which caused due to multiple students might have mapped with this combination
  const uniqueObjs = Array.from(new Set(allMatches.map(sinObj => JSON.stringify(sinObj)))).map(singleObj => JSON.parse(singleObj));

  let outputObjs = [];
    let allObjs = uniqueObjs;
    for(let eachObj of allObjs){
       if(eachObj.course.taughtInLanguage == eachObj.tutor.motherTongue){
            outputObjs.push(eachObj)
       }
    }

    // res.json("Done.")
    console.log(Object.keys(outputObjs).length)

res.json({ProgramFor:"WAP to show all tutors whose mother tongue matches with their courses language to teach which are registered by tutor?",outputObjs})
```


## Student Services :

> ### WAP to show all tutors who teach student by student ID?

``` js
let userReqID = req.params.id;
const allObjs = await Schedule.distinct("tutorId",{studentId : userReqID})

res.json({ProgramFor:`WAP to show all tutors who teach student by student ID = ${userReqID}`,allObjs})
```

> ### WAP to show all courses registered by a student by student ID?

``` js
let userReqID = req.params.id;
const allObjs = await Schedule.distinct("courseId",{studentId : userReqID})

res.json({ProgramFor:`WAP to show all courses registered by a student by student ID = ${userReqID}`,allObjs})
```

> ### WAP to show all the courses and tutors mapping who learned by the student by student ID?

``` js
let userReqID = req.params.id;
const allObjs = await Schedule.find({studentId : userReqID},{courseId:1,tutorId:1}).sort({courseId:1,tutorId:1})

res.json({ProgramFor:`WAP to show all the courses and tutors mapping who learned by the student by student ID = ${userReqID}`,allObjs})
```

> ### WAP to get All students who not registered in atleast one course?

``` js
const allStuds = await Students.find({
        studentId:{$nin: await Schedules.distinct("studentId")}
    })
    
res.json({ProgramFor:"WAP to get All students who not registered in atleast one course?",allStuds})
```

> ### WAP to get student details who registered in max number of unique courses?
```sql
const allMatches = await Students.find({
    studentId: {$in:await Schedules.aggregate([
      {
        $group: {
          _id: '$studentId',
          RegCourses: { $addToSet: '$courseId' }
        }
      },
      {
        $project: {
          _id: 1,
          CoursesCount: { $size: '$RegCourses' }
        }
      },
      {
        $sort: {
          CoursesCount: -1
        }
      },
      {
        $project: {
          _id: 1
        }
      },
      {
        $limit: 5
      }
    ])} 
  });

  res.json({ ProgramFor: "WAP to get student details who registered in max number of unique courses?[scalable solution: top 3 courses or bottom 3 courses, like that]", allMatches })

```

> ### WAP to get student details who taught by max number of unique tutors?
```js
const allMatches = await Students.find({
    studentId: {$in:await Schedules.aggregate([
      {
        $group: {
          _id: '$studentId',
          RegTutsCnt: { $addToSet: '$tutorId' }
        }
      },
      {
        $project: {
          _id: 1,
          TutorsCount: { $size: '$RegTutsCnt' }
        }
      },
      {
        $sort: {
          TutorsCount: -1
        }
      },
      {
        $project: {
          _id: 1
        }
      },
      {
        $limit: 5
      }
    ])} 
  });

  res.json({ ProgramFor: "WAP to get student details who taught by max number of unique tutors?[scalable solution: top 3 courses or bottom 3 courses, like that]", allMatches })

```

> ### WAP to show all students whose motherTongue matches among all courses taught in language of Whole database?

```sql
select * from Courses as crs join Students as stu on crs.TaughtInLanguage = stu.MotherTongue
```
```js
const allMatches = await Students.aggregate([
    {
      $lookup: {
        from: "courses",
        localField: "motherTongue",
        foreignField: "taughtInLanguage",
        as: "matchRows"
      }
    },
    // {
    //   $unwind: "$matchRows"
    // },
    {
        $project:{
            '_id':0,
            StudentId:"$studentId",
            StudentName:"$name",
            StudentLanguage:"$motherTongue",
            CourseId:"$matchRows.courseId",
            CourseName:"$matchRows.name",
            TaughtInLanguage:"$matchRows.taughtInLanguage"
        }
    },
    {
        $sort:{
            'createdAt':1
        }
    }
  ]);

res.json({ProgramFor:"WAP to show all students whose motherTongue matches among all courses taught in language of Whole database?",allMatches})

```

> ### WAP to show all students who get taught their enrolled courses in their mother tongue?
```sql
select distinct crs.CourseId,crs.CourseName,crs.TaughtInLanguage,stu.StudentID,stu.FirstName,stu.MotherTongue
from Schedules as sch join Courses as crs on sch.CourseId = crs.CourseId join Students as stu on sch.StudentId = stu.StudentID
where crs.TaughtInLanguage = stu.MotherTongue
```
```js
const allMatches = await Schedules.aggregate([
    {
      $lookup: {
        from: "courses",
        localField: "courseId",
        foreignField: "courseId",
        as: "course"
      }
    },
    {
      $unwind: "$course"
    },
    {
      $lookup:{
        from:'students',
        localField:'studentId',
        foreignField:'studentId',
        as:'student'
      }
    },
    {
      $unwind:'$student'
    },
    {
        $project:{
            '_id':0,
            'courseId':1 ,
            'course.name':1 ,
            'course.taughtInLanguage':1 ,
            'studentId':1 ,
            'student.name':1 ,
            'student.motherTongue':1 
            // ScheduleId:"$scheduleId",
            // CourseId:"$courseId",
            // CourseName:"$course.name",
            // TaughtInLanguage:"$course.taughtInLanguage",
            // StudentId:"$studentId",
            // StudentName:"$student.name",
            // StudentLanguage:"$student.motherTongue"
        }
    },
    {
        $sort:{
            'createdAt':1
        }
    }
  ]);

  const uniqueObjs = Array.from(new Set(allMatches.map(sinObj => JSON.stringify(sinObj)))).map(singleObj => JSON.parse(singleObj));

let outputObjs = [];
let allObjs = uniqueObjs;
for(let eachObj of allObjs){
   if(eachObj.student.motherTongue == eachObj.course.taughtInLanguage){
        outputObjs.push(eachObj)
   }
}

// // res.json("Done.")
console.log(Object.keys(outputObjs).length)
res.json({ProgramFor:"WAP to show all students who get taught their enrolled courses in their mother tongue?",outputObjs})

```

> ### WAP to show all students whose mother tongue matches with all tutors mother tongue among whole DB?
``` sql
select distinct stu.studentId, stu.name, stu.motherTongue, tut.tutorId, tut.name, tut.motherTongue from Students as stu join Tutors as tut on stu.motherTongue = tut.motherTongue order by stu.studentId
```
``` js
const allMatches = await Students.aggregate([
    {
        $lookup:{
            from:'tutors',
            localField: 'motherTongue',
            foreignField: 'motherTongue',
            as:'matchedRows'
        }
    },
    //{
        //$unwind:'$matchedRows' // Used this filter when you want all records to be in single object format
    //},
    {
        $project:{
            _id:0,
            'StudentID': '$studentId',
            'StudentName': '$name',
            'StudentMotherTongue': '$motherTongue',
            'TutorID': '$matchedRows.tutorId',
            'TutorName': '$matchedRows.name',
            'TutorMotherTongue': '$matchedRows.motherTongue'
        }
    },
    {
        $sort:{
            'createdAt':1
        }
    }
])

res.json({ProgramFor:"WAP to show all students whose mother tongue matches with all tutors mother tongue?",allMatches})
```


> ### WAP to show all students who get taught their enrolled courses teaching tutors' mother tongue?

``` js
const allMatches = await Schedules.aggregate([
        {
          $lookup: {
            from: "students",
            localField: "studentId",
            foreignField: "studentId",
            as: "student"
          }
        },
        {
          $unwind: "$student"
        },
        {
          $lookup: {
            from: "tutors",
            localField: "tutorId",
            foreignField: "tutorId",
            as: "tutor"
          }
        },
        {
          $unwind: "$tutor"
        },
        {
            $project:{
                '_id':0,
                'tutorId':1 ,
                'tutor.name':1 ,
                'tutor.motherTongue':1 ,
                'studentId':1 ,
                'student.name':1 ,
                'student.motherTongue':1 
                // ScheduleID:"$scheduleId",
                // TutorId:"$tutorId",
                // TutorName:"$tutor.name",
                // TutorLanguage:"$tutor.motherTongue",
                // StudentId:"$studentId",
                // StudentName:"$tutor.name",
                // StudentLanguage:"$tutor.motherTongue"
            }
        },
        {
            $sort:{
                'tutorId':1
            }
        }
      ]);

      const uniqueObjs = Array.from(new Set(allMatches.map(sinObj => JSON.stringify(sinObj)))).map(singleObj => JSON.parse(singleObj));

    let outputObjs = [];
    let allObjs = uniqueObjs;
    for(let eachObj of allObjs){
       if(eachObj.student.motherTongue == eachObj.tutor.motherTongue){
            outputObjs.push(eachObj)
       }
    }

    // res.json("Done.")
    console.log(Object.keys(outputObjs).length)
    res.json({ProgramFor:"WAP to show all students who get taught their enrolled courses teaching tutors' mother tongue?",outputObjs})
```

## Course Services :

> ### WAP to show all tutors who teach the course by course ID?

``` js
let userReqID = req.params.id;
const allObjs = await Schedule.distinct("tutorId",{courseId : userReqID})

res.json({ProgramFor:`WAP to show all tutors who teach the course by course ID = ${userReqID}`,allObjs})
```

> ### WAP to show all students who registered for the course by course ID?

``` js
let userReqID = req.params.id;
const allObjs = await Schedule.distinct("studentId",{courseId : userReqID})

res.json({ProgramFor:`WAP to show all students who registered for the course by course ID = ${userReqID}`,allObjs})
```

> ### WAP to show all the tutors and students mapping who registered for the course by course ID?

``` js
let userReqID = req.params.id;
const allObjs = await Schedule.find({courseId : userReqID},{tutorId:1,studentId:1}).sort({tutorId:1,studentId:1})

res.json({ProgramFor:`WAP to show all the tutors and students mapping who registered for the course by course ID = ${userReqID}`,allObjs})
```

> ### WAP to show all courses who have students < 6?
```sql
select CourseId,count(distinct StudentId) as 'RegistudsCount' from Schedules group by CourseId having count(distinct StudentId) < 7 order by 2 desc
```
```js
  const allMatches = await Schedules.aggregate([
    {
      $group: {
        _id: '$courseId',
        RegStudsCnt: { $addToSet: '$studentId' }
      }
    },
    {
      $project: {
        _id: 1,
        StudentsCount: { $size: '$RegStudsCnt' }
      }
    },
    {
      $match: {
        StudentsCount: { $lt: 10 }
      }
    },
    {
      $sort: {
        StudentsCount: -1
      }
    }
  ]);

  res.json({ ProgramFor: "WAP to show all courses who have registered students < 6?", allMatches })

```

> ### WAP to show all courses who have students > 6 and < 10 ?
```sql
select CourseId,count(distinct StudentId) as 'RegistudsCount' from Schedules group by CourseId having count(distinct StudentId) between 6 and 10 order by 2 desc
```
```js
 const allMatches = await Schedules.aggregate([
    {
        $group: {
        _id: '$courseId',
        RegStudsCnt: { $addToSet: '$studentId' }
        }
    },
    {
        $project: {
        _id: 1,
        StudentsCount: { $size: '$RegStudsCnt' }
        }
    },
    {
        $match: {
        StudentsCount: { $gt: 6,$lte:10 }
        }
    },
    {
        $sort: {
        StudentsCount: -1
        }
    }
    ]);
    
    res.json({ ProgramFor: "WAP to show all courses who have students > 6 and < 10 ?", allMatches })
    
```

> ### WAP to get course details which have Zero students?

``` js
const allObjs = await Courses.find({
        courseId : {$nin: await Schedules.distinct("courseId")}
    })

res.json({ProgramFor:`WAP to get course details which have Zero students is: `,allObjs})
```

> ### WAP to get course details which has max number of unique students?[scalable interms of Courses and count of unique students]
```sql
select * from Courses where CourseId = (select Top 1 CourseId,count(distinct StudentId) as 'Students' from Schedules group by CourseId order by 2 desc)
```
```js
  const allMatches = await Courses.find({
    courseId: {$in:await Schedules.aggregate([
      {
        $group: {
          _id: '$courseId',
          RegStudsCnt: { $addToSet: '$studentId' }
        }
      },
      {
        $project: {
          _id: 1,
          StudentsCount: { $size: '$RegStudsCnt' }
        }
      },
      {
        $sort: {
          StudentsCount: -1
        }
      },
      {
        $project: {
          _id: 1
        }
      },
      {
        $limit: 2
      }
    ])} 
  });

  res.json({ ProgramFor: "WAP to get course details which has max number of unique students?[scalable solution: top 3 courses or bottom 3 courses, like that]", allMatches })

```

> ### WAP to get course details which is taught by max number of tutors?
```sql
select * from Courses where CourseId = (select top 1 CourseId,count(distinct TutorId) as 'RegTuts' from Schedules group by CourseId order by 2 desc)
```
```js
  const allMatches = await Courses.find({
    courseId: {$in:await Schedules.aggregate([
      {
        $group: {
          _id: '$courseId',
          RegTutsCnt: { $addToSet: '$tutorId' }
        }
      },
      {
        $project: {
          _id: 1,
          TutorsCount: { $size: '$RegTutsCnt' }
        }
      },
      {
        $sort: {
          TutorsCount: -1
        }
      },
      {
        $project: {
          _id: 1
        }
      },
      {
        $limit: 2
      }
    ])} 
  });

  res.json({ ProgramFor: "WAP to get course details which is taught by max number of tutors?[scalable solution: top 3 courses or bottom 3 courses, like that]", allMatches })

```

> ### WAP to show all course whose taught in language matches among all students mother tongue among Whole database?

```sql
select * from Courses as crs join Students as stu on crs.TaughtInLanguage = stu.MotherTongue
```
```js
const allMatches = await Courses.aggregate([
    {
      $lookup: {
        from: "students",
        localField: "taughtInLanguage",
        foreignField: "motherTongue",
        as: "matchRows"
      }
    },
    // {
    //   $unwind: "$matchRows"
    // },
    {
        $project:{
            '_id':0,
            CourseId:"$courseId",
            CourseName:"$name",
            TaughtInLanguage:"$taughtInLanguage",
            StudentId:"$matchRows.studentId",
            StudentName:"$matchRows.name",
            StudentLanguage:"$matchRows.motherTongue"
        }
    },
    {
        $sort:{
            'createdAt':1
        }
    }
  ]);

res.json({ProgramFor:"WAP to show all course whose taught in language matches among all students mother tongue among Whole database?",allMatches})

```



> ### WAP to show all course whose taught in language matches among all its registered students mother tongue?
Same as "WAP to show all students who get taught their enrolled courses in their mother tongue?"



> ### WAP to show all course whose mother tongue matches with among all tutors in Database?
```sql
select crs.CourseId,crs.CourseName,crs.TaughtInLanguage,tut.TutorID,tut.FirstName,tut.MotherTongue 
from Courses as crs join Tutors as tut on crs.TaughtInLanguage = tut.MotherTongue
```
``` js
const allMatches = await Courses.aggregate([
    {
        $lookup:{
            from:'tutors',
            localField: 'taughtInLanguage',
            foreignField: 'motherTongue',
            as:'matchedRows'
        }
    },
    //{
        //$unwind:'$matchedRows' // Used this filter when you want all records to be in single object format
    //},
    {
        $project:{
            _id:0,
            'CourseID': '$courseId',
            'CourseName': '$name',
            'TaughtInLanguage': '$taughtInLanguage',
            'TutorID': '$matchedRows.tutorId',
            'TutorName': '$matchedRows.name',
            'TutorMotherTongue': '$matchedRows.motherTongue'
        }
    },
    {
        $sort:{
            'createdAt':1
        }
    }
])

res.json({ProgramFor:"WAP to show all course whose mother tongue matches with among all tutors in Database?",allMatches})
```

> ### WAP to show all course whose mother tongue matches with the tutors who teach this course?
Same as "WAP to show all tutors whose mother tongue matches with their courses language to teach which are registered by tutor?"

