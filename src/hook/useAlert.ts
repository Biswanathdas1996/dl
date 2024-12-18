import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { showAlert, hideAlert } from "../redux/slices/alertSlice";

export const useAlert = () => {
  const dispatch = useDispatch<AppDispatch>();

  const triggerAlert = (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    dispatch(showAlert({ message, type }));
  };

  const hide = () => {
    dispatch(hideAlert());
  };

  return { triggerAlert, hide };
};
