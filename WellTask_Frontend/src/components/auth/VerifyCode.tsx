import { Button } from "@/components/base-component/Button";
import { Form } from "react-final-form";
import { AuthCardLayout } from "../base-component/AuthCardLayout";
import { OTPInput } from "../base-component/OTPinput";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { Dialog } from "../base-component/Dialog";
import { setMessage, setError } from "@/redux/slices/authSlice";
import { authPageConfigs } from "./authPageConfigs";

export default function VerifyCode() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { message, error } = useSelector(
    (state: RootState) => state.auth
  );

  const layout = authPageConfigs.verifyCode;

  const handleVerifyCode = async (values: Record<string, string>) => {
    const otp = Array.from(
      { length: 6 },
      (_, i) => values[`otp-${i}`] || ""
    ).join("");

    if (otp === "123456") {
      dispatch(setMessage("OTP verified successfully!"));
      setTimeout(() => navigate("/reset-password"), 1500);
    } else {
      dispatch(setError("Invalid OTP. Please try again."));
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
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <OTPInput length={6} namePrefix="otp" />
            <Button htmlType="submit" fullWidth>
              Verify & Continue
            </Button>
          </form>
        )}
      />
    </AuthCardLayout>
  );
}
