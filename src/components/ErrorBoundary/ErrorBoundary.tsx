import { Component } from "react";
import type { ReactNode } from "react";
import "./ErrorBoundary.css";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  // Show an error message if a component crashes.
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <img className="error-boundary__image" src="/favicon.png" alt="" />
          <h1>Something went wrong</h1>
          <p>We couldn't display this page. Please try again.</p>

          <a className="error-boundary__link" href="/">
            Return to Duck Shop
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
