export const required = (
  value: string | undefined | null
): string | undefined => {
  return value ? undefined : "This field is required";
};

export const minLength =
  (min: number) =>
  (value: string | undefined | null): string | undefined => {
    return value && value.length >= min
      ? undefined
      : `Must be at least ${min} characters`;
  };

export const maxLength =
  (max: number) =>
  (value: string | undefined | null): string | undefined => {
    return value && value.length <= max
      ? undefined
      : `Must be at most ${max} characters`;
  };

export const email = (value: string | undefined | null): string | undefined => {
  if (!value) return "This field is required";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value) ? undefined : "Invalid email address";
};

export const passwordStrength = (
  value: string | undefined | null
): string | undefined => {
  if (!value) return "This field is required";
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(value)
    ? undefined
    : "Password must include uppercase, lowercase, number, and symbol";
};
