import express, { Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import categoriesRouter from "@/routes/categories.route";
import articlesRouter from "@/routes/articles.route";
import articleImagesRouter from "@/routes/articleImages.route";
import reviewsRouter from "@/routes/reviews.route";
import favoritesRouter from "@/routes/favorites.route";
import contactsRouter from "@/routes/contacts.route"; 

const app = express();
const PORT = 3000;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true,
}));

app.all("/api/auth/{*splat}", toNodeHandler(auth));

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Rezine'za API" });
});

app.use("/categories", categoriesRouter);
app.use("/articles", articlesRouter);
app.use("/articles", articleImagesRouter);
app.use("/reviews", reviewsRouter);
app.use("/favorites", favoritesRouter);
app.use("/contact", contactsRouter);

app.listen(PORT, async () => {
  console.log(`Server is running on port${PORT}`);
  try {
    await db.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});