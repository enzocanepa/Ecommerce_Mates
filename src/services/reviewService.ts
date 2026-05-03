import { apiRequest } from './api';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewInput {
  rating: number;
  comment: string;
}

interface ReviewsResponse {
  reviews: Review[];
}

export const reviewService = {
  getReviews(productId: number): Promise<ReviewsResponse> {
    return apiRequest<ReviewsResponse>(`/reviews/${productId}`);
  },

  createReview(productId: number, review: ReviewInput, token: string): Promise<Review> {
    return apiRequest<Review>(`/reviews/${productId}`, {
      method: 'POST',
      body: JSON.stringify(review),
    }, token);
  },
};
