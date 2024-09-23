const mongoose = require('mongoose')

async function connectDb(){
    const connection_url = process.env.MONGODB_URL
    const DB_NAME = "Ecomm-bag"
    try {
        const connection = await mongoose.connect(`${connection_url}/${DB_NAME}`)
        console.log("connected to database ")
    } catch (error) {
        console.log("error occured while connecting")
    }
}

module.exports={connectDb}