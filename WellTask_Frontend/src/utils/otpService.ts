let currentOTP: string | null = null;

export const generateOTP = (): string => {
  currentOTP = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("Generated OTP (testing):", currentOTP);
  return currentOTP;
};

export const verifyOTP = (otp: string): boolean => {
  if (otp === currentOTP) {
    currentOTP = null;
    return true;
  }
  return false;
};
