import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';
import { Upload, Plus, X, Loader2, CheckCircle } from 'lucide-react';
import ProductCard from '../../components/ProductCard';

const categories = [
  'Électronique',
  'Mode & Vêtements',
  'Maison & Décoration',
  'Sport & Loisirs',
  'Beauté & Santé',
  'Alimentation',
  'Autre'
];

export default function SellerProductsPage() {
  const { token, user } = useAuth();
  const { t } = useLanguage();
  const [view, setView] = useState('list'); // 'list' | 'new'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (view === 'list' && user) {
      setFetching(true);
      const sellerId = user._id || user.id;
      axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products?seller=${sellerId}`)
        .then(res => {
          setProducts(res.data.data || []);
        })
        .catch(err => console.error("Erreur lors de la récupération des produits:", err))
        .finally(() => setFetching(false));
    }
  }, [view, user]);

  const [form, setForm] = useState({
    name: '',
    price: '',
    comparePrice: '',
    quantity: '',
    category: 'Électronique',
    brand: '',
    description: '',
  });

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      comparePrice: product.comparePrice || '',
      quantity: product.quantity,
      category: product.category || 'Électronique',
      brand: product.brand || '',
      description: product.description || '',
    });
    setPreviews(product.images?.map(img => img.url) || []);
    setFiles([]);
    setEditingProduct(product);
    setView('edit');
  };

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFiles = e => {
    const selected = Array.from(e.target.files);
    // Limite à 5 fichiers maximum au total
    const combinedFiles = [...files, ...selected].slice(0, 5);
    setFiles(combinedFiles);

    // Libération des anciens blobs pour éviter les fuites de mémoire
    previews.forEach(url => URL.revokeObjectURL(url));
    setPreviews(combinedFiles.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append('images', f));

      let res;
      if (view === 'edit') {
        res = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/products/${editingProduct._id || editingProduct.id}`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        res = await axios.post(import.meta.env.VITE_API_URL + '/api/v1/products', fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setSuccess(true);
      setForm({ name: '', price: '', comparePrice: '', quantity: '', category: 'Électronique', brand: '', description: '' });
      // Only revoke ObjectURLs created by URL.createObjectURL
      previews.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      setFiles([]);
      setPreviews([]);
      setEditingProduct(null);
      setTimeout(() => { setSuccess(false); setView('list'); }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du produit.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => (p._id || p.id) !== productId));
    } catch (err) {
      alert("Erreur lors de la suppression: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            {view === 'new' ? 'Ajouter un Produit' : view === 'edit' ? 'Modifier le Produit' : 'Mes Produits'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {view === 'new' ? 'Remplissez le formulaire pour publier votre produit' : view === 'edit' ? 'Mettez à jour les informations de votre produit' : 'Gérez votre catalogue de produits'}
          </p>
        </div>
        {view === 'list' ? (
          <button onClick={() => {
            setForm({ name: '', price: '', comparePrice: '', quantity: '', category: 'Électronique', brand: '', description: '' });
            setPreviews([]);
            setFiles([]);
            setEditingProduct(null);
            setView('new');
          }} className="flex items-center gap-2 px-5 py-2.5 bg-[#FF4D20] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
            <Plus size={18} /> Nouveau Produit
          </button>
        ) : (
          <button onClick={() => {
            setView('list');
            setEditingProduct(null);
          }} className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <X size={18} /> Annuler
          </button>
        )}
      </div>

      {view === 'list' && (
        fetching ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-[#FF4D20]" />
          </div>
        ) : products.length > 0 ? (
          <div className="flex flex-col gap-4">
            {products.map(product => (
              <div key={product._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900 transition-all gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shrink-0">
                    <img 
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/100'} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-[15px] line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-black text-gray-900 dark:text-white">${(product.price || 0).toFixed(2)}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                      <span>Stock: <span className="font-semibold text-gray-700 dark:text-gray-300">{product.quantity}</span></span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                      <span>Catégorie: {product.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 justify-between sm:justify-end border-t sm:border-0 border-gray-100 dark:border-gray-700 pt-3 sm:pt-0">
                  <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide ${
                    product.quantity > 0 
                      ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' 
                      : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                  }`}>
                    {product.quantity > 0 ? 'En stock' : 'Rupture'}
                  </span>
                  
                  <button 
                    onClick={() => handleEdit(product)}
                    className="px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-xl transition-colors">
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleDelete(product._id || product.id)}
                    className="px-4 py-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Aucun produit</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-5">Commencez par ajouter votre premier produit.</p>
            <button onClick={() => setView('new')} className="px-6 py-2.5 bg-[#FF4D20] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
              + Ajouter un produit
            </button>
          </div>
        )
      )}

      {(view === 'new' || view === 'edit') && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl text-green-700 dark:text-green-400 font-bold">
              <CheckCircle size={20} /> {view === 'edit' ? 'Produit mis à jour avec succès !' : 'Produit publié avec succès !'}
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Informations de base</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Nom du produit <span className="text-red-500">*</span></label>
                <input required name="name" value={form.name} onChange={handleChange} placeholder="Ex: iPhone 15 Pro Max 256GB" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#FF4D20] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Prix ($) <span className="text-red-500">*</span></label>
                <input required type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#FF4D20] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Prix barré ($) <span className="text-xs text-gray-400 font-normal">(Optionnel, pour promotions)</span></label>
                <input type="number" name="comparePrice" value={form.comparePrice} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#FF4D20] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Stock <span className="text-red-500">*</span></label>
                <input required type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="10" min="0" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#FF4D20] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Catégorie</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#FF4D20] transition-colors">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Marque</label>
                <input name="brand" value={form.brand} onChange={handleChange} placeholder="Ex: Samsung, Nike..." className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#FF4D20] transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description <span className="text-red-500">*</span></label>
                <textarea required name="description" value={form.description} onChange={handleChange} rows="4" placeholder="Décrivez votre produit en détail..." className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#FF4D20] transition-colors resize-none" />
              </div>
            </div>
          </div>

          {/* Section Photos (Correction de la carte manquante) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Photos du produit</h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 group">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                    <X size={20} />
                  </button>
                  {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-[#FF4D20] text-white px-1.5 py-0.5 rounded">Principale</span>}
                </div>
              ))}
              {previews.length < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF4D20] hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                  <Upload size={20} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400 mt-1">Ajouter</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-3">Max 5 photos. La première sera l'image principale.</p>
          </div>

          {error && <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm">{error}</div>}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={() => { setView('list'); setEditingProduct(null); }} className="px-6 py-2.5 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-[#FF4D20] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Publication...' : view === 'edit' ? 'Enregistrer les modifications' : 'Publier le produit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}