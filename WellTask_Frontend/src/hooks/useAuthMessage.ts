import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, clearError } from "@/redux/slices/authSlice";
import type { AppDispatch, RootState } from "@/redux/store";

export function useAuthMessage(duration = 3000) {
  const dispatch = useDispatch<AppDispatch>();
  const { message, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!message && !error) {
      return;
    }

    const timer = setTimeout(() => {
      if (message) {
        dispatch(clearMessage());
      }

      if (error) {
        dispatch(clearError());
      }
    }, duration);

    return () => {
      clearTimeout(timer);

      if (message) {
        dispatch(clearMessage());
      }

      if (error) {
        dispatch(clearError());
      }
    };
  }, [message, error, dispatch, duration]);

  return { message, error };
}
