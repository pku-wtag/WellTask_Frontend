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

  const handleVerifyCode = async (
    values: Record<string, unknown>,
    form: FormApi<Record<string, unknown>>
  ) => {
    const otpValues = Array.from(
      { length: 6 },
      (_, i) => values[`otp-${i}`] || ""
    );
    const empty = otpValues.some((v) => !v);

    if (empty) {
      dispatch(setError("Please fill all OTP fields"));
      return;
    }

    const otp = otpValues.join("");
    const result = await dispatch(verifyOTPThunk({ otp }));

    if (verifyOTPThunk.fulfilled.match(result)) {
      form.reset();
      setTimeout(() => navigate("/reset-password"), NAVIGATION_DELAY_MS);
    }

    if (verifyOTPThunk.rejected.match(result)) {
      form.reset();
      if (result.payload?.code === "INVALID_CREDENTIALS") return;
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
        render={({ handleSubmit, submitting }) => (
          <>
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
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
