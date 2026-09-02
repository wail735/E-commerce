import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Link, useNavigate } from 'react-router-dom';

const SOCKET_URL = import.meta.env.VITE_API_URL + '';

export default function NotificationBell() {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 1. Initialiser le Socket.io et écouter
  useEffect(() => {
    if (!user || !token) return;

    // Charger les notifications existantes
    fetchNotifications();

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Rejoindre sa propre salle pour recevoir ses notifications
    newSocket.emit('join_user_room', user._id || user.id);

    newSocket.on('new_notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => newSocket.close();
  }, [user, token]);

  // 2. Gérer la fermeture au clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/notifications?limit=10', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.data?.notifications || res.data.notifications || []);
      setUnreadCount(res.data.data?.unreadCount || res.data.unreadCount || 0);
    } catch (err) {
      console.error("Erreur de chargement des notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id, link) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      setIsOpen(false);
      if (link) {
        navigate(link);
      }
    } catch (err) {
      console.error("Erreur de marquage comme lu:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(import.meta.env.VITE_API_URL + '/api/v1/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Erreur read-all:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton Cloche */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white dark:border-gray-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden origin-top-right">
          
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
            <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-[#FF4D20] font-medium hover:underline flex items-center gap-1"
              >
                <Check size={14} /> Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#FF4D20]" /></div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                Aucune notification pour le moment.
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map(notif => (
                  <div 
                    key={notif._id}
                    onClick={() => markAsRead(notif._id, notif.link)}
                    className={`p-4 border-b border-gray-50 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      notif.isRead ? 'opacity-70' : 'bg-blue-50/50 dark:bg-blue-900/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className={`text-sm ${notif.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white font-semibold'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-gray-400 mt-2 block">
                          {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-[#FF4D20] mt-1 shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-100 dark:border-gray-700 text-center bg-gray-50/50 dark:bg-gray-900/50">
            <Link 
              to="/profile/notifications" 
              className="text-sm text-gray-600 dark:text-gray-400 font-medium hover:text-[#FF4D20] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Voir toutes les notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
