import React, { ReactNode } from "react";

import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

import { useLocation } from "react-router-dom";

interface Route {
  path: string;
  name: string;
}

function DynamicBreadcrumbs({ routes }: { routes: Route[] }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link underline="hover" color="inherit" href="/">
        Home
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const route = routes.find((route) => route.path === to);

        return route ? (
          <Link underline="hover" color="inherit" href={to} key={to}>
            {route.name}
          </Link>
        ) : (
          <Typography key={to} sx={{ color: "text.primary" }}>
            {value}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
}

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

export default function BasicBreadcrumb({ routes }: { routes: Route[] }) {
  return (
    <div
      role="presentation"
      onClick={handleClick}
      style={{ marginTop: 30, marginBottom: "-15px" }}
    >
      <DynamicBreadcrumbs routes={routes} />
    </div>
  );
}
