import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Users, Search, Shield, Ban, CheckCircle, Loader2 } from 'lucide-react';
import Loader from '../../components/Loader';

export default function AdminUsers() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/v1/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data.users);
    } catch (error) {
      console.error("Erreur chargement utilisateurs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleToggleStatus = async (targetUserId) => {
    setActionLoading(`status-${targetUserId}`);
    try {
      await axios.put(import.meta.env.VITE_API_URL + '/api/v1/admin/users/toggle-status', 
        { userId: targetUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Erreur de changement de statut");
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeRole = async (targetUserId, newRole) => {
    setActionLoading(`role-${targetUserId}`);
    try {
      await axios.put(import.meta.env.VITE_API_URL + '/api/v1/admin/users/role', 
        { userId: targetUserId, role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Erreur de changement de rôle");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Users size={24} className="text-[#FF4D20]" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gérez les rôles, permissions et statuts d'accès de tous les membres.
          </p>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Rechercher (nom, email)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:border-[#FF4D20] outline-none transition-colors"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Utilisateur</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold">Rôle</th>
                <th className="px-6 py-4 font-semibold">Date d'inscription</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredUsers.map(u => (
                <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FF4D20] text-white flex items-center justify-center font-bold shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          {u.name} 
                          {u.isProShop && <Store size={14} className="text-purple-500" title="Boutique Pro" />}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.isActive 
                        ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' 
                        : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                    }`}>
                      {u.isActive ? <CheckCircle size={12} /> : <Ban size={12} />}
                      {u.isActive ? 'Actif' : 'Bloqué'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      disabled={u._id === currentUser._id || actionLoading === `role-${u._id}`}
                      value={u.role}
                      onChange={(e) => handleChangeRole(u._id, e.target.value)}
                      className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 outline-none disabled:opacity-50"
                    >
                      <option value="user">User</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                      <option value="superAdmin">SuperAdmin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      disabled={u._id === currentUser._id || actionLoading === `status-${u._id}`}
                      onClick={() => handleToggleStatus(u._id)}
                      className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 ${
                        u.isActive
                          ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20'
                          : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20'
                      }`}
                    >
                      {actionLoading === `status-${u._id}` ? <Loader2 size={14} className="animate-spin" /> : (u.isActive ? 'Bloquer' : 'Débloquer')}
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
