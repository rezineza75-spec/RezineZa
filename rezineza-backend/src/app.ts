import express, { Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth";
import categoriesRouter from "@/routes/categories.route";
import articlesRouter from "@/routes/articles.route";
import articleImagesRouter from "@/routes/articleImages.route";
import reviewsRouter from "@/routes/reviews.route";
import favoritesRouter from "@/routes/favorites.route";
import contactsRouter from "@/routes/contacts.route"; 
import siteImagesRouter from "@/routes/siteImages.route";
import * as Express from 'express';

const app: Express.Application = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true,
}));

app.all("/api/auth/{*splat}", toNodeHandler(auth));

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Rezine'za API" });
});

app.use("/api/categories", categoriesRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/articles", articleImagesRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/contact", contactsRouter);
app.use("/api/site-images", siteImagesRouter);

export default app;