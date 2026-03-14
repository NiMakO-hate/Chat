import { axiosInstance } from '../../shared/lib/axiosInstance';

export class MessageService {
    static async createMessage({ receiverId, content }){
        const response = await axiosInstance.post('/messages/create-message', { receiverId, content });
        return response.data;
    }

    static async getConversation({ otherUserId }){
        const response = await axiosInstance.get(`/messages/conversation/${otherUserId}`);
        return response.data;
    }

    static async markAsRead({ fromUserId }){
        const response = await axiosInstance.post(`/messages/mark-as-read/${fromUserId}`);
        return response.data;
    }
}