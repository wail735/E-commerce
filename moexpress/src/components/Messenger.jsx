import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Send, Search, Loader2, ArrowLeft, MessageSquare } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const SOCKET_URL = import.meta.env.VITE_API_URL + '';

export default function Messenger() {
  const { user, token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRoom = searchParams.get('room');
  const initialReceiverId = searchParams.get('receiverId');
  const initialReceiverName = searchParams.get('receiverName') || 'Nouveau Contact';

  const [conversations, setConversations] = useState([]);
  const [activeRoom, setActiveRoom] = useState(initialRoom || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [socket, setSocket] = useState(null);

  const messagesEndRef = useRef(null);

  // 1. Initialiser Socket.IO
  useEffect(() => {
    if (!user) return;
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    
    // Rejoindre sa propre salle pour recevoir tous les messages même sans ouvrir la room
    newSocket.emit('join_user_room', user._id || user.id);

    return () => newSocket.close();
  }, [user]);

  // 2. Fetch conversations (boîte de réception)
  useEffect(() => {
    fetchConversations();
  }, [token]);

  const fetchConversations = async () => {
    try {
      setLoadingRooms(true);
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data.data || []);
      
      // Si une room initiale est passée par URL mais n'est pas dans la liste (nouveau chat), l'ajouter temporairement
      if (initialRoom && !(res.data.data || []).find(c => c.roomId === initialRoom)) {
        setConversations(prev => [{
          roomId: initialRoom,
          otherUser: { _id: initialReceiverId, id: initialReceiverId, name: initialReceiverName },
          lastMessage: "Démarrez la conversation...",
          createdAt: new Date().toISOString()
        }, ...prev]);
      }
    } catch (err) {
      console.error("Erreur de récupération des conversations:", err);
    } finally {
      setLoadingRooms(false);
    }
  };

  // 3. Rejoindre la salle et charger l'historique quand activeRoom change
  useEffect(() => {
    if (!activeRoom || !socket) return;

    socket.emit('join_chat_room', activeRoom);

    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/chat/history/${activeRoom}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data.data || []);
        scrollToBottom();
      } catch (error) {
        console.error("Erreur historique:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();

    // Ecouter les nouveaux messages entrants pour cette room
    const handleNewMessage = (msg) => {
      if (msg.roomId === activeRoom) {
        setMessages(prev => [...prev, msg]);
        scrollToBottom();
      }
      // Actualiser la liste de gauche
      setConversations(prev => {
        const copy = [...prev];
        const idx = copy.findIndex(c => c.roomId === msg.roomId);
        if (idx >= 0) {
          copy[idx].lastMessage = msg.text;
          copy[idx].createdAt = msg.createdAt;
          // Mettre en haut
          const [item] = copy.splice(idx, 1);
          copy.unshift(item);
        } else {
          // Si nouvelle conv qui n'était pas dans la liste
          copy.unshift({
            roomId: msg.roomId,
            otherUser: msg.sender?._id === (user._id || user.id) ? msg.receiver : msg.sender,
            lastMessage: msg.text,
            createdAt: msg.createdAt
          });
        }
        return copy;
      });
    };

    socket.on('new_chat_message', handleNewMessage);

    return () => {
      socket.off('new_chat_message', handleNewMessage);
    };
  }, [activeRoom, socket, token, user]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom || !socket) return;

    // Déterminer le receiverId (l'autre utilisateur de la room)
    const currentConv = conversations.find(c => c.roomId === activeRoom);
    const receiverId = currentConv?.otherUser?._id;

    socket.emit('send_chat_message', {
      roomId: activeRoom,
      senderId: user._id || user.id,
      receiverId: receiverId,
      text: newMessage
    });

    setNewMessage('');
  };

  const activeConversationInfo = conversations.find(c => c.roomId === activeRoom);

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
      
      {/* Sidebar (Listes des conversations) */}
      <div className={`w-full md:w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50 dark:bg-gray-900 ${activeRoom ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF4D20] dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingRooms ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#FF4D20]" /></div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-20" />
              Aucune conversation
            </div>
          ) : (
            conversations.map((conv, i) => (
              <button
                key={conv.roomId || i}
                onClick={() => {
                  setActiveRoom(conv.roomId);
                  setSearchParams({ room: conv.roomId });
                }}
                className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-800 flex gap-3 items-start transition-colors ${
                  activeRoom === conv.roomId ? 'bg-blue-50 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50 bg-white dark:bg-gray-900'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF4D20] to-orange-400 shrink-0 flex items-center justify-center text-white font-bold text-lg">
                  {(conv.otherUser?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate">
                      {conv.otherUser?.name || 'Utilisateur inconnu'}
                    </h4>
                    <span className="text-[11px] text-gray-400">
                      {conv.createdAt ? new Date(conv.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {conv.lastMessage || '...'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-[#0B1120] ${!activeRoom ? 'hidden md:flex' : 'flex'}`}>
        {activeRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-4 bg-white dark:bg-gray-900">
              <button 
                onClick={() => {
                  setActiveRoom(null);
                  setSearchParams({});
                }} 
                className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4D20] to-orange-400 flex items-center justify-center text-white font-bold shrink-0">
                {(activeConversationInfo?.otherUser?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {activeConversationInfo?.otherUser?.name || 'Discussion'}
                </h3>
                {activeConversationInfo?.otherUser?.role === 'seller' && (
                  <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full font-medium">Boutique Pro</span>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-[#0B1120]">
              {loadingMessages ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#FF4D20]" /></div>
              ) : messages.map((msg, idx) => {
                const isMe = msg.sender?._id === (user._id || user.id) || msg.sender === (user._id || user.id);
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isMe 
                        ? 'bg-[#FF4D20] text-white rounded-tr-sm shadow-sm shadow-orange-500/20' 
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-tl-sm shadow-sm'
                    }`}>
                      <p className="text-[15px] whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      <span className={`text-[10px] block mt-1 text-right ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message..." 
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#FF4D20] dark:text-white"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 flex items-center justify-center bg-[#FF4D20] text-white rounded-xl shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <MessageSquare size={64} className="mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Vos Messages</h3>
            <p>Sélectionnez une conversation à gauche pour commencer à discuter.</p>
          </div>
        )}
      </div>

    </div>
  );
}
