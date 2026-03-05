import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
    const { t } = useLanguage();

    return (
        <>
            <div className="section-mint">
                <Navbar />
                <section className="container text-center" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
                    <h1 style={{ color: 'var(--text-dark)' }}>{t.contact.title}</h1>
                    <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.25rem', color: 'var(--text-gray)' }}>
                        {t.contact.subtitle}
                    </p>
                </section>
            </div>
            <div className="wavy-divider to-pink"></div>

            <div className="section-pink" style={{ padding: '80px 0' }}>
                <section className="container">
                    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>{t.contact.formTitle}</h2>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>{t.contact.nameLabel}</label>
                                <input type="text" placeholder={t.contact.namePlaceholder} style={{ width: '100%', padding: '12px', border: '2px solid #111', borderRadius: '8px', fontSize: '1rem' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>{t.contact.emailLabel}</label>
                                <input type="email" placeholder={t.contact.emailPlaceholder} style={{ width: '100%', padding: '12px', border: '2px solid #111', borderRadius: '8px', fontSize: '1rem' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>{t.contact.messageLabel}</label>
                                <textarea rows="4" placeholder={t.contact.messagePlaceholder} style={{ width: '100%', padding: '12px', border: '2px solid #111', borderRadius: '8px', fontSize: '1rem', resize: 'vertical' }}></textarea>
                            </div>
                            <button className="btn btn-primary" style={{ marginTop: '16px', fontSize: '1.1rem' }}>{t.contact.submit}</button>
                        </form>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
};

export default Contact;
