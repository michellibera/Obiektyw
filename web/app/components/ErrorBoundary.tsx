'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error info:', info);

    if (this.props.onError) {
      this.props.onError(error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback ? (
        this.props.fallback
      ) : (
        <div
          style={{
            maxWidth: '800px',
            margin: '2rem auto',
            padding: '2rem',
            background: '#ffffff',
            border: '1.5px solid #c92f35',
            textAlign: 'center'
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '900',
              marginBottom: '1rem',
              color: '#c92f35'
            }}
          >
            Coś poszło nie tak
          </h2>
          <p
            style={{
              fontSize: '0.95rem',
              color: '#525252',
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            }}
          >
            {this.state.error?.message ||
              'Nieznany błąd. Spróbuj ponownie załadować stronę.'}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#0a0a0a',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#2a2a2a';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#0a0a0a';
            }}
          >
            Spróbuj ponownie
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
