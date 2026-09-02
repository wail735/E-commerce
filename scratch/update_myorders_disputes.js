import fs from 'fs';

const filePath = 'moexpress/src/pages/profile/MyOrders.jsx';
let c = fs.readFileSync(filePath, 'utf-8');

// Add imports
if (!c.includes('useLanguage')) {
  c = c.replace(/import { Loader2 } from 'lucide-react';/, "import { Loader2, Scale, X } from 'lucide-react';\nimport { useLanguage } from '../../context/LanguageContext';");
}

// Add state & functions
if (!c.includes('disputeModal')) {
  c = c.replace(/const \[error, setError\] = useState\(null\);/, 
    `const [error, setError] = useState(null);
  const { t } = useLanguage();
  const [disputeModal, setDisputeModal] = useState({ open: false, orderId: null });
  const [disputeForm, setDisputeForm] = useState({ reason: 'non_delivery', description: '' });
  const [submittingDispute, setSubmittingDispute] = useState(false);

  const handleOpenDispute = (orderId) => {
    setDisputeModal({ open: true, orderId });
    setDisputeForm({ reason: 'non_delivery', description: '' });
  };

  const submitDispute = async (e) => {
    e.preventDefault();
    try {
      setSubmittingDispute(true);
      await axios.post('http://localhost:5000/api/v1/disputes', {
        order: disputeModal.orderId,
        reason: disputeForm.reason,
        description: disputeForm.description
      }, { headers: { Authorization: \`Bearer \${token}\` } });
      setDisputeModal({ open: false, orderId: null });
      alert(t('dispute_opened') || 'Litige ouvert avec succès.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur lors de l\'ouverture du litige');
    } finally {
      setSubmittingDispute(false);
    }
  };`
  );
}

// Add the "Ouvrir un litige" button to delivered/shipped orders
c = c.replace(
  /<button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">\s*Voir Détails\s*<\/button>/g,
  `<button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      Voir Détails
                    </button>
                    {(order.status === 'delivered' || order.status === 'shipped') && (
                      <button 
                        onClick={() => handleOpenDispute(order._id)}
                        className="px-4 py-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center gap-1"
                      >
                        <Scale size={16} />
                        {t('open_dispute') || 'Ouvrir un Litige'}
                      </button>
                    )}`
);

// Add the Modal at the end of the return statement
if (!c.includes('submitDispute')) {
  // It's already included in the state, but we need the JSX
}
if (!c.includes('disputeModal.open')) {
  c = c.replace(
    /<\/div>\s*\);\s*};\s*export default MyOrders;/g,
    `
      {disputeModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Scale className="text-[#FF4D20]" />
                {t('open_dispute') || 'Ouvrir un Litige'}
              </h3>
              <button 
                onClick={() => setDisputeModal({ open: false, orderId: null })}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={submitDispute} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t('dispute_reason') || 'Motif'}</label>
                <select 
                  value={disputeForm.reason}
                  onChange={(e) => setDisputeForm({...disputeForm, reason: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#FF4D20]"
                >
                  <option value="non_delivery">{t('reason_non_delivery') || 'Article non reçu'}</option>
                  <option value="damaged">{t('reason_damaged') || 'Article endommagé'}</option>
                  <option value="wrong_item">{t('reason_wrong_item') || 'Mauvais article reçu'}</option>
                  <option value="defective">{t('reason_defective') || 'Article défectueux'}</option>
                  <option value="fraud">{t('reason_fraud') || 'Fraude / Activité suspecte'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{t('dispute_description') || 'Description du problème'}</label>
                <textarea 
                  required
                  rows="4"
                  value={disputeForm.description}
                  onChange={(e) => setDisputeForm({...disputeForm, description: e.target.value})}
                  placeholder="Expliquez le problème en détail..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#FF4D20]"
                ></textarea>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setDisputeModal({ open: false, orderId: null })}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('cancel_dispute') || 'Annuler'}
                </button>
                <button 
                  type="submit"
                  disabled={submittingDispute}
                  className="flex-1 px-4 py-3 bg-[#FF4D20] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submittingDispute && <Loader2 size={18} className="animate-spin" />}
                  {t('submit_dispute') || 'Soumettre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;`
  );
}

fs.writeFileSync(filePath, c);
console.log('MyOrders.jsx updated for disputes!');
