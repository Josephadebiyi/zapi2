import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Zap, Shield, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const WhyZapi = () => {
    const { t } = useLanguage();

    return (
        <>
            <div className="section-mint">
                <Navbar />
                <section className="container text-center" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
                    <h1 style={{ color: 'var(--text-dark)' }}>{t.whyZapi.title}</h1>
                    <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.25rem', color: 'var(--text-gray)' }}>
                        {t.whyZapi.subtitle}
                    </p>
                </section>
            </div>
            <div className="wavy-divider to-blue"></div>

            <div className="section-blue" style={{ padding: '80px 0' }}>
                <section className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                    <div className="card" style={{ padding: '32px' }}>
                        <div style={{ background: '#FFC85C', padding: '12px', borderRadius: '12px', border: '2px solid #111', display: 'inline-block', marginBottom: '20px' }}>
                            <MessageCircle size={32} />
                        </div>
                        <h3>{t.whyZapi.card1Title}</h3>
                        <p>{t.whyZapi.card1Desc}</p>
                    </div>
                    <div className="card" style={{ padding: '32px' }}>
                        <div style={{ background: '#C4E2FF', padding: '12px', borderRadius: '12px', border: '2px solid #111', display: 'inline-block', marginBottom: '20px' }}>
                            <Zap size={32} />
                        </div>
                        <h3>{t.whyZapi.card2Title}</h3>
                        <p>{t.whyZapi.card2Desc}</p>
                    </div>
                    <div className="card" style={{ padding: '32px' }}>
                        <div style={{ background: '#FFD6DF', padding: '12px', borderRadius: '12px', border: '2px solid #111', display: 'inline-block', marginBottom: '20px' }}>
                            <Shield size={32} />
                        </div>
                        <h3>{t.whyZapi.card3Title}</h3>
                        <p>{t.whyZapi.card3Desc}</p>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
};

export default WhyZapi;
