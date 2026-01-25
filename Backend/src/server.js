import express from 'express';
import notesRoutes from './routes/notesRoutes.js';
import { connectDb } from './config/db.js';
import dotenv from 'dotenv';
import rateLimiter from './middleware/ratelimiter.js';
import cors from 'cors';
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();



//middleware
if (process.env.NODE_ENV !== "production") {
    app.use(
        cors({
            origin: "http://localhost:5173",
        })
    );
} else {
    app.use(cors()); // Allow all origins in production
}
app.use(express.json());   // this middelware will parse json data: req.body
app.use(rateLimiter);



// Simple middelware 
// app.use((req, res, next) => {
//     console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//     next();
// })

app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log('Server started on PORT:', PORT);
    });
})



