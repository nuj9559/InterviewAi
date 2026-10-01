import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

const connectDb = async () => {
    try {
        const uri = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/ai_interview";

        await mongoose.connect(uri);
        console.log("DataBase Connected");
    } catch (error) {
        try {
            const localUri = "mongodb://127.0.0.1:27017/ai_interview";
            await mongoose.connect(localUri);
            console.log("DataBase Connected using local MongoDB");
        } catch (localError) {
            try {
                memoryServer = await MongoMemoryServer.create();
                await mongoose.connect(memoryServer.getUri());
                console.log("DataBase Connected using in-memory MongoDB");
            } catch (memoryServerError) {
                console.log(`DataBase Error ${error}`);
                console.log(`Local fallback Error ${localError}`);
                console.log(`In-memory fallback Error ${memoryServerError}`);
            }
        }
    }
};

export default connectDb;