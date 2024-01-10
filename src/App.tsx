import { useState } from "react";

import classNames from "classnames";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AdminDashboard from "components/Admin";
import Chat from "components/Chat";
import ErrorBoundary from "common/ErrorBoundary";
import CreateWizards from "components/CreateWizards";
import Sidebar from "components/common/Sidebar";
import Header from "components/common/Header";
import Footer from "components/common/Footer";
import PageLoader from "components/common/PageLoader";
import PrivateRoute from "components/common/PrivateRoute";
import CreateAgent from "components/CreateAgent";
import Page404 from "common/Page404";
import { ToastContainer } from "react-toastify";
import "common/i18n";

import "stylesheets/index.scss";
import "remixicon/fonts/remixicon.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem("dfinityWallet")
  );
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div
          className={classNames("hk-wrapper full-width", {
            default: isExpanded,
            collapsed: !isExpanded,
          })}
        >
          <Sidebar {...{ isExpanded, setIsExpanded, isAdmin }} />
          <Header
            {...{
              isLoggedIn,
              setIsLoggedIn,
              setIsLoading,
              isAdmin,
              setIsAdmin,
            }}
          />
          <div className="container-fluid p-0">
            <div className="hk-pg-wrapper">
              <div className="mx-4 pt-2">
                <div className="w-100 mt-2">
                  {isLoading ? (
                    <PageLoader />
                  ) : (
                    <Routes>
                      <Route path="/chat/:id?" element={<Chat />} />
                      <Route
                        path="/"
                        element={<CreateWizards isLoggedIn={isLoggedIn} />}
                      />
                      <Route path="/create-agent/*" element={<CreateAgent />} />
                      <Route
                        path="/admin/*"
                        element={
                          <PrivateRoute
                            component={AdminDashboard}
                            isAdmin={isAdmin}
                          />
                        }
                      />
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
    </ErrorBoundary>
  );
}

export default App;
