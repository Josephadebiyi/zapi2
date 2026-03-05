import { Link } from 'react-router-dom';
import { LogoIcon } from './Logo';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer style={{ backgroundColor: 'var(--theme-mint)', padding: '60px 0 40px', borderTop: '2px solid #111' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>

                <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                    <div style={{ width: '150px' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 800 }}>Product</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/why-zapi" style={{ color: 'var(--text-gray)', textDecoration: 'none', fontWeight: 600 }}>{t.navInfo.why}</Link>
                            <Link to="/how-to-use" style={{ color: 'var(--text-gray)', textDecoration: 'none', fontWeight: 600 }}>{t.navInfo.how}</Link>
                        </div>
                    </div>

                    <div style={{ width: '150px' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 800 }}>Company</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/about" style={{ color: 'var(--text-gray)', textDecoration: 'none', fontWeight: 600 }}>{t.navInfo.about}</Link>
                            <Link to="/contact" style={{ color: 'var(--text-gray)', textDecoration: 'none', fontWeight: 600 }}>{t.navInfo.contact}</Link>
                        </div>
                    </div>

                    <div style={{ width: '150px' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 800 }}>Resources</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/login" style={{ color: 'var(--text-gray)', textDecoration: 'none', fontWeight: 600 }}>Platform</Link>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '300px' }}>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 800 }}>Newsletter</h4>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px' }}>{t.footer.tagline}</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="email" placeholder="Email" style={{ padding: '12px', border: '2px solid #111', borderRadius: '8px', flex: 1, fontWeight: 600 }} />
                        <button className="btn btn-primary" style={{ padding: '12px 20px' }}>Submit</button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '80px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '80px', height: '80px' }}>
                    <LogoIcon />
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.05em' }}>ZAPI</div>
            </div>
        </footer>
    );
};

export default Footer;
