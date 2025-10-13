export const required = (
  value: string | undefined | null
): string | undefined => {
  if (value) {
    return undefined;
  } else {
    return "This field is required";
  }
};

export const minLength =
  (min: number) =>
  (value: string | undefined | null): string | undefined => {
    if (value && value.length >= min) {
      return undefined;
    } else {
      return `Must be at least ${min} characters`;
    }
  };

export const maxLength =
  (max: number) =>
  (value: string | undefined | null): string | undefined => {
    if (value && value.length <= max) {
      return undefined;
    } else {
      return `Must be at most ${max} characters`;
    }
  };

export const email = (value: string | undefined | null): string | undefined => {
  if (!value) {
    return "This field is required";
  } else {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regex.test(value)) {
      return undefined;
    } else {
      return "Invalid email address";
    }
  }
};

export const passwordStrength = (
  value: string | undefined | null
): string | undefined => {
  if (!value) {
    return "This field is required";
  } else {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (regex.test(value)) {
      return undefined;
    } else {
      return "Password must include uppercase, lowercase, number, and symbol";
    }
  }
};
