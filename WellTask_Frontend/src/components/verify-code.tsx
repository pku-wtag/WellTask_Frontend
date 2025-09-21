import { AuthCardLayout } from "@/components/base-component/AuthCardLayout";
import { Button } from "@/components/base-component/Button";
import { OTPInput } from "@/components/base-component/OTPInput";

export default function VerifyCodePage() {
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

  const formObj = {
    fields: [
      {
        type: "otp",
        length: 6,
      },
    ],
    submitText: "Verify & Continue",
  };

  return (
    <AuthCardLayout
      title={layoutObj.title}
      description={layoutObj.description}
      topRightLink={layoutObj.topRightLink}
      alert={layoutObj.alert}
    >
      <form className="space-y-6 text-left">
        {formObj.fields.map((field, index) =>
          field.type === "otp" ? (
            <OTPInput key={index} length={field.length} />
          ) : null
        )}
        <Button fullWidth>{formObj.submitText}</Button>
      </form>
    </AuthCardLayout>
  );
}
