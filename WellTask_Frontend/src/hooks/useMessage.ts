import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import type { AppDispatch, RootState } from "@/redux/store";
import type { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { MESSAGE_DURATION_MS } from "@/utils/constants";

interface UseMessageOptions<T> {
  selectSlice: (state: RootState) => T;
  duration?: number;
  clearMessage: ActionCreatorWithoutPayload;
  clearError: ActionCreatorWithoutPayload;
}

export function useMessage<
  T extends { message: string | null; error: string | null }
>({
  selectSlice,
  duration = MESSAGE_DURATION_MS,
  clearMessage,
  clearError,
}: UseMessageOptions<T>) {
  const dispatch = useDispatch<AppDispatch>();
  const { message, error } = useSelector(selectSlice);
  const location = useLocation();

  useEffect(() => {
    if (message || error) {
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
      };
    }
  }, [message, error, dispatch, duration, clearMessage, clearError]);

  useEffect(() => {
    if (message) {
      dispatch(clearMessage());
    }
    if (error) {
      dispatch(clearError());
    }
  }, [location.pathname, dispatch, clearMessage, clearError]);

  return { message, error };
}
