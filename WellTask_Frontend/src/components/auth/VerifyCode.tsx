import { AuthCardLayout } from "@/components/base-component/AuthCardLayout";
import { Button } from "@/components/base-component/Button";
import { OTPInput } from "@/components/base-component/OTPInput";
import { Form } from "react-final-form";

export default function VerifyCode() {
  const layoutObj = {
    title: "Verify Code",
    description:
      "We’ve sent a 6-digit verification code to your email. Enter it below to continue.",
    topRightLink: { label: "Back to Login", to: "/login" },
    alert: {
      title: "Hello Mano,",
      message: "Check your inbox for the verification code!",
    },
  };

  return (
    <AuthCardLayout
      title={layoutObj.title}
      description={layoutObj.description}
      topRightLink={layoutObj.topRightLink}
      alert={layoutObj.alert}
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
