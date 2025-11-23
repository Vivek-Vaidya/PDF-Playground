import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Layers, Scissors, RefreshCw, Home } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/merge', label: 'Merge', icon: Layers },
    { path: '/split', label: 'Split', icon: Scissors },
    { path: '/convert', label: 'Convert', icon: RefreshCw },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        borderBottom: '1px solid var(--border)', 
        backgroundColor: 'var(--surface)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div className="container" style={{ 
          height: '4rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
            <FileText style={{ color: 'var(--primary)' }} />
            PDF Playground
          </Link>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius)',
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-secondary)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          {children}
        </div>
      </main>
      <footer style={{ 
        borderTop: '1px solid var(--border)', 
        padding: '2rem 0', 
        textAlign: 'center', 
        color: 'var(--text-secondary)',
        marginTop: 'auto'
      }}>
        <div className="container">
          <p>© 2025 PDF Playground. All operations are client-side.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
