import { useState, useEffect } from 'react';
import { Calendar, Search, Filter, CheckCircle, Clock, XCircle, AlertCircle, Phone, Mail } from 'lucide-react';
import { bookingsAPI } from '../../services/api';

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        loadBookings();
    }, [filterStatus]);

    const loadBookings = async () => {
        setLoading(true);
        setError('');
        try {
            const params = filterStatus !== 'all' ? { status: filterStatus } : {};
            const data = await bookingsAPI.getAll(params);
            setBookings(data.bookings || []);
        } catch (err) {
            setError(err.message || 'Failed to load bookings');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            await bookingsAPI.updateStatus(bookingId, newStatus);
            await loadBookings(); // Reload bookings
        } catch (err) {
            alert('Failed to update booking status: ' + err.message);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: { bg: '#FEF3C7', color: '#92400E', icon: Clock, label: 'Pending' },
            confirmed: { bg: '#DCFCE7', color: '#166534', icon: CheckCircle, label: 'Confirmed' },
            completed: { bg: '#E0E7FF', color: '#3730A3', icon: CheckCircle, label: 'Completed' },
            cancelled: { bg: '#FEE2E2', color: '#991B1B', icon: XCircle, label: 'Cancelled' },
            rejected: { bg: '#FEE2E2', color: '#991B1B', icon: XCircle, label: 'Rejected' }
        };
        return configs[status] || configs.pending;
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            booking.service?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <div style={{ fontSize: '1.1rem', color: '#6B7280' }}>Loading bookings...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 8px 0' }}>My Bookings</h1>
                <p style={{ color: '#6B7280', margin: 0 }}>Manage all your customer bookings in one place</p>
            </div>

            {/* Filters & Search */}
            <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                flexWrap: 'wrap'
            }}>
                {/* Search */}
                <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                    <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search by client name or service..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 44px',
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB',
                            outline: 'none',
                            fontSize: '0.95rem'
                        }}
                    />
                </div>

                {/* Status Filter */}
                <div style={{ position: 'relative' }}>
                    <Filter size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{
                            padding: '12px 16px 12px 44px',
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB',
                            outline: 'none',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">All Bookings</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

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

            {/* Bookings List - Responsive */}
            <div style={{ backgroundColor: '#FFF', borderRadius: '20px', border: '1px solid #F3F4F6', overflow: 'hidden' }}>
                {filteredBookings.length === 0 ? (
                    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                        <Calendar size={48} color="#D1D5DB" style={{ margin: '0 auto 16px' }} />
                        <h3 style={{ color: '#6B7280', fontWeight: 600, marginBottom: '8px' }}>
                            {searchTerm ? 'No bookings match your search' : 'No bookings yet'}
                        </h3>
                        <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                            {searchTerm ? 'Try a different search term' : 'Your customer bookings will appear here'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="desktop-table" style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                                        <th style={thStyle}>Customer</th>
                                        <th style={thStyle}>Service</th>
                                        <th style={thStyle}>Date & Time</th>
                                        <th style={thStyle}>Contact</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={thStyle}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.map((booking) => {
                                        const statusConfig = getStatusConfig(booking.status);
                                        const StatusIcon = statusConfig.icon;

                                        return (
                                            <tr key={booking._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                                <td style={tdStyle}>
                                                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                                        {booking.customerName || 'Unknown'}
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
                                                        ID: {booking._id?.substring(0, 8)}...
                                                    </div>
                                                </td>
                                                <td style={tdStyle}>{booking.service || 'N/A'}</td>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Calendar size={16} color="#9CA3AF" />
                                                        {booking.appointmentTime ? formatDate(booking.appointmentTime) : 'Not scheduled'}
                                                    </div>
                                                </td>
                                                <td style={tdStyle}>
                                                    {booking.phoneNumber && (
                                                        <a href={`https://wa.me/${booking.phoneNumber.replace(/\D/g, '')}`}
                                                           target="_blank"
                                                           rel="noopener noreferrer"
                                                           style={{
                                                               display: 'flex',
                                                               alignItems: 'center',
                                                               gap: '6px',
                                                               color: '#25D366',
                                                               textDecoration: 'none',
                                                               fontSize: '0.85rem'
                                                           }}>
                                                            <Phone size={14} /> WhatsApp
                                                        </a>
                                                    )}
                                                </td>
                                                <td style={tdStyle}>
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '6px 12px',
                                                        borderRadius: '100px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        backgroundColor: statusConfig.bg,
                                                        color: statusConfig.color
                                                    }}>
                                                        <StatusIcon size={14} />
                                                        {statusConfig.label}
                                                    </span>
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                        {booking.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusChange(booking._id, 'confirmed')}
                                                                    style={actionButtonStyle('#10B981', '#FFF')}
                                                                >
                                                                    Confirm
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(booking._id, 'rejected')}
                                                                    style={actionButtonStyle('#FFF', '#EF4444', true)}
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                        {booking.status === 'confirmed' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusChange(booking._id, 'completed')}
                                                                    style={actionButtonStyle('#3B82F6', '#FFF')}
                                                                >
                                                                    Complete
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(booking._id, 'cancelled')}
                                                                    style={actionButtonStyle('#FFF', '#EF4444', true)}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="mobile-cards">
                            {filteredBookings.map((booking) => {
                                const statusConfig = getStatusConfig(booking.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <div key={booking._id} style={{
                                        padding: '20px',
                                        borderBottom: '1px solid #F3F4F6',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }}>
                                        {/* Header */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>
                                                    {booking.customerName || 'Unknown'}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                                                    {booking.service || 'N/A'}
                                                </div>
                                            </div>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '4px 10px',
                                                borderRadius: '100px',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                backgroundColor: statusConfig.bg,
                                                color: statusConfig.color
                                            }}>
                                                <StatusIcon size={12} />
                                                {statusConfig.label}
                                            </span>
                                        </div>

                                        {/* Details */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#6B7280' }}>
                                                <Calendar size={16} />
                                                {booking.appointmentTime ? formatDate(booking.appointmentTime) : 'Not scheduled'}
                                            </div>
                                            {booking.phoneNumber && (
                                                <a href={`https://wa.me/${booking.phoneNumber.replace(/\D/g, '')}`}
                                                   target="_blank"
                                                   rel="noopener noreferrer"
                                                   style={{
                                                       display: 'flex',
                                                       alignItems: 'center',
                                                       gap: '8px',
                                                       color: '#25D366',
                                                       textDecoration: 'none',
                                                       fontSize: '0.9rem',
                                                       fontWeight: 600
                                                   }}>
                                                    <Phone size={16} /> Contact on WhatsApp
                                                </a>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(booking._id, 'confirmed')}
                                                        style={{ ...mobileButtonStyle, backgroundColor: '#10B981', color: '#FFF', flex: 1 }}
                                                    >
                                                        ✓ Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(booking._id, 'rejected')}
                                                        style={{ ...mobileButtonStyle, backgroundColor: '#FFF', color: '#EF4444', border: '1px solid #EF4444', flex: 1 }}
                                                    >
                                                        ✕ Reject
                                                    </button>
                                                </>
                                            )}
                                            {booking.status === 'confirmed' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(booking._id, 'completed')}
                                                        style={{ ...mobileButtonStyle, backgroundColor: '#3B82F6', color: '#FFF', flex: 1 }}
                                                    >
                                                        ✓ Complete
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(booking._id, 'cancelled')}
                                                        style={{ ...mobileButtonStyle, backgroundColor: '#FFF', color: '#EF4444', border: '1px solid #EF4444', flex: 1 }}
                                                    >
                                                        ✕ Cancel
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Summary Stats */}
            {filteredBookings.length > 0 && (
                <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <div>
                        <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Total Bookings: </span>
                        <span style={{ fontWeight: 700 }}>{filteredBookings.length}</span>
                    </div>
                    <div>
                        <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Confirmed: </span>
                        <span style={{ fontWeight: 700, color: '#10B981' }}>
                            {filteredBookings.filter(b => b.status === 'confirmed').length}
                        </span>
                    </div>
                    <div>
                        <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Pending: </span>
                        <span style={{ fontWeight: 700, color: '#F59E0B' }}>
                            {filteredBookings.filter(b => b.status === 'pending').length}
                        </span>
                    </div>
                </div>
            )}

            {/* Responsive CSS */}
            <style>{`
                .mobile-cards {
                    display: none;
                }

                @media (max-width: 768px) {
                    .desktop-table {
                        display: none !important;
                    }
                    .mobile-cards {
                        display: block;
                    }
                }
            `}</style>
        </div>
    );
};

const thStyle = {
    padding: '14px 20px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#6B7280',
    textTransform: 'uppercase',
    textAlign: 'left'
};

const tdStyle = {
    padding: '20px',
    fontSize: '0.93rem',
    verticalAlign: 'middle'
};

const actionButtonStyle = (bg, color, bordered = false) => ({
    padding: '6px 12px',
    borderRadius: '8px',
    border: bordered ? '1px solid #E5E7EB' : 'none',
    backgroundColor: bg,
    color: color,
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer'
});

const mobileButtonStyle = {
    padding: '10px 16px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer'
};

export default BookingsPage;
