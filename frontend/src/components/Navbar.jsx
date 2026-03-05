import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { LogoIcon } from './Logo';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    return (
        <header className="navbar container">
            <Link to="/" className="logo">
                <div style={{ width: '48px', height: '48px' }}>
                    <LogoIcon />
                </div>
                ZAPI
            </Link>

            {/* Desktop Navigation */}
            <nav className="nav-links desktop-nav">
                <Link to="/about" className="nav-item">{t.navInfo.about}</Link>
                <Link to="/why-zapi" className="nav-item">{t.navInfo.why}</Link>
                <Link to="/how-to-use" className="nav-item">{t.navInfo.how}</Link>
                <Link to="/contact" className="nav-item">{t.navInfo.contact}</Link>
            </nav>

            <div className="nav-actions desktop-nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '8px' }}>
                    <Globe size={18} color="var(--text-dark)" />
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{ background: 'transparent', border: 'none', outline: 'none', fontWeight: 700, color: 'var(--text-dark)', cursor: 'pointer', fontSize: '0.95rem' }}
                    >
                        <option value="en">EN</option>
                        <option value="es">ES</option>
                        <option value="pt">PT</option>
                        <option value="fr">FR</option>
                    </select>
                </div>
                <Link to="/login" className="btn btn-secondary">{t.navInfo.login}</Link>
                <Link to="/login" className="btn btn-primary">
                    {t.navInfo.getStarted}
                </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={28} color="var(--text-dark)" /> : <Menu size={28} color="var(--text-dark)" />}
            </button>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="mobile-nav">
                    <Link to="/about" className="nav-item" onClick={() => setIsOpen(false)}>{t.navInfo.about}</Link>
                    <Link to="/why-zapi" className="nav-item" onClick={() => setIsOpen(false)}>{t.navInfo.why}</Link>
                    <Link to="/how-to-use" className="nav-item" onClick={() => setIsOpen(false)}>{t.navInfo.how}</Link>
                    <Link to="/contact" className="nav-item" onClick={() => setIsOpen(false)}>{t.navInfo.contact}</Link>
                    <div className="mobile-nav-actions">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                            <Globe size={20} color="var(--text-dark)" />
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                style={{ background: 'transparent', border: 'none', outline: 'none', fontWeight: 700, color: 'var(--text-dark)', cursor: 'pointer', fontSize: '1.1rem', flex: 1 }}
                            >
                                <option value="en">English (EN)</option>
                                <option value="es">Español (ES)</option>
                                <option value="pt">Português (PT)</option>
                                <option value="fr">Français (FR)</option>
                            </select>
                        </div>
                        <Link to="/login" className="btn btn-secondary" onClick={() => setIsOpen(false)}>{t.navInfo.login}</Link>
                        <Link to="/login" className="btn btn-primary" onClick={() => setIsOpen(false)}>{t.navInfo.getStarted}</Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
