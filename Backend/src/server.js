import express from 'express';
import notesRoutes from './routes/notesRoutes.js';
import { connectDb } from './config/db.js';
import dotenv from 'dotenv';
import rateLimiter from './middleware/ratelimiter.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;



//middleware
app.use(cors({
    origin: "http://localhost:5173",
    })
);
app.use(express.json());   // this middelware will parse json data: req.body
app.use(rateLimiter);



// Simple middelware 
// app.use((req, res, next) => {
//     console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//     next();
// })

app.use("/api/notes", notesRoutes);

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log('Server started on PORT:', PORT);
    });
})



