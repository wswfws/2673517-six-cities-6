import {AxiosInstance} from 'axios';
import {Review} from '../components/widgets/reviews/review-types.ts';

export async function fetchComments(api: AxiosInstance, offerId: string) {
  const response = await api.get(`/comments/${offerId}`);
  return response.data as Review[];
}

export async function postComment(api: AxiosInstance, offerId: string, payload: { comment: string; rating: number }) {
  const response = await api.post(`/comments/${offerId}`, payload);
  return response.data as Review;
}
