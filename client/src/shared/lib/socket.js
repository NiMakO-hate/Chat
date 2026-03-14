import { io } from 'socket.io-client';
import { getAccessToken } from './axiosInstance';

let socket;

function getSocketBaseUrl() {
  try {
    const url = new URL(import.meta.env.VITE_API_URL);
    url.pathname = '';
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return 'http://localhost:3000';
  }
}

export function getSocket() {
  if (!socket) {
    socket = io(getSocketBaseUrl(), {
      auth: { token: getAccessToken() },
      withCredentials: true,
    });
  }

  return socket;
}

