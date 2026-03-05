import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Phone, Mail, MapPin, Building2, MessageSquare } from 'lucide-react';
import { businessAPI, authAPI } from '../../services/api';

const SettingsPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        country: '',
        sector: '',
        aiPersonality: 'professional',
        whatsappConnected: false
    });

    const countries = [
        { code: 'ES', name: 'Spain', dial: '+34' },
        { code: 'GB', name: 'United Kingdom', dial: '+44' },
        { code: 'US', name: 'United States', dial: '+1' },
        { code: 'NG', name: 'Nigeria', dial: '+234' },
        { code: 'FR', name: 'France', dial: '+33' },
        { code: 'DE', name: 'Germany', dial: '+49' },
        { code: 'IT', name: 'Italy', dial: '+39' },
        { code: 'PT', name: 'Portugal', dial: '+351' }
    ];

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await businessAPI.getProfile();
            setProfile({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                location: data.location || '',
                country: data.country || 'ES',
                sector: data.sector || '',
                aiPersonality: data.aiPersonality || 'professional',
                whatsappConnected: data.whatsappConnected || false
            });
        } catch (err) {
            setError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await businessAPI.updateProfile(profile);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <div style={{ fontSize: '1.1rem', color: '#6B7280' }}>Loading settings...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 8px 0' }}>Business Settings</h1>
                <p style={{ color: '#6B7280', margin: 0 }}>Manage your business profile and WhatsApp AI assistant</p>
            </div>

            {/* Success Message */}
            {success && (
                <div style={{
                    padding: '16px',
                    backgroundColor: '#DCFCE7',
                    border: '1px solid #86EFAC',
                    borderRadius: '12px',
                    color: '#166534',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <CheckCircle size={20} />
                    {success}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div style={{
                    padding: '16px',
                    backgroundColor: '#FEE2E2',
                    border: '1px solid #FCA5A5',
                    borderRadius: '12px',
                    color: '#991B1B',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Business Information Section */}
                <div style={{
                    backgroundColor: '#FFF',
                    borderRadius: '20px',
                    border: '1px solid #F3F4F6',
                    padding: '32px'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Building2 size={24} color="#4F46E5" />
                        Business Information
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Business Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleInputChange}
                                placeholder="Your Business Name"
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Email Address *</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleInputChange}
                                    placeholder="contact@business.com"
                                    style={{ ...inputStyle, paddingLeft: '44px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Phone Number *</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleInputChange}
                                    placeholder="+34 600 123 456"
                                    style={{ ...inputStyle, paddingLeft: '44px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Location/City *</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="text"
                                    name="location"
                                    value={profile.location}
                                    onChange={handleInputChange}
                                    placeholder="Madrid"
                                    style={{ ...inputStyle, paddingLeft: '44px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Country</label>
                            <select
                                name="country"
                                value={profile.country}
                                onChange={handleInputChange}
                                style={inputStyle}
                                required
                            >
                                {countries.map(country => (
                                    <option key={country.code} value={country.code}>
                                        {country.name} ({country.dial})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Business Sector</label>
                            <select
                                name="sector"
                                value={profile.sector}
                                onChange={handleInputChange}
                                style={inputStyle}
                                required
                            >
                                <option value="">Select Sector</option>
                                <option value="beauty">Beauty & Wellness</option>
                                <option value="health">Health & Medical</option>
                                <option value="food">Restaurant & Bar</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* AI Assistant Settings Section */}
                <div style={{
                    backgroundColor: '#FFF',
                    borderRadius: '20px',
                    border: '1px solid #F3F4F6',
                    padding: '32px'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <MessageSquare size={24} color="#4F46E5" />
                        WhatsApp AI Assistant
                    </h2>
                    <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '24px' }}>
                        Customize how your AI assistant interacts with customers on WhatsApp
                    </p>

                    {/* WhatsApp Connection Status */}
                    <div style={{
                        padding: '16px',
                        backgroundColor: profile.whatsappConnected ? '#DCFCE7' : '#FEF3C7',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: profile.whatsappConnected ? '#10B981' : '#F59E0B'
                        }}></div>
                        <div>
                            <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                                {profile.whatsappConnected ? 'WhatsApp Connected' : 'WhatsApp Not Connected'}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                                {profile.whatsappConnected
                                    ? 'Your AI assistant is active and handling customer messages'
                                    : 'Configure Twilio credentials to enable WhatsApp integration'
                                }
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>AI Personality</label>
                        <select
                            name="aiPersonality"
                            value={profile.aiPersonality}
                            onChange={handleInputChange}
                            style={inputStyle}
                        >
                            <option value="professional">Professional & Formal</option>
                            <option value="friendly">Friendly & Casual</option>
                            <option value="concise">Concise & Direct</option>
                            <option value="warm">Warm & Welcoming</option>
                        </select>
                        <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '8px' }}>
                            Choose how your AI assistant communicates with customers
                        </p>
                    </div>
                </div>

                {/* Save Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '14px 32px',
                            backgroundColor: saving ? '#9CA3AF' : '#4F46E5',
                            color: '#FFF',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 600,
                            cursor: saving ? 'not-allowed' : 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {/* Help Section */}
            <div style={{
                marginTop: '32px',
                padding: '24px',
                backgroundColor: '#F9FAFB',
                borderRadius: '16px',
                border: '1px solid #E5E7EB'
            }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Need Help?</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '16px' }}>
                    For WhatsApp integration setup instructions, check the <code style={{ backgroundColor: '#E5E7EB', padding: '2px 6px', borderRadius: '4px' }}>TWILIO_WHATSAPP_SETUP.md</code> file in your project root.
                </p>
                <ul style={{ color: '#6B7280', fontSize: '0.9rem', paddingLeft: '20px' }}>
                    <li>Configure Twilio credentials in your .env file</li>
                    <li>Set up webhook URL in Twilio Console</li>
                    <li>Test your WhatsApp integration with sandbox mode</li>
                </ul>
            </div>
        </div>
    );
};

const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: '#374151'
};

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #E5E7EB',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'inherit'
};

export default SettingsPage;
