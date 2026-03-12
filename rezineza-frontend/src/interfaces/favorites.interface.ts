import type{ Article } from "./articles.interface";

export interface Favorite {
  id: number;
  createdAt: string;
  userId: string;
  articleId: number;
  article: Article;   // on inclut l'article car on le récupère avec include dans le back
}