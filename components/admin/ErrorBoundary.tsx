"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-state">
          <div style={{ fontSize: "40px", marginBottom: "14px" }}>⚠️</div>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "8px" }}>
            Something went wrong
          </div>
          <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "20px", maxWidth: "320px" }}>
            {this.props.label ?? "An unexpected error occurred."} Try refreshing the page — if the issue persists, check your API configuration.
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "1px solid var(--color-border)",
              background: "transparent",
              color: "var(--color-text-primary)",
              fontSize: "13px",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            Refresh the page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
