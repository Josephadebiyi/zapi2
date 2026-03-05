import { Link } from 'react-router-dom';
import { MessageCircle, Zap, Shield, Search, CalendarCheck, Check, Star, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const Stars = () => (
    <div style={{ display: 'flex', gap: '4px', color: 'var(--seeta-lime)' }}>
        <Star fill="currentColor" size={16} />
        <Star fill="currentColor" size={16} />
        <Star fill="currentColor" size={16} />
        <Star fill="currentColor" size={16} />
        <Star fill="currentColor" size={16} />
    </div>
);

const Landing = () => {
    const { t } = useLanguage();

    return (
        <>
            <div className="section-mint">
                <Navbar />
                {/* HERO SECTION */}
                <section className="container text-center" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
                    <div className="badge">
                        <Sparkles size={14} style={{ marginRight: '8px', color: 'var(--seeta-purple)' }} />
                        {t.hero.badge}
                    </div>
                    <h1 style={{ maxWidth: '900px', margin: '0 auto 24px', color: 'var(--text-dark)' }}>
                        {t.hero.title1} <span style={{ display: 'block' }}>{t.hero.title2}</span>
                    </h1>
                    <p style={{ maxWidth: '600px', margin: '0 auto 40px', fontSize: '1.25rem', color: 'var(--text-gray)' }}>
                        {t.hero.subtitle}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '80px' }}>
                        <Link to="/login" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                            {t.hero.cta}
                        </Link>
                    </div>

                    {/* MOCKUP IMAGE AREA */}
                    <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto', zIndex: 10 }}>
                        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', textAlign: 'left', backgroundColor: '#fff' }}>
                            <div style={{ width: '30%', borderRight: '2px solid #111', backgroundColor: '#f9f9f9' }}>
                                <div style={{ padding: '20px', borderBottom: '2px solid #111', display: 'flex', gap: '8px' }}>
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FF5F56', border: '1px solid #111' }}></div>
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FFBD2E', border: '1px solid #111' }}></div>
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27C93F', border: '1px solid #111' }}></div>
                                </div>
                                <div style={{ padding: '20px' }}>
                                    <div style={{ height: 40, background: '#fff', border: '2px solid #111', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', padding: '0 12px', color: '#888' }}><Search size={16} style={{ marginRight: '8px' }} /> Search chats</div>
                                    <div style={{ height: 60, background: '#e0f2fe', border: '2px solid #111', borderRadius: '8px', marginBottom: '12px' }}></div>
                                    <div style={{ height: 60, background: '#fff', border: '2px solid #111', borderRadius: '8px', marginBottom: '12px' }}></div>
                                    <div style={{ height: 60, background: '#fff', border: '2px solid #111', borderRadius: '8px' }}></div>
                                </div>
                            </div>
                            <div style={{ flex: 1, backgroundColor: '#f0fdf4', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ alignSelf: 'flex-start', background: '#fff', border: '2px solid #111', padding: '16px 24px', borderRadius: '24px 24px 24px 4px', maxWidth: '80%' }}>
                                    <p style={{ margin: 0, fontWeight: 600, color: '#111' }}>Quiero cita para mañana en la peluquería.</p>
                                </div>
                                <div style={{ alignSelf: 'flex-end', background: 'var(--seeta-lime)', border: '2px solid #111', padding: '16px 24px', borderRadius: '24px 24px 4px 24px', maxWidth: '80%' }}>
                                    <p style={{ margin: 0, fontWeight: 600, color: '#111' }}>¡Hola! Claro, tengo hueco a las 11:00 o a las 17:30. ¿Cuál prefieres?</p>
                                </div>
                                <div style={{ alignSelf: 'flex-start', background: '#fff', border: '2px solid #111', padding: '16px 24px', borderRadius: '24px 24px 24px 4px', maxWidth: '80%' }}>
                                    <p style={{ margin: 0, fontWeight: 600, color: '#111' }}>A las 17:30 perfecto.</p>
                                </div>
                                <div style={{ alignSelf: 'flex-end', background: 'var(--seeta-lime)', border: '2px solid #111', padding: '16px 24px', borderRadius: '24px 24px 4px 24px', maxWidth: '80%' }}>
                                    <p style={{ margin: 0, fontWeight: 600, color: '#111' }}>Hecho. Paga aquí para confirmar tu reserva por Bizum: checkout.stripe.com/p/...</p>
                                </div>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div style={{ position: 'absolute', top: '10%', right: '-5%', background: 'var(--seeta-lime)', border: '2px solid #111', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11, boxShadow: '4px 4px 0 rgba(0,0,0,1)' }}>
                            <Zap size={24} color="#111" />
                        </div>
                    </div>
                </section>
            </div>

            <div className="wavy-divider to-pink"></div>

            {/* PINK SECTION - HOW Traditional Support Fails */}
            <div className="section-pink" style={{ padding: '80px 0' }}>
                <section className="container">
                    <div className="badge" style={{ backgroundColor: '#fff', border: '2px solid #111', color: '#111' }}>
                        {t.problem.badge}
                    </div>
                    <h2 style={{ fontSize: '3.5rem', maxWidth: '600px', marginBottom: '24px' }}>{t.problem.title}</h2>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginTop: '60px', justifyContent: 'center' }}>
                        <div className="card" style={{ padding: '24px', transform: 'rotate(-2deg)', maxWidth: '300px' }}>
                            <p style={{ fontWeight: 600, margin: 0, color: '#111' }}>{t.problem.card1}</p>
                        </div>
                        <div className="card" style={{ padding: '24px', transform: 'rotate(2deg)', maxWidth: '300px', marginTop: '40px' }}>
                            <p style={{ fontWeight: 600, margin: 0, color: '#111' }}>{t.problem.card2}</p>
                        </div>
                        <div className="card" style={{ padding: '24px', transform: 'rotate(-1deg)', maxWidth: '300px', marginTop: '10px' }}>
                            <p style={{ fontWeight: 600, margin: 0, color: '#111' }}>{t.problem.card3}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', background: '#fff', border: '2px solid #111', borderRadius: '24px', marginTop: '80px', padding: '40px', gap: '40px', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '2.5rem' }}>{t.problem.solutionTitle}</h3>
                            <p>{t.problem.solutionDesc}</p>
                            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                                <img src="https://i.pravatar.cc/100?img=1" alt="Avatar" style={{ borderRadius: '50%', border: '2px solid #111', width: 64, height: 64 }} />
                                <div>
                                    <Stars />
                                    <p style={{ fontWeight: 700, margin: '8px 0 0' }}>"ZAPI is a game-changer. Recommending it to anyone."</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ border: '2px solid #eee', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                                <div style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '8px' }}>{t.problem.clientsTitle}</div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', color: '#555', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {t.problem.clientsList.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div style={{ border: '2px solid #eee', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                                <div style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '8px' }}>{t.problem.bizTitle}</div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', color: '#555', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {t.problem.bizList.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="wavy-divider to-blue"></div>

            {/* BLUE SECTION */}
            <div className="section-blue" style={{ padding: '80px 0' }}>
                <section className="container">
                    <div className="text-center" style={{ marginBottom: '60px' }}>
                        <div className="badge">{t.pricing.badge}</div>
                        <h2>{t.pricing.title}</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>

                        <div className="card" style={{ backgroundColor: '#E1F8ED', border: '2px solid #111' }}>
                            <div style={{ float: 'right', backgroundColor: '#fff', padding: '4px 12px', borderRadius: '100px', border: '2px solid #111', fontSize: '0.875rem', fontWeight: 700 }}>{t.pricing.popular}</div>
                            <h3 style={{ fontSize: '2rem' }}>{t.pricing.planName}</h3>
                            <p>{t.pricing.planDesc}</p>

                            <div style={{ backgroundColor: '#fff', border: '2px solid #111', borderRadius: '12px', padding: '20px', marginTop: '24px' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 800 }}>49€ <span style={{ fontSize: '1rem', color: '#666' }}>{t.pricing.mo}</span></div>
                                <Link to="/login" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>{t.pricing.tryFree}</Link>
                                <ul style={{ listStyle: 'none', marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', fontWeight: 600 }}>
                                    {t.pricing.features.map((feature, i) => <li key={i}>{feature}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '32px' }}>
                            <div className="card" style={{ backgroundColor: '#FFF0D4', border: '2px solid #111', padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ background: '#FFC85C', padding: '8px', borderRadius: '8px', border: '2px solid #111' }}><Zap size={20} /></div>
                                    <h4 style={{ margin: 0, fontSize: '1.25rem' }}>{t.pricing.aiTitle}</h4>
                                </div>
                                <p style={{ margin: 0 }}>{t.pricing.aiDesc}</p>
                            </div>
                            <div className="card" style={{ backgroundColor: '#F3E8FF', border: '2px solid #111', padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ background: '#C084FC', padding: '8px', borderRadius: '8px', border: '2px solid #111' }}><Shield size={20} /></div>
                                    <h4 style={{ margin: 0, fontSize: '1.25rem' }}>{t.pricing.intTitle}</h4>
                                </div>
                                <p style={{ margin: 0 }}>{t.pricing.intDesc}</p>
                            </div>
                        </div>

                    </div>
                </section>
            </div>

            <div className="wavy-divider to-dark"></div>

            {/* FINAL SLA SECTION */}
            <div className="section-dark-blue" style={{ padding: '100px 0', textAlign: 'center' }}>
                <section className="container">
                    <h2 style={{ fontSize: '4rem', marginBottom: '40px', color: '#fff' }}>{t.footer.tagline}</h2>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <Link to="/login" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.25rem' }}>{t.footer.getStarted}</Link>
                        <Link to="/login" className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '1.25rem' }}>{t.footer.demo}</Link>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
};
export default Landing;
