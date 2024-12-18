import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import DashboardIcon from "@mui/icons-material/Dashboard";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

import Typography from "@mui/material/Typography";
import Breadcrumbs from "../components/Bredcumbs";
import Link from "@mui/material/Link";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import { useLocation } from "react-router-dom";
import VoiceChatIcon from "@mui/icons-material/VoiceChat";
import DatasetLinkedIcon from "@mui/icons-material/DatasetLinked";

const iconStyle = {
  //  color: "#d04a02",
  color: "black",
  fontSize: 25,
  marginRight: 5,
};
const routes = [
  {
    path: "/home",
    name: "Home",
    icon: () => <HomeIcon style={iconStyle} />,
  },
  {
    path: "/sql-chat",
    name: "Q&A (Stracture)",
    icon: () => <SpeakerNotesIcon style={iconStyle} />,
  },
  {
    path: "/db-config",
    name: "RDBMS Configuration",
    icon: () => <DatasetLinkedIcon style={iconStyle} />,
  },
  {
    path: "/data-chat",
    name: "Q&A (Un-Stracture)",
    icon: () => <VoiceChatIcon style={iconStyle} />,
  },
  {
    path: "/query",
    name: "Saved Query",
    icon: () => <SaveAsIcon style={iconStyle} />,
  },

  {
    path: "/upload",
    name: "Knowledge Base",
    icon: () => <UploadFileIcon style={iconStyle} />,
  },
  {
    path: "/config",
    name: "Configuration",
    icon: () => <SettingsIcon style={iconStyle} />,
  },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  console.log("window.location.pathname", window.location.href);

  return (
    <div>
      <div className="chatbot-page">
        <div className="header-container">
          <div className="logoDiv">
            <h2 style={{ color: "black", fontWeight: 500, fontSize: 20 }}>
              Intelligent{" "}
              <b style={{ color: "#d04a02", fontWeight: 700 }}>Assistant</b>
            </h2>
          </div>
          <div className="userDiv">
            <span style={{ marginRight: 15, fontSize: 12 }}>
              Moldel in use:{" "}
              <b>
                {localStorage.getItem("model")?.toUpperCase()?.toUpperCase()}
              </b>
            </span>
            <img
              className="user"
              src="data:image/png;base64,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"
              alt="User Icon"
            />
            <div>
              <div className="userName"></div>
              <div className="role"></div>
            </div>
          </div>
        </div>
        <div className="main-container">
          <div className="sidenav">
            {routes.map((route) => {
              return (
                <a
                  className={`nav-link ${
                    window.location.href.includes(`${route.path}`)
                      ? "active-link"
                      : ""
                  }`}
                  href={`#${route.path}`}
                  onClick={(e) => {
                    document
                      .querySelectorAll(".nav-link")
                      .forEach((link) => link.classList.remove("active-link"));
                    e.currentTarget.classList.add("active-link");
                  }}
                >
                  <button className="sidenav-button">
                    {route.icon()}
                    <span style={{ fontSize: 14 }}>{route.name}</span>
                  </button>
                </a>
              );
            })}
          </div>
          <div className="content-container">
            <div>
              <Breadcrumbs routes={routes} />

              {children}
            </div>
          </div>
        </div>
      </div>
      {/* <footer
        style={{
          backgroundColor: "black",
          color: "white",
          width: "100%",
          textAlign: "center",
          padding: "10px 0",
          // position: "fixed",
          bottom: 0,
          // height: 100,
        }}
      >
        <Typography variant="body2" color="inherit">
          © 2023 Your Company. All rights reserved.
        </Typography>
      </footer> */}
    </div>
  );
};

export default Layout;
