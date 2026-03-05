import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, DollarSign, AlertCircle, CreditCard, Tag } from 'lucide-react';
import { businessAPI } from '../../services/api';

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        duration: '',
        price: '',
        description: '',
        requiresPayment: false
    });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await businessAPI.getProfile();
            setServices(data.services || []);
        } catch (err) {
            setError(err.message || 'Failed to load services');
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            const updatedServices = [...services, { ...formData, _id: Date.now().toString() }];
            await businessAPI.updateProfile({ services: updatedServices });
            await loadServices();
            setShowAddModal(false);
            resetForm();
        } catch (err) {
            alert('Failed to add service: ' + err.message);
        }
    };

    const handleEditService = (service) => {
        setEditingService(service);
        setFormData({
            name: service.name || '',
            duration: service.duration || '',
            price: service.price || '',
            description: service.description || '',
            requiresPayment: service.requiresPayment || false
        });
        setShowAddModal(true);
    };

    const handleUpdateService = async (e) => {
        e.preventDefault();
        try {
            const updatedServices = services.map(s =>
                s._id === editingService._id ? { ...s, ...formData } : s
            );
            await businessAPI.updateProfile({ services: updatedServices });
            await loadServices();
            setShowAddModal(false);
            setEditingService(null);
            resetForm();
        } catch (err) {
            alert('Failed to update service: ' + err.message);
        }
    };

    const handleDeleteService = async (serviceId) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            const updatedServices = services.filter(s => s._id !== serviceId);
            await businessAPI.updateProfile({ services: updatedServices });
            await loadServices();
        } catch (err) {
            alert('Failed to delete service: ' + err.message);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', duration: '', price: '', description: '', requiresPayment: false });
        setEditingService(null);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <div style={{ fontSize: '1.1rem', color: '#6B7280' }}>Loading services...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 8px 0' }}>My Services</h1>
                    <p style={{ color: '#6B7280', margin: 0 }}>Manage the services you offer to your customers</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowAddModal(true); }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        backgroundColor: '#4F46E5',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.95rem'
                    }}
                >
                    <Plus size={20} /> Add Service
                </button>
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

            {/* Services Grid */}
            {services.length === 0 ? (
                <div style={{
                    backgroundColor: '#FFF',
                    borderRadius: '20px',
                    border: '1px solid #F3F4F6',
                    padding: '60px 20px',
                    textAlign: 'center'
                }}>
                    <Plus size={48} color="#D1D5DB" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ color: '#6B7280', fontWeight: 600, marginBottom: '8px' }}>No services yet</h3>
                    <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '20px' }}>
                        Add your first service to start accepting bookings
                    </p>
                    <button
                        onClick={() => { resetForm(); setShowAddModal(true); }}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4F46E5',
                            color: '#FFF',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Add Your First Service
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    {services.map((service) => (
                        <div
                            key={service._id}
                            style={{
                                backgroundColor: '#FFF',
                                borderRadius: '16px',
                                border: '1px solid #F3F4F6',
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
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
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                                    {service.name}
                                </h3>
                                <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                    {service.description || 'No description provided'}
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280' }}>
                                        <Clock size={16} />
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{service.duration} min</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981' }}>
                                        <DollarSign size={16} />
                                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>€{service.price}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {service.requiresPayment ? (
                                        <>
                                            <CreditCard size={14} color="#3B82F6" />
                                            <span style={{ fontSize: '0.85rem', color: '#3B82F6', fontWeight: 600 }}>
                                                Payment Required
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Tag size={14} color="#10B981" />
                                            <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 600 }}>
                                                Free Booking
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', paddingTop: '8px' }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEditService(service); }}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        padding: '10px',
                                        borderRadius: '10px',
                                        border: '1px solid #E5E7EB',
                                        backgroundColor: '#FFF',
                                        color: '#4F46E5',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteService(service._id); }}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        padding: '10px',
                                        borderRadius: '10px',
                                        border: '1px solid #FCA5A5',
                                        backgroundColor: '#FFF',
                                        color: '#EF4444',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Service Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: '#FFF',
                        borderRadius: '20px',
                        maxWidth: '500px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '32px'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
                            {editingService ? 'Edit Service' : 'Add New Service'}
                        </h2>

                        <form onSubmit={editingService ? handleUpdateService : handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Service Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Haircut & Styling"
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Duration (minutes) *</label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        placeholder="60"
                                        style={inputStyle}
                                        required
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Price (€) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="30"
                                        style={inputStyle}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Brief description of this service..."
                                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{
                                padding: '16px',
                                backgroundColor: '#F9FAFB',
                                borderRadius: '12px',
                                border: '1px solid #E5E7EB'
                            }}>
                                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: 0 }}>
                                    <input
                                        type="checkbox"
                                        name="requiresPayment"
                                        checked={formData.requiresPayment}
                                        onChange={(e) => setFormData({ ...formData, requiresPayment: e.target.checked })}
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer',
                                            accentColor: '#4F46E5'
                                        }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                            {formData.requiresPayment ? (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <CreditCard size={16} color="#3B82F6" />
                                                    Require Payment During Booking
                                                </span>
                                            ) : (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Tag size={16} color="#10B981" />
                                                    Free Booking (No Payment Required)
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 400 }}>
                                            {formData.requiresPayment
                                                ? 'Customers must pay when booking this service'
                                                : 'Customers can book without payment (pay later or free service)'
                                            }
                                        </div>
                                    </div>
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); resetForm(); }}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: '1px solid #E5E7EB',
                                        backgroundColor: '#FFF',
                                        color: '#6B7280',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        backgroundColor: '#4F46E5',
                                        color: '#FFF',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {editingService ? 'Update Service' : 'Add Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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

export default ServicesPage;
