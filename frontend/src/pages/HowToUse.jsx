import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const HowToUse = () => {
    const { t } = useLanguage();

    return (
        <>
            <div className="section-mint">
                <Navbar />
                <section className="container text-center" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
                    <h1 style={{ color: 'var(--text-dark)' }}>{t.howToUse.title}</h1>
                    <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.25rem', color: 'var(--text-gray)' }}>
                        {t.howToUse.subtitle}
                    </p>
                </section>
            </div>
            <div className="wavy-divider to-dark"></div>

            <div className="section-dark-blue" style={{ padding: '80px 0' }}>
                <section className="container">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
                        <div className="card" style={{ color: 'var(--text-dark)' }}>
                            <h3>{t.howToUse.step1Title}</h3>
                            <p>{t.howToUse.step1Desc}</p>
                        </div>
                        <div className="card" style={{ color: 'var(--text-dark)' }}>
                            <h3>{t.howToUse.step2Title}</h3>
                            <p>{t.howToUse.step2Desc}</p>
                        </div>
                        <div className="card" style={{ color: 'var(--text-dark)' }}>
                            <h3>{t.howToUse.step3Title}</h3>
                            <p>{t.howToUse.step3Desc}</p>
                        </div>
                        <div className="card" style={{ color: 'var(--text-dark)' }}>
                            <h3>{t.howToUse.step4Title}</h3>
                            <p>{t.howToUse.step4Desc}</p>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
};

export default HowToUse;
