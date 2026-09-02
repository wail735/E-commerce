import React from 'react';
import { ShieldCheck, Info, FileText, Briefcase, HelpCircle, RefreshCcw, Handshake, Globe, Fingerprint, ExternalLink } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

const pageData = {
  en: {
    help: {
      title: 'Help Center',
      icon: HelpCircle,
      content: `Welcome to the MoExpress Help Center.\n\nOur dedicated support team is here to assist you 24/7. Whether you need help with an order, have questions about your account, or want to learn more about selling on MoExpress, we've got you covered.\n\n- **Track your order**: Go to "My Orders" in your profile.\n- **Open a dispute**: If your item hasn't arrived or isn't as described, you can open a dispute from the order details page.\n- **Contact us**: Click on the Contact Us link in the footer to send us a direct message.`
    },
    returns: {
      title: 'Returns & Refunds',
      icon: RefreshCcw,
      content: `Our Buyer Protection policy covers your purchases on MoExpress.\n\n**15-Day Return Policy**\nIf you are not satisfied with your purchase, you can return it within 15 days of delivery.\n\n**How to return an item:**\n1. Go to "My Orders" and select the item you wish to return.\n2. Click "Open Dispute" and select "Return Goods".\n3. Follow the instructions to ship the item back.\n4. Once the seller receives the item, your refund will be processed within 3-5 business days.`
    },
    about: {
      title: 'About Us',
      icon: Info,
      content: `MoExpress is your one-stop destination for everything you need.\n\nFounded with a vision to connect buyers and sellers globally, MoExpress offers millions of products across dozens of categories, from electronics and fashion to home decor and automotive parts.\n\n**Our Mission:**\nTo make commerce better for everyone by providing a secure, reliable, and user-friendly platform.`
    },
    careers: {
      title: 'Careers',
      icon: Briefcase,
      content: `Join the MoExpress Team!\n\nWe are constantly looking for talented and passionate individuals to join our growing team. If you love e-commerce, technology, and making an impact, we want to hear from you.\n\nCurrent open positions include:\n- Frontend Developer (React)\n- Backend Developer (Node.js)\n- Customer Support Specialist\n- Marketing Manager\n\nSend your resume to **careers@moexpress.com**.`
    },
    press: {
      title: 'Press Center',
      icon: Globe,
      content: `Welcome to the MoExpress Press Center.\n\nHere you can find our latest press releases, media kits, and company announcements.\nFor all press and media inquiries, please contact **press@moexpress.com**.\n\n*Latest News:* MoExpress launches new Pro Shop features for enhanced seller visibility!`
    },
    affiliate: {
      title: 'Affiliate Program',
      icon: Handshake,
      content: `Earn with MoExpress!\n\nJoin the MoExpress Affiliate Program and earn up to 10% commission on every successful referral.\n\n**Why join?**\n- High conversion rates\n- Millions of products to promote\n- Dedicated affiliate support\n- Monthly payouts\n\nTo apply, send an email to **affiliates@moexpress.com**.`
    },
    terms: {
      title: 'Terms of Service',
      icon: FileText,
      content: `By using MoExpress, you agree to these Terms of Service.\n\n**1. Account Responsibilities**\nYou are responsible for maintaining the confidentiality of your account credentials.\n\n**2. Prohibited Items**\nSellers are strictly forbidden from listing illegal, counterfeit, or hazardous materials.\n\n**3. Payments**\nAll payments are processed securely. MoCoins are non-refundable unless required by law.\n\n*(This is a simplified summary. The full legal terms apply.)*`
    },
    privacy: {
      title: 'Privacy Policy',
      icon: ShieldCheck,
      content: `Your privacy is important to us.\n\n**What we collect:**\n- Basic account information (Name, Email, Address)\n- Browsing and purchase history for personalized recommendations\n\n**How we use it:**\nTo process your orders, improve our platform, and communicate with you. We do not sell your personal data to third parties.`
    },
    cookies: {
      title: 'Cookie Policy',
      icon: Fingerprint,
      content: `MoExpress uses cookies to enhance your browsing experience.\n\n**Essential Cookies:** Required for the site to function (e.g., keeping you logged in).\n**Analytics Cookies:** Help us understand how you use the site so we can improve it.\n**Marketing Cookies:** Used to deliver relevant advertisements.\n\nYou can manage your cookie preferences in your browser settings.`
    },
    ip: {
      title: 'Intellectual Property',
      icon: ExternalLink,
      content: `MoExpress respects intellectual property rights.\n\nIf you believe a seller on our platform is infringing on your copyright or trademark, please submit an IP claim to **ip-protection@moexpress.com**.\n\nWe will promptly investigate and remove infringing listings in accordance with our IP Protection Policy.`
    }
  },
  fr: {
    help: {
      title: 'Centre d\'aide',
      icon: HelpCircle,
      content: `Bienvenue dans le centre d'aide MoExpress.\n\nNotre équipe de support dédiée est là pour vous assister 24h/24 et 7j/7. Que vous ayez besoin d'aide pour une commande, des questions sur votre compte, ou que vous souhaitiez en savoir plus sur la vente sur MoExpress, nous sommes là pour vous.\n\n- **Suivre votre commande** : Allez dans "Mes Commandes" dans votre profil.\n- **Ouvrir un litige** : Si votre article n'est pas arrivé ou ne correspond pas à la description, vous pouvez ouvrir un litige depuis la page de détails de la commande.\n- **Nous contacter** : Cliquez sur le lien Contactez-nous en bas de page pour nous envoyer un message direct.`
    },
    returns: {
      title: 'Retours & Remboursements',
      icon: RefreshCcw,
      content: `Notre politique de protection des acheteurs couvre vos achats sur MoExpress.\n\n**Politique de retour de 15 jours**\nSi vous n'êtes pas satisfait de votre achat, vous pouvez le retourner dans les 15 jours suivant la livraison.\n\n**Comment retourner un article :**\n1. Allez dans "Mes Commandes" et sélectionnez l'article que vous souhaitez retourner.\n2. Cliquez sur "Ouvrir un litige" et sélectionnez "Retourner des articles".\n3. Suivez les instructions pour renvoyer l'article.\n4. Une fois que le vendeur a reçu l'article, votre remboursement sera traité sous 3 à 5 jours ouvrables.`
    },
    about: {
      title: 'À Propos de Nous',
      icon: Info,
      content: `MoExpress est votre destination unique pour tout ce dont vous avez besoin.\n\nFondée avec la vision de connecter les acheteurs et les vendeurs du monde entier, MoExpress propose des millions de produits dans des dizaines de catégories, de l'électronique et la mode à la décoration intérieure et aux pièces automobiles.\n\n**Notre Mission :**\nRendre le commerce meilleur pour tous en fournissant une plateforme sécurisée, fiable et conviviale.`
    },
    careers: {
      title: 'Carrières',
      icon: Briefcase,
      content: `Rejoignez l'équipe MoExpress !\n\nNous sommes constamment à la recherche de personnes talentueuses et passionnées pour rejoindre notre équipe grandissante. Si vous aimez le e-commerce, la technologie et avoir un impact, nous voulons vous entendre.\n\nPostes actuellement ouverts :\n- Développeur Frontend (React)\n- Développeur Backend (Node.js)\n- Spécialiste du support client\n- Responsable Marketing\n\nEnvoyez votre CV à **careers@moexpress.com**.`
    },
    press: {
      title: 'Espace Presse',
      icon: Globe,
      content: `Bienvenue dans l'espace presse de MoExpress.\n\nVous trouverez ici nos derniers communiqués de presse, kits médias et annonces de l'entreprise.\nPour toutes les demandes de presse et de médias, veuillez contacter **press@moexpress.com**.\n\n*Dernières Nouvelles :* MoExpress lance de nouvelles fonctionnalités Boutique Pro pour une meilleure visibilité des vendeurs !`
    },
    affiliate: {
      title: 'Programme d\'Affiliation',
      icon: Handshake,
      content: `Gagnez de l'argent avec MoExpress !\n\nRejoignez le programme d'affiliation MoExpress et gagnez jusqu'à 10% de commission sur chaque parrainage réussi.\n\n**Pourquoi nous rejoindre ?**\n- Taux de conversion élevés\n- Des millions de produits à promouvoir\n- Support d'affiliation dédié\n- Paiements mensuels\n\nPour postuler, envoyez un e-mail à **affiliates@moexpress.com**.`
    },
    terms: {
      title: 'Conditions d\'Utilisation',
      icon: FileText,
      content: `En utilisant MoExpress, vous acceptez ces Conditions d'utilisation.\n\n**1. Responsabilités du compte**\nVous êtes responsable du maintien de la confidentialité des identifiants de votre compte.\n\n**2. Articles interdits**\nIl est strictement interdit aux vendeurs de proposer des articles illégaux, contrefaits ou dangereux.\n\n**3. Paiements**\nTous les paiements sont traités de manière sécurisée. Les MoCoins ne sont pas remboursables, sauf si la loi l'exige.\n\n*(Ceci est un résumé simplifié. L'intégralité des conditions légales s'applique.)*`
    },
    privacy: {
      title: 'Politique de Confidentialité',
      icon: ShieldCheck,
      content: `Votre vie privée est importante pour nous.\n\n**Ce que nous collectons :**\n- Informations de base du compte (Nom, Email, Adresse)\n- Historique de navigation et d'achat pour des recommandations personnalisées\n\n**Comment nous les utilisons :**\nPour traiter vos commandes, améliorer notre plateforme et communiquer avec vous. Nous ne vendons pas vos données personnelles à des tiers.`
    },
    cookies: {
      title: 'Politique des Cookies',
      icon: Fingerprint,
      content: `MoExpress utilise des cookies pour améliorer votre expérience de navigation.\n\n**Cookies essentiels :** Requis pour que le site fonctionne (ex: vous garder connecté).\n**Cookies analytiques :** Nous aident à comprendre comment vous utilisez le site afin de l'améliorer.\n**Cookies marketing :** Utilisés pour diffuser des publicités pertinentes.\n\nVous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.`
    },
    ip: {
      title: 'Propriété Intellectuelle',
      icon: ExternalLink,
      content: `MoExpress respecte les droits de propriété intellectuelle.\n\nSi vous pensez qu'un vendeur sur notre plateforme enfreint vos droits d'auteur ou votre marque, veuillez soumettre une réclamation IP à **ip-protection@moexpress.com**.\n\nNous enquêterons rapidement et supprimerons les annonces en infraction conformément à notre politique de protection de la propriété intellectuelle.`
    }
  },
  ar: {
    help: {
      title: 'مركز المساعدة',
      icon: HelpCircle,
      content: `مرحباً بك في مركز مساعدة MoExpress.\n\nفريق الدعم المخصص لدينا هنا لمساعدتك على مدار الساعة طوال أيام الأسبوع. سواء كنت بحاجة إلى مساعدة بشأن طلب، أو لديك أسئلة حول حسابك، أو ترغب في معرفة المزيد عن البيع على MoExpress، فنحن نوفر لك ما تحتاجه.\n\n- **تتبع طلبك**: اذهب إلى "طلباتي" في ملفك الشخصي.\n- **فتح نزاع**: إذا لم يصل العنصر الخاص بك أو لم يكن كما هو موصوف، يمكنك فتح نزاع من صفحة تفاصيل الطلب.\n- **اتصل بنا**: انقر فوق رابط اتصل بنا في التذييل لإرسال رسالة مباشرة إلينا.`
    },
    returns: {
      title: 'المرتجعات والمبالغ المستردة',
      icon: RefreshCcw,
      content: `تغطي سياسة حماية المشتري الخاصة بنا مشترياتك على MoExpress.\n\n**سياسة إرجاع لمدة 15 يوماً**\nإذا لم تكن راضياً عن عملية الشراء، فيمكنك إعادتها في غضون 15 يوماً من التسليم.\n\n**كيفية إرجاع عنصر:**\n1. اذهب إلى "طلباتي" وحدد العنصر الذي ترغب في إرجاعه.\n2. انقر فوق "فتح نزاع" وحدد "إرجاع البضائع".\n3. اتبع التعليمات لشحن العنصر مرة أخرى.\n4. بمجرد أن يتلقى البائع العنصر، سيتم معالجة المبلغ المسترد في غضون 3-5 أيام عمل.`
    },
    about: {
      title: 'معلومات عنا',
      icon: Info,
      content: `MoExpress هي وجهتك الشاملة لكل ما تحتاجه.\n\nتأسست MoExpress برؤية لربط المشترين والبائعين على مستوى العالم، وتقدم ملايين المنتجات عبر العشرات من الفئات، من الإلكترونيات والأزياء إلى ديكور المنزل وقطع غيار السيارات.\n\n**مهمتنا:**\nلجعل التجارة أفضل للجميع من خلال توفير منصة آمنة وموثوقة وسهلة الاستخدام.`
    },
    careers: {
      title: 'الوظائف',
      icon: Briefcase,
      content: `انضم إلى فريق MoExpress!\n\nنحن نبحث باستمرار عن أفراد موهوبين وشغوفين للانضمام إلى فريقنا المتنامي. إذا كنت تحب التجارة الإلكترونية والتكنولوجيا وإحداث تأثير، فنحن نريد أن نسمع منك.\n\nالمناصب المفتوحة الحالية تشمل:\n- مطور واجهة أمامية (React)\n- مطور واجهة خلفية (Node.js)\n- أخصائي دعم العملاء\n- مدير تسويق\n\nأرسل سيرتك الذاتية إلى **careers@moexpress.com**.`
    },
    press: {
      title: 'المركز الإعلامي',
      icon: Globe,
      content: `مرحباً بك في المركز الإعلامي لـ MoExpress.\n\nهنا يمكنك العثور على أحدث بياناتنا الصحفية والمجموعات الإعلامية وإعلانات الشركة.\nلجميع الاستفسارات الصحفية والإعلامية، يرجى الاتصال بـ **press@moexpress.com**.\n\n*أحدث الأخبار:* MoExpress تطلق ميزات متجر Pro جديدة لتعزيز رؤية البائعين!`
    },
    affiliate: {
      title: 'برنامج التسويق بالعمولة',
      icon: Handshake,
      content: `اكسب مع MoExpress!\n\nانضم إلى برنامج التسويق بالعمولة لـ MoExpress واكسب عمولة تصل إلى 10٪ على كل إحالة ناجحة.\n\n**لماذا الانضمام؟**\n- معدلات تحويل عالية\n- ملايين المنتجات للترويج لها\n- دعم مخصص للشركات التابعة\n- دفعات شهرية\n\nللتقديم، أرسل بريداً إلكترونياً إلى **affiliates@moexpress.com**.`
    },
    terms: {
      title: 'شروط الخدمة',
      icon: FileText,
      content: `باستخدام MoExpress، فإنك توافق على شروط الخدمة هذه.\n\n**1. مسؤوليات الحساب**\nأنت مسؤول عن الحفاظ على سرية بيانات اعتماد حسابك.\n\n**2. العناصر المحظورة**\nيُحظر على البائعين تماماً إدراج مواد غير قانونية أو مزيفة أو خطرة.\n\n**3. المدفوعات**\nتتم معالجة جميع المدفوعات بشكل آمن. لا يمكن استرداد عملات MoCoins إلا إذا طلب القانون ذلك.\n\n*(هذا ملخص مبسط. تنطبق الشروط القانونية الكاملة.)*`
    },
    privacy: {
      title: 'سياسة الخصوصية',
      icon: ShieldCheck,
      content: `خصوصيتك مهمة بالنسبة لنا.\n\n**ما نجمعه:**\n- معلومات الحساب الأساسية (الاسم، البريد الإلكتروني، العنوان)\n- سجل التصفح والشراء للتوصيات المخصصة\n\n**كيف نستخدمها:**\nلمعالجة طلباتك وتحسين منصتنا والتواصل معك. نحن لا نبيع بياناتك الشخصية لأطراف ثالثة.`
    },
    cookies: {
      title: 'سياسة ملفات تعريف الارتباط',
      icon: Fingerprint,
      content: `تستخدم MoExpress ملفات تعريف الارتباط لتعزيز تجربة التصفح الخاصة بك.\n\n**ملفات تعريف الارتباط الأساسية:** مطلوبة لعمل الموقع (على سبيل المثال، إبقائك قيد تسجيل الدخول).\n**ملفات تعريف الارتباط التحليلية:** تساعدنا على فهم كيفية استخدامك للموقع حتى نتمكن من تحسينه.\n**ملفات تعريف الارتباط التسويقية:** تُستخدم لتقديم إعلانات ذات صلة.\n\nيمكنك إدارة تفضيلات ملفات تعريف الارتباط الخاصة بك في إعدادات متصفحك.`
    },
    ip: {
      title: 'الملكية الفكرية',
      icon: ExternalLink,
      content: `تحترم MoExpress حقوق الملكية الفكرية.\n\nإذا كنت تعتقد أن بائعاً على منصتنا ينتهك حقوق الطبع والنشر أو العلامة التجارية الخاصة بك، فيرجى إرسال مطالبة بالملكية الفكرية إلى **ip-protection@moexpress.com**.\n\nسنقوم بالتحقيق الفوري وإزالة القوائم المخالفة وفقاً لسياسة حماية الملكية الفكرية الخاصة بنا.`
    }
  }
};

export default function StaticPage({ pageKey }) {
  const { language } = useLanguage();
  const currentLang = language || 'fr';
  const data = pageData[currentLang][pageKey] || pageData['en'][pageKey];

  if (!data) return <div className="p-20 text-center">Page not found</div>;

  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
            <div className="w-14 h-14 bg-orange-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-[#FF4D20]">
              <Icon size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{data.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Dernière mise à jour : 23 Août 2026</p>
            </div>
          </div>
          
          <div className="prose prose-orange dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-[#FF4D20]">
            {data.content.split('\n').map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return <br key={i} />;
              if (trimmed.startsWith('- ')) return <li key={i} className="ml-4">{trimmed.substring(2)}</li>;
              if (trimmed.startsWith('**') && trimmed.endsWith('**')) return <h3 key={i} className="text-lg font-bold mt-6 mb-2 text-gray-800 dark:text-gray-200">{trimmed.replace(/\*\*/g, '')}</h3>;
              return <p key={i} className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">{trimmed}</p>;
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
