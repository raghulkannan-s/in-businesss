import app from "./app";
import dotenv from "dotenv";
import { connectToDatabase } from "./database/db";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectToDatabase();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

