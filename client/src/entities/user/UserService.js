import { axiosInstance } from '../../shared/lib/axiosInstance';

export class UserService {
    static async refreshTokens(){
        const response = await axiosInstance.get('/auth/refresh-token');
        return response.data;
    }
    static async signIn(email, password){
        const response = await axiosInstance.post('/auth/sign-in', { email, password });
        return response.data;
    }
    static async signUp(email, password, username){
        const response = await axiosInstance.post('/auth/sign-up', { email, password, username });
        return response.data;
    }
    static async signOut(){
        const response = await axiosInstance.post('/auth/sign-out');
        return response.data;
    }

    static async getUsers(){
        const response = await axiosInstance.get('/users');
        return response.data;
    }
}