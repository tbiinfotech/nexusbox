import React from "react";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import MobileDrawer from "../component/MobileDrawer";

export default function AuthLayout({ children }) {
  return (
    <React.Fragment>
      <Box className="main_layout">
        <Box
          sx={{ display: { xs: "block", md: "none" } }}
          className="mobile_drawer">
          <MobileDrawer />
        </Box>
        <Box className="layout_inner">
          <Box className="page_with_sidebar">
            <Box
              component="aside"
              className="sidebar_main"
              sx={{ display: { md: "block", xs: "none" } }}>
              <Sidebar />
            </Box>
            <Box component="main" className="pages_main">
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}
