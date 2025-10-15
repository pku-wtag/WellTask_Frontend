import { useEffect } from "react";
import { Button } from "@/components/base-component/Button";
import { Form } from "react-final-form";
import { AuthCardLayout } from "../../base-component/AuthCardLayout/AuthCardLayout";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  setMessage,
  setError,
  clearMessage,
  clearError,
} from "@/redux/slices/authSlice";
import type { FormApi } from "final-form";
import { authPageConfigs } from "../authPageConfigs";
import { MESSAGE_DURATION_MS, NAVIGATION_DELAY_MS } from "@/utils/constants";
import { useMessage } from "@/hooks/useMessage";
import { Dialog } from "../../base-component/Dialog/Dialog";
import { verifyOTPThunk, forgotPassword } from "@/redux/thunks/authThunks";
import { OTPInput } from "@/components/base-component/OTPinput";

export default function VerifyCode() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { forgotEmail } = useSelector((state: RootState) => state.auth);

  const layout = authPageConfigs.verifyCode;

  const { message, error } = useMessage({
    selectSlice: (state) => state.auth,
    duration: MESSAGE_DURATION_MS,
    clearMessage,
    clearError,
  });

  useEffect(() => {
    if (!forgotEmail) {
      navigate("/forgot-password");
    }
  }, [forgotEmail, navigate]);

  const resetOTPFields = (form: FormApi<Record<string, unknown>>) => {
    form.reset();

    Array.from({ length: 6 }).forEach((_, i) =>
      form.resetFieldState(`otp-${i}`)
    );
  };

  const handleVerifyCode = async (
    values: Record<string, unknown>,
    form: FormApi<Record<string, unknown>>
  ) => {
    const otp = Array.from(
      { length: 6 },
      (_, i) => values[`otp-${i}`] || ""
    ).join("");

    const result = await dispatch(verifyOTPThunk({ otp }));

    if (verifyOTPThunk.fulfilled.match(result)) {
      resetOTPFields(form);

      setTimeout(() => {
        navigate("/reset-password");
      }, NAVIGATION_DELAY_MS);

      return;
    }

    if (verifyOTPThunk.rejected.match(result)) {
      resetOTPFields(form);

      if (result.payload?.code === "INVALID_CREDENTIALS") {
        return;
      }
    }
  };

  const handleResendOTP = async () => {
    if (!forgotEmail) {
      dispatch(
        setError("Email not found. Please go back and enter your email.")
      );

      setTimeout(() => navigate("/forgot-password"), NAVIGATION_DELAY_MS);

      return;
    }

    const result = await dispatch(forgotPassword(forgotEmail));

    if (forgotPassword.fulfilled.match(result)) {
      dispatch(setMessage("OTP resent! Check console for code."));
    }
  };

  const handleFormSubmit =
    (
      handleSubmit: (
        event?: SubmitEvent
      ) => Promise<Record<string, unknown> | undefined> | undefined,
      form: FormApi<Record<string, unknown>>
    ) =>
    async (event: React.FormEvent<HTMLFormElement>) => {
      const result = await handleSubmit(event.nativeEvent as SubmitEvent);

      resetOTPFields(form);

      return result;
    };

  return (
    <AuthCardLayout
      title={layout.title}
      description={layout.description}
      url={layout.url}
      alert={layout.alert}
    >
      {(message || error) && (
        <Dialog
          message={message || error || ""}
          type={message ? "success" : "error"}
          duration={MESSAGE_DURATION_MS}
        />
      )}

      <Form
        onSubmit={handleVerifyCode}
        render={({ handleSubmit, form, submitting }) => (
          <>
            <form
              onSubmit={handleFormSubmit(handleSubmit, form)}
              className="space-y-6 text-left"
            >
              <OTPInput length={6} namePrefix="otp" />

              <Button htmlType="submit" fullWidth disabled={submitting}>
                Verify & Continue
              </Button>
            </form>

            <div className="flex justify-between mt-4">
              <Button
                type="outline"
                onClick={(e) => {
                  e.preventDefault();
                  handleResendOTP();
                }}
              >
                Resend OTP
              </Button>

              <Button
                type="outline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/forgot-password");
                }}
              >
                Change Email
              </Button>
            </div>
          </>
        )}
      />
    </AuthCardLayout>
  );
}
