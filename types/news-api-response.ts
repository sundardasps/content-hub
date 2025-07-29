export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;  // ISO date string
  content: string | null;
}

export interface NewsApiResponse {
  status: string;       // e.g., "ok"
  totalResults: number;
  articles: Article[];
}
