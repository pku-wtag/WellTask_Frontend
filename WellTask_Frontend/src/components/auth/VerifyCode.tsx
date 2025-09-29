import { Button } from "@/components/base-component/Button";
import { Form } from "react-final-form";
import { AuthCardLayout } from "../base-component/AuthCardLayout";
import { OTPInput } from "../base-component/OTPinput";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog } from "../base-component/Dialog";

export default function VerifyCode() {
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const layout = {
    title: "Verify Code",
    description:
      "We’ve sent a 6-digit verification code to your email. Enter it below to continue.",
    url: { label: "Back to Login", path: "/login" },
    alert: {
      title: user ? `Hello ${user.fullname},` : "Hello,",
      message: "Check your inbox for the verification code!",
    },
  };

  const handleVerifyCode = (values: Record<string, string>) => {
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += values[`otp-${i}`] || "";
    }

    if (otp === "123456") {
      setDialog({ message: "OTP verified successfully!", type: "success" });
      setTimeout(() => navigate("/reset-password"), 1500);
    } else {
      setDialog({ message: "Invalid OTP. Please try again.", type: "error" });
    }
  };

  return (
    <AuthCardLayout
      title={layout.title}
      description={layout.description}
      url={layout.url}
      alert={layout.alert}
    >
      {dialog && (
        <Dialog
          message={dialog.message}
          type={dialog.type}
          onClose={() => setDialog(null)}
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
