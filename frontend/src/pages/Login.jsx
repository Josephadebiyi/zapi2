import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LogoIcon } from '../components/Logo';
import { authAPI } from '../services/api';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { language, setLanguage, t } = useLanguage();

    const [formData, setFormData] = useState({
        bizName: '',
        email: '',
        password: '',
        phone: '',
        location: '',
        country: 'ES',
        dialCode: '+34',
        sector: '',
        entityType: 'individual',
        businessGoal: 'both',
        taxId: '',
        ownerFullName: '',
        ownerDob: '',
        ownerIdNumber: '',
        ownerRole: ''
    });

    const countries = [
        { code: 'ES', name: 'Spain', dial: '+34' },
        { code: 'GB', name: 'United Kingdom', dial: '+44' },
        { code: 'US', name: 'United States', dial: '+1' },
        { code: 'NG', name: 'Nigeria', dial: '+234' },
        { code: 'FR', name: 'France', dial: '+33' },
        { code: 'DE', name: 'Germany', dial: '+49' },
        { code: 'IT', name: 'Italy', dial: '+39' },
        { code: 'PT', name: 'Portugal', dial: '+351' },
        { code: 'NL', name: 'Netherlands', dial: '+31' },
        { code: 'BE', name: 'Belgium', dial: '+32' },
        { code: 'CH', name: 'Switzerland', dial: '+41' },
        { code: 'AT', name: 'Austria', dial: '+43' },
        { code: 'SE', name: 'Sweden', dial: '+46' },
        { code: 'NO', name: 'Norway', dial: '+47' },
        { code: 'DK', name: 'Denmark', dial: '+45' },
        { code: 'FI', name: 'Finland', dial: '+358' }
    ];

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCountryChange = (e) => {
        const selectedCountry = countries.find(c => c.code === e.target.value);
        setFormData({
            ...formData,
            country: selectedCountry.code,
            dialCode: selectedCountry.dial
        });
    };

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authAPI.login(loginData.email, loginData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const registrationData = {
                name: formData.bizName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                location: formData.location || 'Madrid',
                country: formData.country,
                dialCode: formData.dialCode,
                sector: formData.sector,
                entityType: formData.entityType,
                businessGoal: formData.businessGoal,
                taxId: formData.taxId,
                ownerFullName: formData.ownerFullName,
                ownerDob: formData.ownerDob,
                ownerIdNumber: formData.ownerIdNumber,
                ownerRole: formData.ownerRole
            };

            await authAPI.register(registrationData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderLoginForm = () => (
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
                <div style={{ padding: '12px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#991B1B', fontSize: '0.9rem' }}>
                    {error}
                </div>
            )}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>{t.login.emailLabel}</label>
                <input
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder={t.login.emailPlaceholder}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                    required
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>{t.login.passwordLabel}</label>
                <input
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder={t.login.passwordPlaceholder}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '12px', width: '100%', padding: '14px', fontSize: '1.1rem' }} disabled={loading}>
                {loading ? 'Logging in...' : t.login.logInBtn}
            </button>
        </form>
    );

    const validateStep1 = () => {
        if (!formData.bizName.trim()) {
            setError('Business name is required');
            return false;
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.password || formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Phone number is required');
            return false;
        }
        if (!formData.location.trim()) {
            setError('City/Location is required');
            return false;
        }
        setError('');
        return true;
    };

    const renderRegisterForm = () => {
        if (step === 1) {
            return (
                <form onSubmit={(e) => { e.preventDefault(); if (validateStep1()) setStep(2); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {error && (
                        <div style={{ padding: '12px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#991B1B', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Business Name</label>
                        <input name="bizName" type="text" value={formData.bizName} onChange={handleChange} placeholder="e.g. Acme Salon" style={inputStyle} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Account Email</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="hello@acme.com" style={inputStyle} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Password (min 6 characters)</label>
                        <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" style={inputStyle} required minLength={6} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Country</label>
                        <select name="country" value={formData.country} onChange={handleCountryChange} style={inputStyle} required>
                            {countries.map(country => (
                                <option key={country.code} value={country.code}>
                                    {country.name} ({country.dial})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Phone Number</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                value={formData.dialCode}
                                readOnly
                                style={{ ...inputStyle, width: '80px', backgroundColor: '#f5f5f5', color: '#666' }}
                            />
                            <input
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="600123456"
                                style={{ ...inputStyle, flex: 1 }}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>City/Location</label>
                        <input name="location" type="text" value={formData.location} onChange={handleChange} placeholder="e.g. Madrid" style={inputStyle} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        Business Details <ArrowRight size={18} />
                    </button>
                </form>
            )
        }
        if (step === 2) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {error && (
                        <div style={{ padding: '12px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#991B1B', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Business Sector</label>
                            <select name="sector" value={formData.sector} onChange={handleChange} style={inputStyle} required>
                                <option value="">Select Sector</option>
                                <option value="beauty">Beauty & Wellness</option>
                                <option value="health">Health & Medical</option>
                                <option value="food">Restaurant & Bar</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Entity Type</label>
                            <select name="entityType" value={formData.entityType} onChange={handleChange} style={inputStyle} required>
                                <option value="individual">Individual / Freelancer</option>
                                <option value="company">Company</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Business Goal</label>
                        <select name="businessGoal" value={formData.businessGoal} onChange={handleChange} style={inputStyle} required>
                            <option value="appointments">Accept Appointments</option>
                            <option value="services">Offer Services</option>
                            <option value="both">Both</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Tax ID (NIF / NIE / CIF) - Optional</label>
                        <input name="taxId" value={formData.taxId} onChange={handleChange} placeholder="B12345678" style={inputStyle} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" className="btn" style={{ flex: 1, backgroundColor: '#eee', color: '#111' }} onClick={() => { setError(''); setStep(1); }}>
                            <ArrowLeft size={18} /> Back
                        </button>
                        <button type="button" className="btn btn-primary" style={{ flex: 2 }} onClick={() => {
                            if (!formData.sector) {
                                setError('Please select a business sector');
                                return;
                            }
                            setError('');
                            setStep(3);
                        }}>
                            Owner Info <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )
        }
        if (step === 3) {
            return (
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {error && (
                        <div style={{ padding: '12px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#991B1B', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}
                    <div>
                        <label style={labelStyle}>Legal Representative Full Name</label>
                        <input name="ownerFullName" value={formData.ownerFullName} onChange={handleChange} placeholder="First and Last Name" style={inputStyle} required />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Date of Birth</label>
                            <input name="ownerDob" type="date" value={formData.ownerDob} onChange={handleChange} style={inputStyle} required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>DNI / NIE number</label>
                            <input name="ownerIdNumber" value={formData.ownerIdNumber} onChange={handleChange} placeholder="12345678A" style={inputStyle} required />
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Role in Business</label>
                        <input name="ownerRole" value={formData.ownerRole} onChange={handleChange} placeholder="e.g. Director, Owner, Manager" style={inputStyle} required />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#F0FFF4', padding: '12px', borderRadius: '8px', border: '1px solid #C6F6D5', marginBottom: '8px' }}>
                        <CheckCircle size={20} color="#38A169" />
                        <span style={{ fontSize: '0.85rem', color: '#276749' }}>Identity will be verified manually by ZAPI after setup.</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" className="btn" style={{ flex: 1, backgroundColor: '#eee', color: '#111' }} onClick={(e) => { e.preventDefault(); setStep(2); }}>
                            Back
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                            {loading ? 'Creating Account...' : 'Complete Registration'}
                        </button>
                    </div>
                </form>
            )
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--seeta-mint)' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'var(--text-dark)', fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '40px', height: '40px' }}><LogoIcon /></div>
                        ZAPI
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Globe size={18} color="var(--text-dark)" />
                        <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', fontWeight: 700, color: 'var(--text-dark)', cursor: 'pointer', fontSize: '0.95rem' }}>
                            <option value="en">EN</option>
                            <option value="es">ES</option>
                            <option value="pt">PT</option>
                            <option value="fr">FR</option>
                        </select>
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card glass" style={{ width: '100%', maxWidth: '450px', margin: '0 auto', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                        {!isLogin && (
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                                {[1, 2, 3].map(s => (
                                    <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: s <= step ? 'var(--seeta-purple)' : '#ddd' }}></div>
                                ))}
                            </div>
                        )}
                        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>
                            {isLogin ? t.login.welcomeBack : "Join ZAPI"}
                        </h2>
                        <p style={{ marginBottom: '32px' }}>
                            {isLogin ? t.login.logInDesc : "Set up your business and automate your bookings."}
                        </p>

                        {isLogin ? renderLoginForm() : renderRegisterForm()}

                        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.95rem' }}>
                            {isLogin ? t.login.noAccount : t.login.hasAccount}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setStep(1); }}
                                style={{ background: 'none', border: 'none', color: 'var(--seeta-purple)', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}
                            >
                                {isLogin ? t.login.signUpBtn : t.login.logInBtn}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="desktop-login-side" style={{ flex: 1, backgroundColor: 'var(--seeta-purple)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, var(--seeta-purple), #3A1F96)', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 style={{ color: '#fff', fontSize: '3.5rem', marginBottom: '24px' }}>Automate your local business today.</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.25rem', maxWidth: '400px', lineHeight: 1.6 }}>"The KYC and setup process in ZAPI is seamless, allowing me to start accepting paid appointments in minutes."</p>
                </div>
            </div>
        </div>
    );
};

const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' };

export default Login;
