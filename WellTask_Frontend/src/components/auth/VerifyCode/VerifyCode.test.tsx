import React from "react";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import VerifyCode from "./VerifyCode";
import { useMessage } from "@/hooks/useMessage";
import { verifyOTPThunk } from "@/redux/thunks/authThunks";

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: vi.fn(() => ({ forgotEmail: "test@example.com" })),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/hooks/useMessage", () => ({
  useMessage: vi.fn(() => ({ message: "", error: "" })),
}));

vi.mock("@/components/base-component/Dialog/Dialog", () => ({
  Dialog: ({ message, type }: { message: string; type: string }) => (
    <div data-testid="dialog" data-type={type}>
      {message}
    </div>
  ),
}));

vi.mock("../base-component/AuthCardLayout", () => ({
  AuthCardLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("../../base-component/OTPinput", () => ({
  OTPInput: ({
    length,
    namePrefix,
  }: {
    length: number;
    namePrefix: string;
  }) => (
    <div data-testid="otp-input">
      {Array.from({ length }).map((_, i) => (
        <input key={i} name={`${namePrefix}-${i}`} />
      ))}
    </div>
  ),
}));

vi.mock("@/components/base-component/Button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    htmlType,
  }: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    htmlType?: "button" | "submit" | "reset";
    type?: string;
  }) => (
    <button onClick={onClick} disabled={disabled} type={htmlType || "button"}>
      {children}
    </button>
  ),
}));

describe("VerifyCode Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    type ReduxAction = { type?: string; payload?: unknown };

    // @ts-ignore
    verifyOTPThunk.fulfilled.match = (action: unknown): action is ReduxAction =>
      (action as ReduxAction)?.type === "auth/verifyOTP/fulfilled";

    // @ts-ignore
    verifyOTPThunk.rejected.match = (action: unknown): action is ReduxAction =>
      (action as ReduxAction)?.type === "auth/verifyOTP/rejected";

    vi.mocked(useMessage).mockReturnValue({ message: "", error: "" });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders OTP fields and buttons", () => {
    render(
      <MemoryRouter>
        <VerifyCode />
      </MemoryRouter>
    );

    expect(screen.getByTestId("otp-input")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Verify & Continue" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Resend OTP" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Change Email" })
    ).toBeInTheDocument();
  });

  it("displays success message from useMessage", () => {
    vi.mocked(useMessage).mockReturnValue({ message: "Success!", error: "" });

    render(
      <MemoryRouter>
        <VerifyCode />
      </MemoryRouter>
    );

    const dialog = screen.getByTestId("dialog");
    expect(dialog).toHaveTextContent("Success!");
    expect(dialog).toHaveAttribute("data-type", "success");
  });

  it("displays error message from useMessage", () => {
    vi.mocked(useMessage).mockReturnValue({ message: "", error: "Error!" });

    render(
      <MemoryRouter>
        <VerifyCode />
      </MemoryRouter>
    );

    const dialog = screen.getByTestId("dialog");
    expect(dialog).toHaveTextContent("Error!");
    expect(dialog).toHaveAttribute("data-type", "error");
  });

  it("resends OTP successfully", async () => {
    const mockResult = { type: "auth/forgotPassword/fulfilled" };
    mockDispatch.mockResolvedValue(mockResult);

    render(
      <MemoryRouter>
        <VerifyCode />
      </MemoryRouter>
    );

    const resendButton = screen.getByRole("button", { name: "Resend OTP" });

    await act(async () => {
      resendButton.click();
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("navigates to forgot-password when Change Email clicked", async () => {
    render(
      <MemoryRouter>
        <VerifyCode />
      </MemoryRouter>
    );

    const changeButton = screen.getByRole("button", { name: "Change Email" });

    await act(async () => {
      changeButton.click();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/forgot-password");
  });
});
