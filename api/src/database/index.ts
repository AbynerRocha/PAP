import mongoose, { Schema } from "mongoose"

const connectUrl = 'mongodb://app:test123@0.0.0.0:27017/'

mongoose.connect(connectUrl)

const db = mongoose.connection

db.on('error', console.error.bind(console, '[X] An error occurred when connecting to the database'));
db.once('open', () => {
    console.log("[√] Database connected DB: " + db.db.databaseName)
})

