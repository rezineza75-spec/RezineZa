export interface Article {
    id: number,
    title: string,
    description: string,
    price?: number | null;
    isAvailable: boolean,
    categoryId?: number | null
} 