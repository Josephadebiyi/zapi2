
import {
    Users, Briefcase, Settings, Shield, Plus,
    Search, Filter, MoreVertical, CheckCircle, Clock
} from 'lucide-react';
import { LogoIcon } from '../components/Logo';

const AdminDashboard = () => {
    // Stat cards data
    const stats = [
        { label: "Total Businesses", value: 124, icon: Briefcase, color: "#4F8AFA" },
        { label: "Active Agents", value: 98, icon: CheckCircle, color: "#2CD971" },
        { label: "Pending Setup", value: 12, icon: Clock, color: "#FBB938" },
        { label: "System Admins", value: 4, icon: Shield, color: "#FB6D9D" }
    ];

    // Mock data for businesses (Network table)
    const businesses = [
        {
            id: '65dd12345678901234567890',
            name: "Seeta Luxe Salon",
            email: "luxe@zapisalon.com",
            location: "Madrid, Calle Serrano 15",
            personality: "casual",
            status: "active",
            joined: "2026-02-25"
        },
        {
            id: '65dd09876543210987654321',
            name: "Dr. Smith Dental",
            email: "contact@smithdental.es",
            location: "Barcelona, Av. Diagonal",
            personality: "professional",
            status: "pending",
            joined: "2026-02-26"
        },
        {
            id: '65dd11223344556677889900',
            name: "Globex Logistics",
            email: "support@globex.com",
            location: "Valencia, Port Area",
            personality: "bilingual",
            status: "active",
            joined: "2026-02-27"
        }
    ];

    const personalityColors = {
        professional: { bg: '#EBF2FF', text: '#4F8AFA' },
        casual: { bg: '#FFECF2', text: '#FB6D9D' },
        bilingual: { bg: '#FFF7E6', text: '#FBB938' }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px' }}><LogoIcon /></div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#111' }}>Admin Central</h1>
                            <p style={{ color: '#6B7280', margin: 0 }}>System-wide management of Seeta business ecosystem</p>
                        </div>
                    </div>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
                        <Plus size={20} /> Register New Business
                    </button>
                </div>

                {/* Quick Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div key={idx} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: stat.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={24} color={stat.color} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: '#6B7280', fontWeight: 500 }}>{stat.label}</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111' }}>{stat.value}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Businesses List (The Network Table) */}
                <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden', border: '1px solid #F3F4F6' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Business Network</h2>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="text"
                                    placeholder="Search by name or ID..."
                                    style={{ padding: '10px 16px 10px 40px', borderRadius: '8px', border: '1px solid #E5E7EB', outline: 'none', width: '280px', fontSize: '0.9rem' }}
                                />
                            </div>
                            <button style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#fff', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <Filter size={18} /> Filters
                            </button>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F9FAFB' }}>
                                    <th style={{ padding: '16px 24px', color: '#6B7280', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business Details</th>
                                    <th style={{ padding: '16px 24px', color: '#6B7280', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>SEETA ID / Reference</th>
                                    <th style={{ padding: '16px 24px', color: '#6B7280', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Personality</th>
                                    <th style={{ padding: '16px 24px', color: '#6B7280', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                                    <th style={{ padding: '16px 24px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {businesses.map((biz, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ fontWeight: 600, color: '#111', fontSize: '1rem', marginBottom: '2px' }}>{biz.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>{biz.email} • {biz.location}</div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <code style={{ backgroundColor: '#F3F4F6', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#374151', fontFamily: 'monospace' }}>{biz.id}</code>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '100px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                textTransform: 'capitalize',
                                                backgroundColor: personalityColors[biz.personality].bg,
                                                color: personalityColors[biz.personality].text
                                            }}>
                                                {biz.personality}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: biz.status === 'active' ? '#2CD971' : '#FBB938' }}></div>
                                                <span style={{ fontSize: '0.9rem', color: '#111', fontWeight: 500 }}>{biz.status === 'active' ? 'Live on WhatsApp' : 'Setup Pending'}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'inline-flex' }}>
                                                <MoreVertical size={20} color="#9CA3AF" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ padding: '24px', backgroundColor: '#F9FAFB', borderTop: '1px solid #F3F4F6', textAlign: 'center' }}>
                        <button style={{ background: 'none', border: 'none', color: '#4F8AFA', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                            View Infrastructure Logs
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
