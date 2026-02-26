import React from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can log error+info to an external service here
    // console.error(error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 p-6">
        <div className="max-w-lg w-full bg-base-200 border border-base-300 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-neutral-content mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-base-content/70 mb-4">
            An unexpected error occurred. You can try refreshing or return to
            the home page.
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={this.handleReset} className="btn">
              Try again
            </button>
            <Link to="/" className="btn btn-ghost">
              Home
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-outline"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}
