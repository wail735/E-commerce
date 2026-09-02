import fs from 'fs';

const filePath = 'moexpress/src/data/translations.js';
let c = fs.readFileSync(filePath, 'utf-8');

const disputeTrans = {
  en: `    // Disputes
    my_disputes: "My Disputes",
    open_dispute: "Open a Dispute",
    dispute_reason: "Reason",
    dispute_description: "Description of the problem",
    dispute_evidence: "Evidence / Photos",
    dispute_status: "Dispute Status",
    dispute_opened: "Dispute opened successfully.",
    reason_fraud: "Fraud / Suspicious Activity",
    reason_non_delivery: "Item not received",
    reason_damaged: "Item arrived damaged",
    reason_wrong_item: "Wrong item received",
    reason_defective: "Defective item",
    status_open: "Open",
    status_under_review: "Under Review",
    status_resolved_refund: "Resolved (Refunded)",
    status_resolved_seller_paid: "Resolved (Seller Paid)",
    status_closed: "Closed",
    dispute_details: "Dispute Details",
    seller_response: "Seller Response",
    admin_decision: "Admin Decision",
    no_disputes: "You don't have any open disputes.",
    submit_dispute: "Submit Dispute",
    cancel_dispute: "Cancel",`,

  fr: `    // Disputes
    my_disputes: "Mes Litiges",
    open_dispute: "Ouvrir un Litige",
    dispute_reason: "Motif",
    dispute_description: "Description du problème",
    dispute_evidence: "Preuves / Photos",
    dispute_status: "Statut du Litige",
    dispute_opened: "Litige ouvert avec succès.",
    reason_fraud: "Fraude / Activité suspecte",
    reason_non_delivery: "Article non reçu",
    reason_damaged: "Article endommagé",
    reason_wrong_item: "Mauvais article reçu",
    reason_defective: "Article défectueux",
    status_open: "Ouvert",
    status_under_review: "En révision",
    status_resolved_refund: "Résolu (Remboursé)",
    status_resolved_seller_paid: "Résolu (Vendeur payé)",
    status_closed: "Fermé",
    dispute_details: "Détails du Litige",
    seller_response: "Réponse du Vendeur",
    admin_decision: "Décision de l'Admin",
    no_disputes: "Vous n'avez aucun litige en cours.",
    submit_dispute: "Soumettre le Litige",
    cancel_dispute: "Annuler",`,

  ar: `    // Disputes
    my_disputes: "نزاعاتي",
    open_dispute: "فتح نزاع",
    dispute_reason: "السبب",
    dispute_description: "وصف المشكلة",
    dispute_evidence: "الأدلة / الصور",
    dispute_status: "حالة النزاع",
    dispute_opened: "تم فتح النزاع بنجاح.",
    reason_fraud: "احتيال / نشاط مشبوه",
    reason_non_delivery: "لم يتم استلام المنتج",
    reason_damaged: "وصل المنتج تالفاً",
    reason_wrong_item: "استلام منتج خاطئ",
    reason_defective: "منتج معيب",
    status_open: "مفتوح",
    status_under_review: "قيد المراجعة",
    status_resolved_refund: "محلول (تم الاسترداد)",
    status_resolved_seller_paid: "محلول (تم الدفع للبائع)",
    status_closed: "مغلق",
    dispute_details: "تفاصيل النزاع",
    seller_response: "رد البائع",
    admin_decision: "قرار الإدارة",
    no_disputes: "ليس لديك أي نزاعات مفتوحة.",
    submit_dispute: "تقديم النزاع",
    cancel_dispute: "إلغاء",`
};

c = c.replace(/    view_all_reviews: "View All Reviews",/g, '    view_all_reviews: "View All Reviews",\n' + disputeTrans.en);
c = c.replace(/    view_all_reviews: "Voir tous les avis",/g, '    view_all_reviews: "Voir tous les avis",\n' + disputeTrans.fr);
c = c.replace(/    view_all_reviews: "عرض كل التقييمات",/g, '    view_all_reviews: "عرض كل التقييمات",\n' + disputeTrans.ar);

fs.writeFileSync(filePath, c);
console.log('Dispute translations injected!');
