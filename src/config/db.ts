import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PROD_DB_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const DEV_MONGODB_URI = process.env.LOCAL_DATABASE_URI;

const getURI = (): string => {
    if (process.env.NODE_ENV === 'production') {
        return PROD_DB_URI;
    }
    return DEV_MONGODB_URI || PROD_DB_URI;
};

const connectToDb = async () => {
    try {
        await mongoose.connect(getURI());
        console.log("⚡Connected to database...")
    } catch (error) {
        console.log("MongoDB connection error: ", error)
        process.exit(1)
    }
}

export default connectToDb;