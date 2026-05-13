import { apiRequest } from './api';

export const reviewService = {
    getReviews(productId) {
        return apiRequest(`/api/reviews/${productId}`);
    },
    createReview(productId, rating, comment, token) {
        return apiRequest('/api/reviews', {
            method: 'POST',
            body: JSON.stringify({ productId, rating, comment }),
        }, token);
    },
};
