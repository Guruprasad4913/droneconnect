import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AgriDrone Hub Crash caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#090d16', color: '#f87171', padding: 32, fontFamily: 'monospace', minHeight: '100vh' }}>
          <h1 style={{ color: '#ef4444', fontSize: 24, marginBottom: 16 }}>⚠️ AgriDrone Hub Runtime Error</h1>
          <p style={{ color: '#e2e8f0', marginBottom: 12 }}>{this.state.error?.toString()}</p>
          <pre style={{ background: '#1e293b', padding: 16, borderRadius: 8, overflow: 'auto', fontSize: 13, color: '#94a3b8' }}>
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 20, padding: '10px 20px', background: '#10b981', color: '#022c22', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}
          >
            Reload Platform
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
