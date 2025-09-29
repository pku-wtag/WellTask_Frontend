import { Button } from "@/components/base-component/Button";
import { Form } from "react-final-form";
import { AuthCardLayout } from "../base-component/AuthCardLayout";
import { OTPInput } from "../base-component/OTPinput";

export default function VerifyCode() {
  const layout = {
    title: "Verify Code",
    description:
      "We’ve sent a 6-digit verification code to your email. Enter it below to continue.",
    topRightLink: { label: "Back to Login", path: "/login" },
    alert: {
      title: "Hello Mano,",
      message: "Check your inbox for the verification code!",
    },
  };

  return (
    <AuthCardLayout
      title={layout.title}
      description={layout.description}
      topRightLink={layout.topRightLink}
      alert={layout.alert}
    >
      <Form
        onSubmit={() => {}}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <OTPInput length={6} namePrefix="otp" />
            <Button fullWidth>Verify & Continue</Button>
          </form>
        )}
      />
    </AuthCardLayout>
  );
}
