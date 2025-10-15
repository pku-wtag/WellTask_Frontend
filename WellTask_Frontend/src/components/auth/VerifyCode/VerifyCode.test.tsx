import React from "react";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { useMessage } from "@/hooks/useMessage";
import { verifyOTPThunk, forgotPassword } from "@/redux/thunks/authThunks";
import VerifyCode from "./VerifyCode";

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (fn: any) => fn({ auth: { forgotEmail: "test@example.com" } }),
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

vi.mock("@/components/base-component/AuthCardLayout", () => ({
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
    <div>
      {Array.from({ length }).map((_, i) => (
        <input key={i} data-testid={`${namePrefix}-${i}`} />
      ))}
    </div>
  ),
}));

interface FakeForm {
  reset: () => void;
  resetFieldState: (field: string) => void;
}

vi.mock("react-final-form", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-final-form")>();
  return {
    ...actual,
    Form: ({
      onSubmit,
      render,
    }: {
      onSubmit: (
        values: Record<string, string>,
        form: FakeForm
      ) => Promise<void>;
      render: (props: {
        handleSubmit: React.FormEventHandler;
        form: FakeForm;
        submitting: boolean;
      }) => React.ReactNode;
    }) => {
      const fakeForm: FakeForm = {
        reset: vi.fn(),
        resetFieldState: vi.fn(),
      };

      const handleSubmit: React.FormEventHandler = async (event) => {
        event?.preventDefault?.();
        await onSubmit(
          {
            "otp-0": "1",
            "otp-1": "2",
            "otp-2": "3",
            "otp-3": "4",
            "otp-4": "5",
            "otp-5": "6",
          },
          fakeForm
        );
      };

      return render({ handleSubmit, form: fakeForm, submitting: false });
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const mockUseMessage = vi.mocked(useMessage);

describe("VerifyCode Page", () => {
  it("renders OTP inputs and buttons", () => {
    render(
      <MemoryRouter>
        <VerifyCode />
      </MemoryRouter>
    );

    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId(`otp-${i}`)).toBeInTheDocument();
    }

    expect(screen.getByText("Verify & Continue")).toBeInTheDocument();
    expect(screen.getByText("Resend OTP")).toBeInTheDocument();
    expect(screen.getByText("Change Email")).toBeInTheDocument();
  });

  it("displays success message from useMessage", () => {
    mockUseMessage.mockReturnValue({ message: "Success!", error: "" });

    render(
      <MemoryRouter>
        <VerifyCode />
      </MemoryRouter>
    );

    const dialog = screen.getByTestId("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent("Success!");
    expect(dialog).toHaveAttribute("data-type", "success");
  });

  it("displays error message from useMessage", () => {
    mockUseMessage.mockReturnValue({ message: "", error: "Error!" });

    render(
      <MemoryRouter>
        <VerifyCode />
      </MemoryRouter>
    );

    const dialog = screen.getByTestId("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent("Error!");
    expect(dialog).toHaveAttribute("data-type", "error");
  });

  it("navigates to /reset-password on successful OTP verification", async () => {
    mockDispatch.mockResolvedValue({
      type: verifyOTPThunk.fulfilled.type,
      payload: {},
    });

    render(
      <MemoryRouter>
        <VerifyCode />
      </MemoryRouter>
    );

    const submitButton = screen.getByText("Verify & Continue");

    await act(async () => {
      submitButton.click();
      await vi.runAllTimersAsync();
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/reset-password");
  });

  it("resets OTP fields and does not navigate on invalid OTP", async () => {
    mockDispatch.mockResolvedValue({
      type: verifyOTPThunk.rejected.type,
      payload: { code: "INVALID_CREDENTIALS" },
    });

    render(
      <MemoryRouter>
        <VerifyCode />
      </MemoryRouter>
    );

    const submitButton = screen.getByText("Verify & Continue");

    await act(async () => {
      submitButton.click();
      await vi.runAllTimersAsync();
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("resends OTP on clicking Resend OTP button", async () => {
    mockDispatch.mockResolvedValue({
      type: forgotPassword.fulfilled.type,
      payload: {},
    });

    render(
      <MemoryRouter>
        <VerifyCode />
      </MemoryRouter>
    );

    const resendButton = screen.getByText("Resend OTP");

    await act(async () => {
      resendButton.click();
      await vi.runAllTimersAsync();
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("navigates to /forgot-password on Change Email button click", async () => {
    render(
      <MemoryRouter>
        <VerifyCode />
      </MemoryRouter>
    );

    const changeEmailButton = screen.getByText("Change Email");

    await act(async () => {
      changeEmailButton.click();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/forgot-password");
  });
});
