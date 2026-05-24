import express, { Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

import categoriesRouter from "./routes/categories.route";
import articlesRouter from "./routes/articles.route";
import articleImagesRouter from "./routes/articleImages.route";
import reviewsRouter from "./routes/reviews.route";
import favoritesRouter from "./routes/favorites.route";
import contactsRouter from "./routes/contacts.route";
import siteImagesRouter from "./routes/siteImages.route";

const app: express.Express = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // 🔥 OBLIGATOIRE pour cookies
}));

app.use(express.json());

// Better-auth route
app.all("/api/auth/*", toNodeHandler(auth));

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