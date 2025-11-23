import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Scissors, RefreshCw, ArrowRight } from 'lucide-react';

const FeatureCard = ({ title, description, icon: Icon, to, color }) => (
    <Link to={to} className="card" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'transform 0.2s',
        textDecoration: 'none',
        color: 'inherit'
    }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
        <div style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '0.75rem',
            backgroundColor: `${color}20`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Icon size={24} />
        </div>
        <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{description}</p>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: color, fontWeight: 500 }}>
            Try it now <ArrowRight size={16} />
        </div>
    </Link>
);

const Home = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            <section style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '4rem 0' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
                    Your All-in-One <br />
                    <span style={{
                        background: 'linear-gradient(to right, var(--primary), #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>PDF Playground</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Merge, split, and convert PDF files directly in your browser.
                    Fast, secure, and completely free. No file uploads required.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/merge" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem' }}>
                        Get Started
                    </Link>
                </div>
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <FeatureCard
                    title="Merge PDFs"
                    description="Combine multiple PDF files into a single document in seconds."
                    icon={Layers}
                    to="/merge"
                    color="#3b82f6"
                />
                <FeatureCard
                    title="Split PDF"
                    description="Extract pages or split a PDF file into multiple documents."
                    icon={Scissors}
                    to="/split"
                    color="#ef4444"
                />
                <FeatureCard
                    title="Convert"
                    description="Convert images to PDF or extract images from PDF files."
                    icon={RefreshCw}
                    to="/convert"
                    color="#10b981"
                />
            </section>
        </div>
    );
};

export default Home;
