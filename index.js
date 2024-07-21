const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const exerciseModel = require('./exerciseModel')
const { json } = require('express/lib/response')
require('dotenv').config()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
const connectToDb = async ()=>{
  try{ 
     await mongoose.connect(process.env.KEY)
  } catch(err){
     console.log(err)
  }
 } 
 // test connection to db 
 const testConnectionToDb = async  ()=>{
 await connectToDb()
 await console.log(mongoose.connection.readyState)
 
 }
 //excute connection to db and see if connected successfully 
 
app.post('/api/users', async (req, res)=>{
 await testConnectionToDb()
  const userName = req.body.username
  const exerciseInstance = new exerciseModel({
    username: userName
  })
 await exerciseInstance.save()
  res.json({username:exerciseInstance.username, _id: exerciseInstance.id})
});
app.post('/api/users/:_id/exercises', async (req, res)=>{
  testConnectionToDb()
 
  const userDescription = req.body.description
  const userDuration = req.body.duration
  const userDate = req.body.date ? new Date(req.body.date).toDateString(): new Date().toDateString();
  const userId = req.params._id

  try{
 const foundExercise = await exerciseModel.findByIdAndUpdate(userId, {$push:{log:{description:userDescription,
  date: userDate,duration:+userDuration}}
},{ new: true, runValidators: true });
  

res.json({
  username: foundExercise.username,
  description:  userDescription,
  duration: +userDuration,
  date: userDate,
_id:foundExercise._id
})

}catch(err){
  res.send(err)
  console.log('catch', err)
}
})

app.get('/api/users/:_id/logs', async (req,res)=>{
  await testConnectionToDb()
const userId = req.params._id
const from=  new Date(req.query.from)
const to=  new Date(req.query.to)
const limit=  req.query.limit
//6697d6f6187de14e5290faee
const searchResult=await exerciseModel.find({_id:userId})
const filteredLog = searchResult[0].log.filter(x=>{
  const y = new Date(x.date)
  if(from != 'Invalid Date'&& to != 'Invalid Date' ){
    return y >= from  && y < to 
  }else if(from != 'Invalid Date'){
    return y >= from
  }else if(to !='Invalid Date'){
    return y < to 
  }
  return y
})
let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(limit,array.slice(0,limit))
res.json({
  _id: userId,
  username: searchResult[0].username,
  count: filteredLog.length,
  log: filteredLog.slice(0,limit)
})
})

app.get('/api/users', async (req,res)=>{
  await testConnectionToDb()
  const allUsers = await exerciseModel.find({},{_id:1, username:1})
  res.json(allUsers)
})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
