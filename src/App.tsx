import PageLoader from "components/common/PageLoader";
import { useState } from "react";

import classNames from "classnames";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import AdminDashboard from "components/Admin";
import Chat from "components/Chat";
import ErrorBoundary from "common/ErrorBoundary";
import ViewAgents from "components/ViewAgents";
import Sidebar from "components/common/Sidebar";
import Header from "components/common/Header";
import Footer from "components/common/Footer";
import PrivateRoute from "components/common/PrivateRoute";
import Page404 from "common/Page404";
import queryClient from "utils/queryClient";
import "common/i18n";

import "stylesheets/index.scss";
import "remixicon/fonts/remixicon.css";
import "react-toastify/dist/ReactToastify.css";
import MySpace from "components/MySpace";
import ToolDetails from "components/DeveloperStudio/ToolDetails";
import CreateAgent from "components/CreateAgent";
import AddProfile from "components/MySpace/Profile/AddProfile";
import PopularWizards from "components/ViewAgents/PopularWizards";
import DeveloperStudio from "components/DeveloperStudio";
import WidgetIntegration from "components/ViewAgents/WidgetIntegration/WidgetIntegration";
import LoggedInRoute from "components/common/LoggedInRoute";
import Login from "components/common/Login";

function App() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div
            className={classNames("hk-wrapper w-100vw", {
              default: isExpanded,
              collapsed: !isExpanded,
            })}
          >
            <Sidebar {...{ isExpanded, setIsExpanded }} />
            <Header setIsLoading={setIsLoading} />
            <div className="container-fluid p-0">
              <div className="hk-pg-wrapper">
                <div className="mx-4 pt-2">
                  <div className="w-100 mt-2">
                    {isLoading ? (
                      <PageLoader />
                    ) : (
                      <Routes>
                        <Route path="/chat/:id?" element={<LoggedInRoute><Chat /></LoggedInRoute>} />
                        <Route path="/" element={<ViewAgents />} />
                        <Route path="/agents/:id/integrations/chat-widget" element={<WidgetIntegration />} />{/* Incomplete feature, to be removed */}
                        <Route
                          path="/my-space/*"
                          element={<LoggedInRoute><MySpace /></LoggedInRoute>}
                        />
                        <Route
                          path="/create-agent/*"
                          element={<LoggedInRoute><CreateAgent /></LoggedInRoute>}
                        />
                        <Route
                          path="/agent-marketplace/*"
                          element={<PopularWizards isHomePage={false} />}
                        />
                        <Route
                          path="/developer-studio/*"
                          element={<LoggedInRoute><DeveloperStudio /></LoggedInRoute>}
                        />
                        <Route
                          path="/admin/*"
                          element={<PrivateRoute component={AdminDashboard} />}
                        />
                        <Route path="/profile/add" element={<LoggedInRoute><AddProfile /></LoggedInRoute>} />
                        <Route path="/tool-details/:id?" element={<ToolDetails />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<Page404 />} />
                      </Routes>
                    )}
                    <Footer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BrowserRouter>
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
