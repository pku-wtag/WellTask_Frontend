import { Button } from "@/components/base-component/Button";
import { Form } from "react-final-form";
import { AuthCardLayout } from "../base-component/AuthCardLayout";
import { OTPInput } from "../base-component/OTPinput";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { sendRecoveryLink } from "@/redux/thunks/authThunks";
import { setVerified } from "@/redux/slices/authSlice";
import { useAuthMessage } from "@/hooks/useAuthMessage";
import type { FormApi } from "final-form";
import { authPageConfigs } from "./authPageConfigs";
import { useEffect } from "react";
import { Dialog } from "../base-component/Dialog";

export default function VerifyCode() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { forgotEmail } = useSelector((state: RootState) => state.auth);

  const layout = authPageConfigs.verifyCode;

  const { message, error } = useAuthMessage(3000);

  useEffect(() => {
    if (!forgotEmail) {
      navigate("/forgot-password");
    }
  }, [forgotEmail, navigate]);

  const handleVerifyCode = async (
    values: Record<string, unknown>,
    form: FormApi<Record<string, unknown>>
  ) => {
    const otp = Array.from(
      { length: 6 },
      (_, i) => values[`otp-${i}`] || ""
    ).join("");

    if (otp === "123456") {
      dispatch(setVerified());
      dispatch({
        type: "auth/setMessage",
        payload: "OTP verified successfully!",
      });

      form.reset();
      Array.from({ length: 6 }).forEach((_, i) =>
        form.resetFieldState(`otp-${i}`)
      );
      setTimeout(() => navigate("/reset-password"), 500);
    } else {
      dispatch({
        type: "auth/setError",
        payload: "Invalid OTP. Please try again.",
      });
    }
  };

  const handleResendOTP = async () => {
    if (!forgotEmail) {
      dispatch({
        type: "auth/setError",
        payload: "Email not found. Please go back and enter your email.",
      });
      setTimeout(() => navigate("/forgot-password"), 500);
      return;
    }

    try {
      await dispatch(sendRecoveryLink(forgotEmail)).unwrap();
    } catch {
      dispatch({
        type: "auth/setError",
        payload: "Failed to resend OTP. Please try again.",
      });
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
          duration={3000}
        />
      )}

      <Form
        onSubmit={handleVerifyCode}
        render={({ handleSubmit, form, submitting }) => (
          <>
            <form
              onSubmit={async (event) => {
                const result = await handleSubmit(event);
                form.reset();
                Array.from({ length: 6 }).forEach((_, i) =>
                  form.resetFieldState(`otp-${i}`)
                );

                return result;
              }}
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
