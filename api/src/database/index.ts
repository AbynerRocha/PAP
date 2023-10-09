import mongoose, { Schema } from "mongoose"
import env from "../env";

const connectUrl = process.env.CONNECT_URL_MONGODB ?? env.CONNECT_URL_MONGODB

mongoose.connect(connectUrl)

const db = mongoose.connection

db.on('error', async () => {
    console.error.bind(console, '[X] An error occurred when connecting to the database')

    setTimeout(() => {
        process.exit(1)
    }, 500)
});

db.once('open', () => {
    console.log("[√] Database connected DB: " + db.db.databaseName)
})

