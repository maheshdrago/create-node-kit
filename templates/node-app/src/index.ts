import express, {Request, Response} from "express";
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const DEV_SERVER_PORT = process.env.DEV_SERVER_PORT
const app = express()

app.use(cors())
app.use("/", (req:Request,res:Response) => {
    return res.json({
        "Hello": "World"
    })
})

app.listen(DEV_SERVER_PORT, ()=>{
    console.log("Server started on Port :", DEV_SERVER_PORT)
})


