import type { Category } from './categories.interface';

export interface ArticleImage {
  id: number;
  url: string;
  publicId: string;
  isMain: boolean;    // true = image principale affichée en premier
  articleId: number;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  price: number | null;        
  isAvailable: boolean;         
  categoryId: number | null;    
  category: Category | null;    
  images: ArticleImage[];     
}