import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
    const { t } = useLanguage();

    return (
        <>
            <div className="section-mint">
                <Navbar />
                <section className="container text-center" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
                    <h1 style={{ color: 'var(--text-dark)' }}>{t.about.title}</h1>
                    <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.25rem', color: 'var(--text-gray)' }}>
                        {t.about.subtitle}
                    </p>
                </section>
            </div>
            <div className="wavy-divider to-pink"></div>

            <div className="section-pink" style={{ padding: '80px 0' }}>
                <section className="container">
                    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>{t.about.missionTitle}</h2>
                        <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
                            {t.about.p1}
                        </p>
                        <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
                            {t.about.p2}
                        </p>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
};

export default About;
