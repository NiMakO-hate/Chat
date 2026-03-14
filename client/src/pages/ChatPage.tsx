import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ChatLayout } from '../app/ChatLayout';
import { MessageService } from '../entities/message/MessageService';
import { getAccessToken } from '../shared/lib/axiosInstance';

type OutletCtx = {
  user: any;
};

export function ChatPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useOutletContext<OutletCtx>();
  const currentUserId = Number(user?.id);
  const peerUserId = Number(userId);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const socketRef = useRef<any | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const appendMessage = (msg: any) => {
    setMessages((prev) => {
      if (!msg?.id) return [...prev, msg];
      if (prev.some((m) => String(m.id) === String(msg.id))) {
        return prev;
      }
      return [...prev, msg];
    });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  useEffect(() => {
    if (!userId || !user?.id) return;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await MessageService.getConversation({ otherUserId: userId });
        if (res.statusCode === 200) {
          const data = (res.data || []).map((m: any) => ({
            ...m,
            senderId: Number(m.senderId),
            receiverId: Number(m.receiverId),
          }));
          setMessages(data);
        } else {
          setError(res.message || 'Не удалось загрузить сообщения');
        }
      } catch {
        setError('Не удалось загрузить сообщения');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [userId, user?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!userId || !user?.id) return;

    let baseUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';
    if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);

    const token = getAccessToken();
    if (!token) return;

    const socket = io(baseUrl, {
      auth: { token },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 800,
      reconnectionDelayMax: 4000,
    });
    socketRef.current = socket;

    const normalize = (msg: any) => ({
      ...msg,
      senderId: Number(msg.senderId),
      receiverId: Number(msg.receiverId),
    });

    const handleSent = (raw: any) => {
      const msg = normalize(raw);
      const isCurrentDialogMessage =
        msg.senderId === currentUserId && msg.receiverId === peerUserId;
      if (isCurrentDialogMessage) {
        appendMessage(msg);
      }
    };

    const handleReceived = (raw: any) => {
      const msg = normalize(raw);
      const isCurrentDialogMessage =
        msg.senderId === peerUserId && msg.receiverId === currentUserId;
      if (isCurrentDialogMessage) {
        appendMessage(msg);
      }

      if (msg.senderId === peerUserId && msg.receiverId === currentUserId) {
        socket.emit('message:read', { fromUserId: peerUserId });
      }
    };

    const handleReadUpdate = (payload: { userId: string | number; fromUserId: string | number }) => {
      const readerId = Number(payload.userId);
      const fromUserId = Number(payload.fromUserId);

      setMessages((prev) =>
        prev.map((m) =>
          Number(m.senderId) === fromUserId && Number(m.receiverId) === readerId
            ? { ...m, isRead: true, readAt: m.readAt || new Date().toISOString() }
            : m
        )
      );
    };

    socket.on('message:sent', handleSent);
    socket.on('message:received', handleReceived);
    socket.on('message:read:update', handleReadUpdate);

    socket.on('connect', () => setIsSocketConnected(true));
    socket.on('disconnect', () => setIsSocketConnected(false));
    socket.on('connect_error', () => {
      setIsSocketConnected(false);
      setError('Проблема с realtime-соединением');
    });

    socket.emit('message:read', { fromUserId: peerUserId });

    return () => {
      socket.off('message:sent', handleSent);
      socket.off('message:received', handleReceived);
      socket.off('message:read:update', handleReadUpdate);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, user?.id]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !userId || !user?.id) return;

    const content = text.trim();
    setText('');

    if (socketRef.current) {
      socketRef.current.emit('message:send', {
        receiverId: peerUserId,
        content,
      });
    } else {
      MessageService.createMessage({ receiverId: peerUserId, content }).then((res) => {
        if (res.statusCode === 201 && res.data) {
          appendMessage({
            ...res.data,
            senderId: Number(res.data.senderId),
            receiverId: Number(res.data.receiverId),
          });
        }
      });
    }
  };

  return (
    <ChatLayout
      rightPane={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: '#ffffff',
            borderRadius: 10,
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
          }}
        >
          {!isSocketConnected && (
            <div style={{ padding: 8, background: '#fff7ed', color: '#9a3412', fontSize: 12 }}>
              Соединение realtime нестабильно, новые сообщения могут приходить с задержкой.
            </div>
          )}
          {error && (
            <div style={{ padding: 8, background: '#fef2f2', color: '#991b1b', fontSize: 12 }}>
              {error}
            </div>
          )}
          <div style={{ flex: 1, padding: 18, overflowY: 'auto', background: '#f8fafc' }}>
            {isLoading ? (
              <div style={{ color: '#6b7280' }}>Загрузка сообщений...</div>
            ) : messages.length === 0 ? (
              <div style={{ color: '#6b7280' }}>Пока нет сообщений. Напишите первое.</div>
            ) : (
              messages.map((m: any) => (
              <div
                key={m.id}
                style={{
                  marginBottom: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: Number(m.senderId) === currentUserId ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '10px 12px',
                    borderRadius: 14,
                    backgroundColor: Number(m.senderId) === currentUserId ? '#dbeafe' : '#ffffff',
                    color: '#111827',
                    wordBreak: 'break-word',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  {m.content}
                </div>
                <div style={{ marginTop: 4, display: 'flex', gap: 8 }}>
                  <small style={{ color: '#6b7280' }}>
                    {new Date(m.createdAt).toLocaleTimeString()}
                  </small>
                  {Number(m.senderId) === currentUserId && (
                    <small style={{ color: '#6b7280' }}>
                      {m.isRead ? 'прочитано' : 'не прочитано'}
                    </small>
                  )}
                </div>
              </div>
              ))
            )}
            <div ref={endRef} />
          </div>
          <form
            onSubmit={handleSend}
            style={{
              display: 'flex',
              padding: 12,
              gap: 8,
              borderTop: '1px solid #e5e7eb',
              background: '#ffffff',
            }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Напишите сообщение..."
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #d1d5db',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                border: '1px solid #2563eb',
                background: '#2563eb',
                color: '#ffffff',
                borderRadius: 10,
                padding: '10px 14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Отправить
            </button>
          </form>
        </div>
      }
    />
  );
}