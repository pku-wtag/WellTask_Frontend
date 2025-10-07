export interface AuthPageLayout {
  title: string;
  description: string;
  url: { label: string; path: string };
  alert: {
    title?: string;
    message: string;
  };
}

export const authPageConfigs: Record<string, AuthPageLayout> = {
  forgotPassword: {
    title: "Forgot Password?",
    description:
      "We are sorry to hear that happened. Don’t be sad, we can help you get back to productivity in no time.",
    url: { label: "Create Account", path: "/signup" },
    alert: {
      title: "Hello,",
      message: "You need to send a recovery link to this email!",
    },
  },

  verifyCode: {
    title: "Verify Code",
    description:
      "We’ve sent a 6-digit verification code to your email. Enter it below to continue.",
    url: { label: "Back to Login", path: "/login" },
    alert: {
      title: "Hello,",
      message: "Check your inbox for the verification code!",
    },
  },

  resetPassword: {
    title: "Create New Password",
    description:
      "Your new password must be different from your previously used passwords.",
    url: { label: "Back to Login", path: "/login" },
    alert: {
      title: "Hello,",
      message: "You can now set a new password.",
    },
  },
};
