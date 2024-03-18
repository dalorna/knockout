import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import ErrorPane from './errorPane';

// when the router changes, need to set hasError to false in order to render children
const LocationWatch = ({ onChange }) => {
  const { key } = useLocation();
  const mounted = useRef(key);
  useEffect(() => {
    if (mounted.current !== key) {
      mounted.current = key;
      onChange();
    }
  }, [key, onChange]);
};

class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  handleLocationChange = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <>
          <LocationWatch onChange={this.handleLocationChange} />
          {this.props.fallback ?? <ErrorPane subheading={this.state.error?.response?.data?.requestId} />}
        </>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
