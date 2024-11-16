import app from './app';
import connectToDb from "./config/db";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
connectToDb().then(() => {
    app.listen(PORT, () => {
        console.log(`⚡Server started on port ${PORT}`);
    })
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
