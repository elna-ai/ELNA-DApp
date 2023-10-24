import React, { ErrorInfo, ReactNode } from "react";

import { Button } from "react-bootstrap";
import { t } from "i18next";
import Image404 from "../images/404-error.png";
import { Trans } from "react-i18next";

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="h-screen flex flex-row">
          <div className="m-auto">
            <img src={Image404} />
            <div className="flex">
              <div className="m-auto">
                <p>
                  {t("errorBoundary.title", {
                    appName: t(import.meta.env.VITE_APP_NAME),
                  })}
                </p>
                <Trans
                  i18nKey="errorBoundary.description"
                  components={{ h3: <h3 />, p: <p /> }}
                />
                <Button className="btn-primary">
                  {t("common.backToHome")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
