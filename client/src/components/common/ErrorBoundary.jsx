import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
          <div className="rounded-xl bg-white p-6 shadow">
            <h1 className="text-xl font-semibold">Something went wrong.</h1>
            <p className="mt-2 text-slate-600">Please refresh and try again.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
