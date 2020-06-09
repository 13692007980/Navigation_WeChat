// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "location-demo01-4lqna"
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  try{
    return await db.collection('signdate').add({
      data: {
        _id: event._id,
        date: event.date,
        num: event.num
      }
    })
  }catch(err){
    console.log("调用失败",err)
  } 
}