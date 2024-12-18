import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CheckIcon from "@mui/icons-material/Check";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { showAlert, hideAlert } from "../redux/slices/alertSlice";

export default function SimpleAlert() {
  const alertData = useSelector((state: RootState) => state.alert);

  const dispatch = useDispatch<AppDispatch>();

  if (alertData?.visible) {
    const timer = setTimeout(() => {
      dispatch(hideAlert());
      clearTimeout(timer);
    }, 3000);
  }

  return alertData?.visible ? (
    <Alert
      icon={<CheckIcon fontSize="inherit" />}
      // variant="outlined"
      color={alertData?.type}
      severity={alertData?.type}
      style={{ marginTop: "2rem" }}
    >
      <AlertTitle>
        {alertData?.type.charAt(0).toUpperCase() + alertData?.type.slice(1)}
      </AlertTitle>
      {alertData.message}
    </Alert>
  ) : null;
}
