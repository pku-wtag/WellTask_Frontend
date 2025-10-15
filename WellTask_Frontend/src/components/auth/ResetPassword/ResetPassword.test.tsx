import React from "react";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { useMessage } from "@/hooks/useMessage";
import { resetPassword } from "@/redux/thunks/authThunks";
import ResetPassword from "./ResetPassword";

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: vi.fn(() => "test@example.com"),
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

vi.mock("../../fields/Input", () => ({
  Input: ({ id, label }: { id: string; label: string }) => (
    <input data-testid={`input-${id}`} aria-label={label} />
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
  }) => (
    <button onClick={onClick} disabled={disabled} type={htmlType}>
      {children}
    </button>
  ),
}));

// Fully typed form interface
interface FakeForm {
  reset: () => void;
  resetFieldState: (field: string) => void;
  getRegisteredFields: () => string[];
}

vi.mock("react-final-form", () => ({
  Form: ({
    onSubmit,
    render,
  }: {
    onSubmit: (values: Record<string, string>) => void | Promise<void>;
    render: (props: {
      handleSubmit: React.FormEventHandler;
      form: FakeForm;
      submitting: boolean;
    }) => React.ReactNode;
  }) => {
    const fakeForm: FakeForm = {
      reset: vi.fn(),
      resetFieldState: vi.fn(),
      getRegisteredFields: () => ["password", "confirmPassword"],
    };

    const handleSubmit: React.FormEventHandler = async (event) => {
      event?.preventDefault?.();
      return onSubmit({ password: "test1234", confirmPassword: "test1234" });
    };

    return <>{render({ handleSubmit, form: fakeForm, submitting: false })}</>;
  },
}));

describe("ResetPassword Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // @ts-ignore
    resetPassword.fulfilled.match = (action) => action.type === "auth/resetPassword/fulfilled";
    // @ts-ignore
    resetPassword.rejected.match = (action) => action.type === "auth/resetPassword/rejected";

    vi.mocked(useMessage).mockReturnValue({ message: "", error: "" });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders form fields and button", () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    expect(screen.getByTestId("input-password")).toBeInTheDocument();
    expect(screen.getByTestId("input-confirmPassword")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Update Password" })
    ).toBeInTheDocument();
  });

  it("displays success message from useMessage", () => {
    vi.mocked(useMessage).mockReturnValue({ message: "Success!", error: "" });

    render(
      <MemoryRouter>
        <ResetPassword />
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
        <ResetPassword />
      </MemoryRouter>
    );

    const dialog = screen.getByTestId("dialog");
    expect(dialog).toHaveTextContent("Error!");
    expect(dialog).toHaveAttribute("data-type", "error");
  });

  it("navigates to login on successful reset", async () => {
    const mockResult = { type: "auth/resetPassword/fulfilled" };
    mockDispatch.mockResolvedValue(mockResult);

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole("button", {
      name: "Update Password",
    });

    await act(async () => {
      submitButton.click();
      await vi.advanceTimersByTimeAsync(1500);
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("navigates to signup when NO_ACCOUNT error occurs", async () => {
    const mockResult = {
      type: "auth/resetPassword/rejected",
      payload: { code: "NO_ACCOUNT" },
    };
    mockDispatch.mockResolvedValue(mockResult);

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole("button", {
      name: "Update Password",
    });

    await act(async () => {
      submitButton.click();
      await vi.advanceTimersByTimeAsync(1500);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });
});
