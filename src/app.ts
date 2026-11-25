import "express-async-errors"; // forwards async errors to the error handler
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import postRoutes from "./routes/post.routes";
import commentRoutes from "./routes/comment.routes";

const app = express();
app.use(express.json());

app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/social_app")
  .then(() => app.listen(process.env.PORT || 3000, () => console.log("Server running")))
  .catch((e) => console.error("DB connection failed", e));
