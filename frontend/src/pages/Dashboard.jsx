import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, List, Settings, LogOut, Menu, X, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { LogoIcon } from '../components/Logo';
import { authAPI } from '../services/api';

// Import dashboard page components
import OverviewPage from './dashboard/OverviewPage';
import BookingsPage from './dashboard/BookingsPage';
import ServicesPage from './dashboard/ServicesPage';
import SettingsPage from './dashboard/SettingsPage';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile menu
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop collapse
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Load current user
        const user = authAPI.getCurrentUser();
        if (!user) {
            navigate('/login');
        } else {
            setCurrentUser(user);
        }
    }, [navigate]);

    const handleLogout = () => {
        authAPI.logout();
        navigate('/login');
    };

    const navItems = [
        { id: 'overview', label: 'Overview', icon: Home, path: '/dashboard' },
        { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/dashboard/bookings' },
        { id: 'services', label: 'Services', icon: List, path: '/dashboard/services' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' }
    ];

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
        }
        return location.pathname.startsWith(path);
    };

    const sidebarWidth = isSidebarCollapsed ? '80px' : '280px';

    return (
        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#F9FAFB', fontFamily: 'Inter, sans-serif' }}>
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 99,
                        display: 'none'
                    }}
                    className="mobile-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={isSidebarOpen ? 'sidebar-open' : ''}
                style={{
                    width: sidebarWidth,
                    backgroundColor: '#FFF',
                    borderRight: '1px solid #E5E7EB',
                    padding: isSidebarCollapsed ? '30px 10px' : '30px 20px',
                    flexDirection: 'column',
                    display: 'flex',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 100,
                    transition: 'all 0.3s ease',
                    overflow: 'hidden'
                }}
            >
                {/* Logo and Close Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px' }}><LogoIcon /></div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>SEETA</span>
                    </div>
                    <button
                        className="mobile-close-btn"
                        onClick={() => setIsSidebarOpen(false)}
                        style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* User Info */}
                {currentUser && (
                    <div style={{
                        padding: '16px',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '12px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#4F46E5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFF',
                                fontWeight: 700
                            }}>
                                {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {currentUser.name || 'Business User'}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {currentUser.email}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    navigate(item.path);
                                    setIsSidebarOpen(false);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    backgroundColor: active ? '#F3F4F6' : 'transparent',
                                    color: active ? '#111' : '#6B7280',
                                    fontWeight: active ? 700 : 500,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Icon size={20} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '20px' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            color: '#EF4444',
                            background: 'none',
                            border: 'none',
                            padding: '12px 16px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            width: '100%',
                            borderRadius: '12px',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header
                className="mobile-header"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '64px',
                    backgroundColor: '#FFF',
                    borderBottom: '1px solid #E5E7EB',
                    display: 'none',
                    alignItems: 'center',
                    padding: '0 20px',
                    zIndex: 90,
                    justifyContent: 'space-between'
                }}
            >
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                    <Menu size={24} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px' }}><LogoIcon /></div>
                    <span style={{ fontWeight: 800 }}>SEETA</span>
                </div>
                <div style={{ width: '24px' }}></div>
            </header>

            {/* Main Content Area */}
            <main style={{
                flex: 1,
                marginLeft: '280px',
                minHeight: '100vh',
                backgroundColor: '#F9FAFB'
            }}
            className="main-content">
                <Routes>
                    <Route path="/" element={<OverviewPage />} />
                    <Route path="/bookings" element={<BookingsPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </main>

            {/* Responsive CSS */}
            <style>{`
                @media (max-width: 768px) {
                    .mobile-header {
                        display: flex !important;
                    }

                    .mobile-close-btn {
                        display: block !important;
                    }

                    .mobile-overlay {
                        display: block !important;
                    }

                    aside {
                        transform: translateX(-100%);
                    }

                    aside.sidebar-open {
                        transform: translateX(0);
                    }

                    .main-content {
                        margin-left: 0 !important;
                        padding-top: 64px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
