import { apiRequest } from './api';
export const reviewService = {
    getReviews(productId) {
        return apiRequest(`/reviews/${productId}`);
    },
    createReview(productId, review, token) {
        return apiRequest(`/reviews/${productId}`, {
            method: 'POST',
            body: JSON.stringify(review),
        }, token);
    },
};
