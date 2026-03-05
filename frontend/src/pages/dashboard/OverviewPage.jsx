import { useState, useEffect } from 'react';
import { CheckCircle, Clock, MessageSquare, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { dashboardAPI, bookingsAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const OverviewPage = () => {
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [statsData, bookingsData] = await Promise.all([
                dashboardAPI.getStats(),
                bookingsAPI.getAll({ limit: 5 })
            ]);

            setStats(statsData);
            setRecentBookings(bookingsData.bookings || []);
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: { bg: '#FEF3C7', color: '#92400E', label: 'Pending' },
            confirmed: { bg: '#DCFCE7', color: '#166534', label: 'Confirmed' },
            completed: { bg: '#E0E7FF', color: '#3730A3', label: 'Completed' },
            cancelled: { bg: '#FEE2E2', color: '#991B1B', label: 'Cancelled' }
        };
        return configs[status] || configs.pending;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <div style={{ fontSize: '1.1rem', color: '#6B7280' }}>Loading dashboard...</div>
            </div>
        );
    }

    const statsCards = [
        {
            label: 'Confirmed Bookings',
            value: stats?.confirmedBookings || 0,
            icon: CheckCircle,
            color: '#10B981',
            bgColor: '#DCFCE7'
        },
        {
            label: 'Pending Requests',
            value: stats?.pendingBookings || 0,
            icon: Clock,
            color: '#F59E0B',
            bgColor: '#FEF3C7'
        },
        {
            label: 'Total Revenue',
            value: `€${stats?.totalRevenue || 0}`,
            icon: DollarSign,
            color: '#3B82F6',
            bgColor: '#DBEAFE'
        },
        {
            label: 'Messages Today',
            value: stats?.messagesToday || 0,
            icon: MessageSquare,
            color: '#8B5CF6',
            bgColor: '#EDE9FE'
        }
    ];

    return (
        <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 8px 0' }}>
                    Welcome back! 👋
                </h1>
                <p style={{ color: '#6B7280', margin: 0 }}>
                    Here's what's happening with your business today
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
            }}>
                {statsCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={idx}
                            style={{
                                backgroundColor: '#FFF',
                                padding: '24px',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                border: '1px solid #F3F4F6',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                padding: '14px',
                                borderRadius: '14px',
                                backgroundColor: stat.bgColor
                            }}>
                                <Icon color={stat.color} size={28} />
                            </div>
                            <div>
                                <div style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '4px' }}>
                                    {stat.label}
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                                    {stat.value}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Two Column Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '24px'
            }}>
                {/* Recent Bookings */}
                <div style={{
                    backgroundColor: '#FFF',
                    borderRadius: '20px',
                    border: '1px solid #F3F4F6',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        padding: '24px',
                        borderBottom: '1px solid #F3F4F6',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>Recent Bookings</h3>
                        <button
                            onClick={() => navigate('/dashboard/bookings')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#F9FAFB',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                color: '#4F46E5'
                            }}
                        >
                            View All
                        </button>
                    </div>

                    {recentBookings.length === 0 ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                            <Calendar size={40} color="#D1D5DB" style={{ margin: '0 auto 12px' }} />
                            <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>No recent bookings</p>
                        </div>
                    ) : (
                        <div style={{ padding: '12px' }}>
                            {recentBookings.map((booking, idx) => {
                                const statusConfig = getStatusConfig(booking.status);
                                return (
                                    <div
                                        key={booking._id || idx}
                                        style={{
                                            padding: '16px',
                                            borderRadius: '12px',
                                            marginBottom: '8px',
                                            backgroundColor: '#F9FAFB',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                                {booking.customerName || 'Unknown'}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                                                {booking.service || 'Service'} • {booking.appointmentTime ? formatDate(booking.appointmentTime) : 'No date'}
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '100px',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            backgroundColor: statusConfig.bg,
                                            color: statusConfig.color,
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {statusConfig.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div style={{
                    backgroundColor: '#FFF',
                    borderRadius: '20px',
                    border: '1px solid #F3F4F6',
                    padding: '24px'
                }}>
                    <h3 style={{ margin: '0 0 20px 0', fontWeight: 700, fontSize: '1.1rem' }}>Quick Actions</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            onClick={() => navigate('/dashboard/services')}
                            style={quickActionButtonStyle}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '10px', backgroundColor: '#EDE9FE', borderRadius: '10px' }}>
                                    <TrendingUp size={20} color="#8B5CF6" />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: 600, marginBottom: '2px' }}>Manage Services</div>
                                    <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Add or edit your service offerings</div>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/dashboard/bookings')}
                            style={quickActionButtonStyle}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '10px', backgroundColor: '#DBEAFE', borderRadius: '10px' }}>
                                    <Calendar size={20} color="#3B82F6" />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: 600, marginBottom: '2px' }}>View All Bookings</div>
                                    <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Manage your appointments</div>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/dashboard/settings')}
                            style={quickActionButtonStyle}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '10px', backgroundColor: '#DCFCE7', borderRadius: '10px' }}>
                                    <MessageSquare size={20} color="#10B981" />
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: 600, marginBottom: '2px' }}>AI Settings</div>
                                    <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Customize WhatsApp assistant</div>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* WhatsApp Status */}
                    <div style={{
                        marginTop: '24px',
                        padding: '16px',
                        backgroundColor: stats?.whatsappConnected ? '#DCFCE7' : '#FEF3C7',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: stats?.whatsappConnected ? '#10B981' : '#F59E0B'
                        }}></div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                {stats?.whatsappConnected ? 'WhatsApp Active' : 'WhatsApp Inactive'}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                                {stats?.whatsappConnected ? 'AI is handling messages' : 'Configure in settings'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const quickActionButtonStyle = {
    width: '100%',
    padding: '16px',
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left'
};

export default OverviewPage;
