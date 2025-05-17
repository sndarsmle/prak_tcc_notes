import express from "express";
import cors from "cors";
import NotesRouter from "./routers/NotesRouter.js";
import UserRouter from "./routers/UserRouter.js";
import "./models/Association.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: [
      "https://notes-frontend-ageng-dot-a-08-450504.uc.r.appspot.com",
      "http://localhost:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json()); 
app.use(cookieParser()); // Middleware untuk cookie
app.use(NotesRouter); 
app.use(UserRouter); // Menggunakan router user 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});