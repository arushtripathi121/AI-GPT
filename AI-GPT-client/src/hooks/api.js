import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ai-gpt-chi.vercel.app/api/v1/gpt/'
})

export const googleAuth = (code) => api.get(`/google?code=${code}`)
