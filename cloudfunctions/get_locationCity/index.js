// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "location-demo01-4lqna"
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('location_city').get()
  } catch (err) {
    console.log(' 云函数调用失败 err ==>', err)
  }
}