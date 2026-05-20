import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.tsx";
import Home from "./pages/Home/Home.tsx";
import HelpCenter from "./pages/Help/HelpCenter";
import SubmitToolPage from "./pages/Submit/SubmitToolPage.tsx";
import NotFound from "./pages/NotFound/NotFound";
import { AccessibilityProvider } from "./context/AccessibilityContext.tsx";
import "./index.css";

/* 루트 렌더링 */
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AccessibilityProvider>
            <BrowserRouter>
                <Routes>
                    {/* 레이아웃 라우트(App 안에 <Outlet/> 포함) */}
                    <Route path="/" element={<App />}>
                        {/* 인덱스 라우트 = "/" */}
                        <Route index element={<Home />} />

                        {/* 기타 페이지 */}
                        <Route path="help" element={<HelpCenter />} />
                        <Route path="submit" element={<SubmitToolPage />} />

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AccessibilityProvider>
    </React.StrictMode>
);
