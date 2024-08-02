import React from "react";
import { Suspense, lazy, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./pages/AuthLayout";
import Login from "./pages/Login";
import "@fontsource/gaegu"; // Defaults to weight 400
import "@fontsource/gaegu/400.css"; // Specify weight
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/inter"; // Defaults to weight 400
import "@fontsource/inter/400.css"; // Specify weight
const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));
import routes from "./routes";
import Loader from "./common/loader";
import ProtectedRoute from "./utils/ProtectedRoute";
import PrivateRoute from "./utils/PrivateRoute";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      <Routes>
        <Route index element={<Login />}></Route>
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route element={<DefaultLayout />}>
          {routes.map((routes, index) => {
            const { path, component: Component } = routes;
            return (
              <Route
                key={index}
                path={path}
                element={
                  <Suspense fallback={<Loader />}>
                    <ProtectedRoute path={path}>
                      <PrivateRoute path={path}>
                        <Component />
                      </PrivateRoute>
                    </ProtectedRoute>
                  </Suspense>
                }
              />
            );
          })}
        </Route>
      </Routes>
    </>
  );
}
