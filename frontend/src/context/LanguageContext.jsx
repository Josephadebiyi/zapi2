import React, { createContext, useState, useContext } from 'react';

const translations = {
    en: {
        navInfo: { about: "About", why: "Why ZAPI", how: "How to Use", contact: "Contact", login: "Log In", getStarted: "Get Started" },
        hero: {
            badge: "AI-powered booking on WhatsApp",
            title1: "Capture more clients with",
            title2: "effortless WhatsApp booking.",
            subtitle: "ZAPI is the ultimate AI booking solution for service businesses. Launch your automated assistant in minutes and stop losing clients to clunky web forms.",
            cta: "Start for free today"
        },
        problem: {
            badge: "❌ The Problem",
            title: "Stop Losing Bookings to High-Friction Platforms",
            card1: "Clients abandon bookings when forced to download apps or navigate complex websites.",
            card2: "Playing phone-tag and waiting hours for confirmation disrupts the booking flow.",
            card3: "Every extra step costs you a client. High friction equals lost revenue.",
            solutionTitle: "Seamless Onboarding, Instant Results",
            solutionDesc: "Set up your business profile in minutes and let our AI handle the rest. ZAPI understands client intents, checks your calendar, and secures payments—all inside WhatsApp.",
            clientsTitle: "For Your Clients",
            clientsList: ["No waiting in queues", "Instant answers", "Simple workflows"],
            bizTitle: "For Your Business",
            bizList: ["Setup in minutes", "Stripe Direct Checkouts", "Zero missed appointments"]
        },
        pricing: {
            badge: "Plans",
            title: "Simple pricing designed to grow with your business",
            popular: "Most Popular",
            planName: "Platform",
            planDesc: "For growing salons, clinics, and service professionals. Complete automation.",
            mo: "/mo",
            tryFree: "Try Platform Free",
            features: ["✓ 500 bookings/mo", "✓ Custom Business Profile", "✓ Stripe Commission: 0%"],
            aiTitle: "AI Actions",
            aiDesc: "Turn rules into automated flows and capture exact intents.",
            intTitle: "Integrations",
            intDesc: "Connect seamlessly with Stripe Connect and Redis for lockouts."
        },
        footer: {
            tagline: "Start Delivering Smarter Support Today",
            getStarted: "Get Started Free",
            demo: "Book a Demo"
        },
        about: {
            title: "About Us",
            subtitle: "We are revolutionizing how businesses connect with their customers in Spain, right inside WhatsApp.",
            missionTitle: "Our Mission",
            p1: "ZAPI was born out of frustration with clunky, outdated web portals. We believe that booking an appointment, paying a deposit, or asking a question should be as simple as texting a friend.",
            p2: "By bringing the entire customer journey into WhatsApp—the app that 95% of Spaniards use daily—we eliminate friction, reduce no-shows, and allow business owners to focus on what they do best: serving their clients."
        },
        whyZapi: {
            title: "Why Choose ZAPI?",
            subtitle: "The traditional booking ecosystem is broken. Here's why ZAPI is the superior choice for your business.",
            card1Title: "Zero Friction",
            card1Desc: "Your clients never leave WhatsApp. No apps to download, no new passwords to remember, no confusing websites.",
            card2Title: "Smart AI Responses",
            card2Desc: "Our context-aware AI understands natural language. It doesn't just read buttons; it understands actual intent and context.",
            card3Title: "Integrated Payments",
            card3Desc: "Collect deposits via Bizum securely within the chat. Automatically hold slots to prevent double-booking issues."
        },
        howToUse: {
            title: "How to Use ZAPI",
            subtitle: "Get your WhatsApp AI assistant running in less than 5 minutes.",
            step1Title: "1. Register Your Business",
            step1Desc: "Sign up to our platform and enter your business details, operating hours, and services.",
            step2Title: "2. Connect WhatsApp",
            step2Desc: "Scan the QR code to connect your official WhatsApp Business number to the ZAPI engine.",
            step3Title: "3. Setup Payments (Optional)",
            step3Desc: "Link your Stripe connect account to easily accept Bizum or credit card down payments directly inside the chat flow.",
            step4Title: "4. Watch it Grow",
            step4Desc: "Share your wa.me link on your Google Maps, Instagram, and website. Your AI agent handles scheduling 24/7."
        },
        contact: {
            title: "Get In Touch",
            subtitle: "Have questions? We're here to help you get started.",
            formTitle: "Send us a message",
            nameLabel: "Your Name",
            namePlaceholder: "John Doe",
            emailLabel: "Email Address",
            emailPlaceholder: "john@example.com",
            messageLabel: "Message",
            messagePlaceholder: "How can we help?",
            submit: "Submit Message"
        },
        login: {
            welcomeBack: "Welcome back",
            createAccount: "Create an account",
            logInDesc: "Log in to manage your bookings",
            signUpDesc: "Start taking bookings on WhatsApp",
            bizNameLabel: "Business Name",
            bizNamePlaceholder: "ZAPI Salon",
            emailLabel: "Email Address",
            emailPlaceholder: "hello@zapi.es",
            passwordLabel: "Password",
            passwordPlaceholder: "••••••••",
            logInBtn: "Log In",
            signUpBtn: "Sign Up",
            noAccount: "Don't have an account? ",
            hasAccount: "Already have an account? ",
            rightTitle: "Bookings that feel effortless.",
            rightQuote: "\"Since switching to ZAPI, our no-show rate dropped by 80% because our clients love booking right inside WhatsApp.\"",
            authorName: "Maria Lopez",
            authorTitle: "Owner, Belleza Studio"
        }
    },
    es: {
        navInfo: { about: "Sobre nosotros", why: "Por qué ZAPI", how: "Cómo usar", contact: "Contacto", login: "Iniciar sesión", getStarted: "Empezar" },
        hero: {
            badge: "Reservas por WhatsApp con IA",
            title1: "Capta más clientes con",
            title2: "un sistema de reservas sin esfuerzo.",
            subtitle: "ZAPI es la solución definitiva de IA para negocios locales. Lanza tu asistente automatizado en minutos y deja de perder clientes con formularios web complicados.",
            cta: "Empieza gratis hoy"
        },
        problem: {
            badge: "❌ El Problema",
            title: "No pierdas más reservas por plataformas lentas",
            card1: "Los clientes abandonan la reserva cuando se les obliga a descargar apps o navegar por sitios web complejos.",
            card2: "Jugar al ratón y al gato por teléfono esperando horas por una confirmación rompe el flujo.",
            card3: "Cada paso extra te cuesta un cliente. Mucha fricción equivale a pérdida de ingresos.",
            solutionTitle: "Integración perfecta, resultados instantáneos",
            solutionDesc: "Configura el perfil de tu negocio en minutos y deja que la IA haga el resto. ZAPI entiende las intenciones del cliente, revisa tu calendario y asegura pagos, todo dentro de WhatsApp.",
            clientsTitle: "Para tus clientes",
            clientsList: ["Sin colas ni esperas", "Respuestas instantáneas", "Proceso súper simple"],
            bizTitle: "Para tu negocio",
            bizList: ["Configuración en minutos", "Pagos directos por Stripe", "Cero clientes perdidos"]
        },
        pricing: {
            badge: "Planes",
            title: "Precios simples diseñados para crecer contigo",
            popular: "Más Popular",
            planName: "Plataforma",
            planDesc: "Para peluquerías, clínicas y profesionales. Automatización total.",
            mo: "/mes",
            tryFree: "Prueba gratis",
            features: ["✓ 500 reservas/mes", "✓ Perfil de negocio", "✓ Comisión Stripe: 0%"],
            aiTitle: "Acciones de IA",
            aiDesc: "Convierte reglas en flujos automáticos que captan intenciones reales.",
            intTitle: "Integraciones",
            intDesc: "Conecta sin problemas con Stripe y pre-reserva bloqueando cupos."
        },
        footer: {
            tagline: "Empieza a escalar tu agenda hoy",
            getStarted: "Pruébalo gratis",
            demo: "Agenda una demo"
        },
        about: {
            title: "Sobre Nosotros",
            subtitle: "Estamos revolucionando cómo los negocios conectan con sus clientes en España, directo por WhatsApp.",
            missionTitle: "Nuestra Misión",
            p1: "ZAPI nació de la frustración con portales web lentos y obsoletos. Creemos que agendar una cita, pagar una seña o hacer una pregunta debe ser tan simple como enviarle un mensaje a un amigo.",
            p2: "Llevando todo el recorrido del cliente a WhatsApp —la app que el 95% de los españoles usa a diario— eliminamos la fricción, reducimos ausencias y permitimos a los negocios concentrarse en lo que mejor hacen: atender a sus clientes."
        },
        whyZapi: {
            title: "¿Por qué elegir ZAPI?",
            subtitle: "El ecosistema tradicional de reservas está roto. Por esto ZAPI es la mejor opción para tu negocio.",
            card1Title: "Cero Fricción",
            card1Desc: "Tus clientes nunca salen de WhatsApp. Sin apps que descargar, sin contraseñas nuevas, sin sitios web confusos.",
            card2Title: "Respuestas Inteligentes por IA",
            card2Desc: "Nuestra IA entiende el lenguaje natural. No solo lee botones, entiende la intención real y el contexto.",
            card3Title: "Pagos Integrados",
            card3Desc: "Cobra señas de forma segura en el chat. Retén cupos automáticamente y evita cancelaciones."
        },
        howToUse: {
            title: "Cómo usar ZAPI",
            subtitle: "Pon tu asistente de IA de WhatsApp a funcionar en menos de 5 minutos.",
            step1Title: "1. Registra tu negocio",
            step1Desc: "Crea tu cuenta e ingresa los detalles, horarios y servicios de tu negocio.",
            step2Title: "2. Conecta WhatsApp",
            step2Desc: "Escanea el código QR para conectar tu número oficial de WhatsApp Business al motor de ZAPI.",
            step3Title: "3. Configura Pagos (Opcional)",
            step3Desc: "Vincula tu cuenta de Stripe para aceptar pagos o tarjetas directamente en el chat.",
            step4Title: "4. Míralo Crecer",
            step4Desc: "Comparte tu enlace wa.me en Google Maps, Instagram y sitio web. Tu agente agenda citas 24/7."
        },
        contact: {
            title: "Ponte en Contacto",
            subtitle: "¿Preguntas? Estamos aquí para ayudarte a empezar.",
            formTitle: "Envíanos un mensaje",
            nameLabel: "Tu Nombre",
            namePlaceholder: "Juan Pérez",
            emailLabel: "Correo Electrónico",
            emailPlaceholder: "juan@ejemplo.com",
            messageLabel: "Mensaje",
            messagePlaceholder: "¿En qué te ayudamos?",
            submit: "Enviar Mensaje"
        },
        login: {
            welcomeBack: "Bienvenido de nuevo",
            createAccount: "Crea una cuenta",
            logInDesc: "Inicia sesión para gestionar tus reservas",
            signUpDesc: "Empieza a recibir reservas por WhatsApp",
            bizNameLabel: "Nombre del Negocio",
            bizNamePlaceholder: "Peluquería ZAPI",
            emailLabel: "Correo Electrónico",
            emailPlaceholder: "hola@zapi.es",
            passwordLabel: "Contraseña",
            passwordPlaceholder: "••••••••",
            logInBtn: "Iniciar sesión",
            signUpBtn: "Regístrate",
            noAccount: "¿No tienes una cuenta? ",
            hasAccount: "¿Ya tienes cuenta? ",
            rightTitle: "Reservas sin esfuerzo.",
            rightQuote: "\"Desde que cambiamos a ZAPI, las ausencias cayeron un 80% porque nuestros clientes aman agendar por WhatsApp.\"",
            authorName: "María López",
            authorTitle: "Dueña, Belleza Studio"
        }
    },
    pt: {
        navInfo: { about: "Sobre", why: "Porquê ZAPI", how: "Como usar", contact: "Contacto", login: "Entrar", getStarted: "Começar" },
        hero: {
            badge: "Marcações no WhatsApp por IA",
            title1: "Capture mais clientes com",
            title2: "marcações sem esforço no WhatsApp.",
            subtitle: "O ZAPI é a solução definitiva de IA para empresas de serviços. Inicie o seu assistente automatizado em minutos e pare de perder clientes em formulários extensos.",
            cta: "Comece grátis hoje"
        },
        problem: {
            badge: "❌ O Problema",
            title: "Pare de perder marcações por plataformas complicadas",
            card1: "Os clientes abandonam as marcações quando forçados a usar apps complexas.",
            card2: "Esperar horas por confirmação prejudica a jornada do cliente.",
            card3: "Cada passo extra custa-lhe um cliente. A fricção equivale a perda de receitas.",
            solutionTitle: "Adesão rápida, resultados imediatos",
            solutionDesc: "Configure o seu perfil de negócio em poucos minutos e deixe a IA fazer o resto. O ZAPI avalia intenções, verifica a sua agenda e garante pagamentos, tudo via WhatsApp.",
            clientsTitle: "Para os seus Clientes",
            clientsList: ["Sem tempos de espera", "Respostas instantâneas", "Fluxos de trabalho simples"],
            bizTitle: "Para o seu Negócio",
            bizList: ["Configuração em minutos", "Checkouts Stripe diretos", "Nenhum cliente perdido"]
        },
        pricing: {
            badge: "Planos",
            title: "Preços simples para crescer junto com o seu negócio",
            popular: "Mais Popular",
            planName: "Plataforma",
            planDesc: "Para salões e clínicas em expansão. Automatização completa.",
            mo: "/mês",
            tryFree: "Teste gratuitamente",
            features: ["✓ 500 marcações/mês", "✓ Perfil Personalizado", "✓ Comissão Stripe: 0%"],
            aiTitle: "Ações por IA",
            aiDesc: "Transforme regras em fluxos automatizados rapidamente.",
            intTitle: "Integrações",
            intDesc: "Conexão perfeita com pagamentos Stripe e calendário integrado."
        },
        footer: {
            tagline: "Comece a oferecer um suporte mais inteligente",
            getStarted: "Começar Gratuitamente",
            demo: "Agendar uma Demo"
        },
        about: {
            title: "Sobre Nós",
            subtitle: "Estamos a revolucionar a forma como as empresas se ligam aos seus clientes em Portugal, diretamente no WhatsApp.",
            missionTitle: "A Nossa Missão",
            p1: "O ZAPI nasceu da frustração com portais web lentos e obsoletos. Acreditamos que marcar uma consulta, pagar um sinal ou fazer uma pergunta deve ser tão simples como enviar uma mensagem a um amigo.",
            p2: "Ao trazer todo o percurso do cliente para o WhatsApp —a app que a vasta maioria usa diariamente— eliminamos a fricção, reduzimos as faltas e permitimos aos donos de negócios focar no que fazem melhor: servir os clientes."
        },
        whyZapi: {
            title: "Porquê escolher o ZAPI?",
            subtitle: "O ecossistema tradicional de marcações está ultrapassado. Eis por que o ZAPI é a escolha ideal.",
            card1Title: "Fricção Zero",
            card1Desc: "Os seus clientes não saem do WhatsApp. Sem apps para instalar, sem novas senhas, sem sites confusos.",
            card2Title: "Respostas de IA Inteligentes",
            card2Desc: "A nossa IA compreende a linguagem natural. Não lê apenas botões; entende a verdadeira intenção.",
            card3Title: "Pagamentos Integrados",
            card3Desc: "Cobre sinais de forma segura no chat. Bloqueie as vagas automaticamente e evite cancelamentos."
        },
        howToUse: {
            title: "Como usar o ZAPI",
            subtitle: "Coloque o seu assistente de IA no WhatsApp a funcionar em menos de 5 minutos.",
            step1Title: "1. Registe o seu Negócio",
            step1Desc: "Inscreva-se na plataforma e insira os detalhes, horários e serviços da sua empresa.",
            step2Title: "2. Ligue o WhatsApp",
            step2Desc: "Leia o código QR para associar o seu número do WhatsApp Business ao motor ZAPI.",
            step3Title: "3. Configure Pagamentos (Opcional)",
            step3Desc: "Associe a sua conta Stripe para aceitar pagamentos diretamente no chat.",
            step4Title: "4. Veja-o Crescer",
            step4Desc: "Partilhe o seu link wa.me no Google Maps, Instagram e site. O seu agente agenda marcações 24/7."
        },
        contact: {
            title: "Entre em Contacto",
            subtitle: "Dúvidas? Estamos aqui para ajudá-lo a arrancar.",
            formTitle: "Envie-nos uma mensagem",
            nameLabel: "O Seu Nome",
            namePlaceholder: "João Silva",
            emailLabel: "E-mail",
            emailPlaceholder: "joao@exemplo.com",
            messageLabel: "Mensagem",
            messagePlaceholder: "Como podemos ajudar?",
            submit: "Enviar Mensagem"
        },
        login: {
            welcomeBack: "Bem-vindo de volta",
            createAccount: "Crie uma conta",
            logInDesc: "Inicie sessão para gerir as suas marcações",
            signUpDesc: "Comece a receber marcações no WhatsApp",
            bizNameLabel: "Nome do Negócio",
            bizNamePlaceholder: "Salão ZAPI",
            emailLabel: "E-mail",
            emailPlaceholder: "ola@zapi.pt",
            passwordLabel: "Palavra-passe",
            passwordPlaceholder: "••••••••",
            logInBtn: "Entrar",
            signUpBtn: "Registe-se",
            noAccount: "Não tem uma conta? ",
            hasAccount: "Já tem uma conta? ",
            rightTitle: "Marcações sem esforço.",
            rightQuote: "\"Desde que mudámos para o ZAPI, as faltas desceram 80% porque os clientes adoram marcar no WhatsApp.\"",
            authorName: "Maria Lopes",
            authorTitle: "Proprietária, Belleza Studio"
        }
    },
    fr: {
        navInfo: { about: "À propos", why: "Pourquoi ZAPI", how: "Comment utiliser", contact: "Contact", login: "Connexion", getStarted: "Démarrer" },
        hero: {
            badge: "Réservation sur WhatsApp par l'IA",
            title1: "Attirez plus de clients avec",
            title2: "la réservation sans effort.",
            subtitle: "ZAPI est la solution IA ultime pour les entreprises locales. Paramétrez votre assistant automatisé en quelques minutes.",
            cta: "Commencez gratuitement"
        },
        problem: {
            badge: "❌ Le Problème",
            title: "Ne perdez plus de réservations avec des systèmes lents",
            card1: "Les clients abandonnent lorsqu'on les force à télécharger de nouvelles applications.",
            card2: "Faire des allers-retours au téléphone nuit à la fluidité de votre expérience client.",
            card3: "Chaque étape supplémentaire vous coûte un client. Zéro friction, plus de revenus.",
            solutionTitle: "Déploiement simple, résultats immédiats",
            solutionDesc: "Créez votre profil en 5 minutes : notre IA s'occupe du reste. ZAPI comprend ce que veulent vos clients et réserve un créneau directement via WhatsApp.",
            clientsTitle: "Pour vos Clients",
            clientsList: ["Aucune file d'attente", "Réponses instantanées", "Système transparent"],
            bizTitle: "Pour votre Business",
            bizList: ["Mise en place express", "Paiements via Stripe", "Zéro rendez-vous manqué"]
        },
        pricing: {
            badge: "Formules",
            title: "Des tarifs qui grandissent avec votre réussite",
            popular: "Le plus Populaire",
            planName: "Plateforme",
            planDesc: "Pour les salons, cliniques et autres entreprises en essor.",
            mo: "/mois",
            tryFree: "Tester Gratuitement",
            features: ["✓ 500 réservations/mois", "✓ Profil d'entreprise", "✓ Commission Stripe: 0%"],
            aiTitle: "IA Automatisée",
            aiDesc: "Des flux intégrés pour capter directement les intentions des clients.",
            intTitle: "Intégrations",
            intDesc: "Synchronisation parfaite avec vos agendas et Stripe."
        },
        footer: {
            tagline: "Boostez vos réservations dès aujourd'hui",
            getStarted: "Démarrer Gratuitement",
            demo: "Réserver une Démo"
        },
        about: {
            title: "À Propos",
            subtitle: "Nous révolutionnons la façon dont les entreprises communiquent avec leurs clients en France, directement sur WhatsApp.",
            missionTitle: "Notre Mission",
            p1: "ZAPI est né de la frustration face aux portails web lents et obsolètes. Nous croyons que prendre un rendez-vous, payer un acompte ou poser une question devrait être aussi simple que d'envoyer un SMS à un ami.",
            p2: "En amenant l'ensemble du parcours client sur WhatsApp — que presque tout le monde utilise tous les jours — nous éliminons les frictions, réduisons les no-shows et permettons de se concentrer sur l'essentiel : servir les clients."
        },
        whyZapi: {
            title: "Pourquoi Choisir ZAPI ?",
            subtitle: "Le système de réservation traditionnel est brisé. Voici pourquoi ZAPI est le meilleur choix pour vous.",
            card1Title: "Zéro Friction",
            card1Desc: "Vos clients ne quittent jamais WhatsApp. Pas d'applications à télécharger, pas de mots de passe, pas de sites confus.",
            card2Title: "Réponses Intelligentes par IA",
            card2Desc: "Notre IA comprend le langage naturel. Elle ne se contente pas de lire des boutons, elle comprend le contexte.",
            card3Title: "Paiements Intégrés",
            card3Desc: "Encaissez des acomptes en toute sécurité dans le chat. Bloquez les créneaux automatiquement pour éviter les annulations."
        },
        howToUse: {
            title: "Comment Utiliser ZAPI",
            subtitle: "Mettez votre assistant IA WhatsApp en route en moins de 5 minutes.",
            step1Title: "1. Enregistrez Votre Entreprise",
            step1Desc: "Inscrivez-vous et entrez les détails, horaires et services de votre entreprise.",
            step2Title: "2. Connectez WhatsApp",
            step2Desc: "Scannez le code QR pour lier votre numéro WhatsApp Business au moteur ZAPI.",
            step3Title: "3. Configurez les Paiements (Optionnel)",
            step3Desc: "Liez votre compte Stripe pour accepter des paiements directement via le chat.",
            step4Title: "4. Regardez-le Grandir",
            step4Desc: "Partagez votre lien wa.me sur Google Maps, Instagram et votre site. L'agent gère le planning 24/7."
        },
        contact: {
            title: "Contactez-Nous",
            subtitle: "Des questions ? Nous sommes là pour vous aider à démarrer.",
            formTitle: "Envoyez-nous un message",
            nameLabel: "Votre Nom",
            namePlaceholder: "Jean Dupont",
            emailLabel: "Adresse E-mail",
            emailPlaceholder: "jean@exemple.com",
            messageLabel: "Message",
            messagePlaceholder: "Comment pouvons-nous vous aider ?",
            submit: "Envoyer le Message"
        },
        login: {
            welcomeBack: "De retour",
            createAccount: "Créer un compte",
            logInDesc: "Connectez-vous pour gérer vos réservations",
            signUpDesc: "Commencez à prendre des réservations sur WhatsApp",
            bizNameLabel: "Nom de l'Entreprise",
            bizNamePlaceholder: "Salon ZAPI",
            emailLabel: "Adresse E-mail",
            emailPlaceholder: "bonjour@zapi.fr",
            passwordLabel: "Mot de passe",
            passwordPlaceholder: "••••••••",
            logInBtn: "Connexion",
            signUpBtn: "S'inscrire",
            noAccount: "Vous n'avez pas de compte ? ",
            hasAccount: "Vous avez déjà un compte ? ",
            rightTitle: "Des réservations sans effort.",
            rightQuote: "\"Depuis que nous utilisons ZAPI, notre taux de rendez-vous manqués a chuté de 80 % car nos clients adorent réserver sur WhatsApp.\"",
            authorName: "Marie Laurent",
            authorTitle: "Propriétaire, Belleza Studio"
        }
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const value = {
        language,
        setLanguage,
        t: translations[language]
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
