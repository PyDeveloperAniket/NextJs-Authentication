import mongoose, { mongo } from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection

        connection.on('connected', ()=>{
            console.log('MongoDB is connected');
        })

        connection.on('error', (err)=>{
            console.log('MongoDB connection error please make sure db is running up and running: ' + err);
            process.exit();            
        })
    } catch (error) {
        console.log("Something went wrong in connecting database");
        console.log(error);
        
    }
}