import { useState } from 'react';
import { X, Gift, ArrowRight } from 'lucide-react';

const PromoBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div style={{
            backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '16px 24px',
            borderRadius: '16px',
            margin: '0 0 24px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative circles */}
            <div style={{
                position: 'absolute',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                top: '-50px',
                right: '-30px'
            }}></div>
            <div style={{
                position: 'absolute',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                bottom: '-30px',
                left: '100px'
            }}></div>

            {/* Content */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1, flex: 1 }}>
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Gift size={24} color="#FFF" />
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        color: '#FFF',
                        margin: '0 0 4px 0',
                        fontWeight: 700,
                        fontSize: '1.1rem'
                    }}>
                        🎉 Limited Time Offer!
                    </h3>
                    <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        margin: 0,
                        fontSize: '0.9rem'
                    }}>
                        Get 3 months free when you upgrade to Pro. Unlock unlimited bookings & advanced analytics!
                    </p>
                </div>
            </div>

            {/* CTA Button */}
            <button
                style={{
                    backgroundColor: '#FFF',
                    color: '#667eea',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                    zIndex: 1,
                    transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => alert('Upgrade feature coming soon!')}
            >
                Upgrade Now <ArrowRight size={16} />
            </button>

            {/* Close Button */}
            <button
                onClick={() => setIsVisible(false)}
                style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                    transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            >
                <X size={18} color="#FFF" />
            </button>

            {/* Mobile responsive */}
            <style>{`
                @media (max-width: 768px) {
                    /* Stack content vertically on mobile */
                }
            `}</style>
        </div>
    );
};

export default PromoBanner;
