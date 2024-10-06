export interface Review {
  author_details: {
    name: string;
    username: string;
    avatar_path: string;
    rating: number;
  };
  author: string;
  content: string;
  created_at: string;
  showFullContent: boolean;
}
