import React from "react";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { useMessage } from "@/hooks/useMessage";
import { resetPassword } from "@/redux/thunks/authThunks";
import ResetPassword from "./ResetPassword";
import type { RootState } from "@/redux/store";

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();
const mockUseSelector =
  vi.fn<(selector: (state: RootState) => unknown) => unknown>();

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: RootState) => unknown) =>
    mockUseSelector(selector),
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

vi.mock("../../fields/Input", () => ({
  Input: ({ id, label }: { id: string; label: string }) => (
    <div data-testid={`input-${id}`}>{label}</div>
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
      onSubmit: (values: Record<string, string>) => Promise<void>;
      render: (props: {
        handleSubmit: React.FormEventHandler;
        form: FakeForm;
        submitting: boolean;
      }) => React.ReactNode;
    }) => {
      const handleSubmit: React.FormEventHandler = async (event) => {
        event?.preventDefault?.();
        await onSubmit({
          password: "Password123!",
          confirmPassword: "Password123!",
        });
      };
      const fakeForm: FakeForm = { reset: vi.fn(), resetFieldState: vi.fn() };
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

describe("ResetPassword Page", () => {
  it("renders input fields and Update Password button", () => {
    mockUseSelector.mockReturnValue("test@example.com"); // normal case

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    expect(screen.getByTestId("input-password")).toBeInTheDocument();
    expect(screen.getByTestId("input-confirmPassword")).toBeInTheDocument();
    expect(screen.getByText("Update Password")).toBeInTheDocument();
  });

  it("displays success message from useMessage", () => {
    mockUseMessage.mockReturnValue({ message: "Success!", error: "" });
    mockUseSelector.mockReturnValue("test@example.com");

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const dialog = screen.getByTestId("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent("Success!");
    expect(dialog).toHaveAttribute("data-type", "success");
  });

  it("displays error message from useMessage", () => {
    mockUseMessage.mockReturnValue({ message: "", error: "Error!" });
    mockUseSelector.mockReturnValue("test@example.com");

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const dialog = screen.getByTestId("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent("Error!");
    expect(dialog).toHaveAttribute("data-type", "error");
  });

  it("does not display dialog when no message or error", () => {
    mockUseMessage.mockReturnValue({ message: "", error: "" });
    mockUseSelector.mockReturnValue("test@example.com");

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("navigates to /login on successful resetPassword", async () => {
    mockUseSelector.mockReturnValue("test@example.com");
    mockDispatch.mockResolvedValue({
      type: resetPassword.fulfilled.type,
      payload: {},
    });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const button = screen.getByText("Update Password");

    await act(async () => {
      button.click();
      await vi.runAllTimersAsync();
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("navigates to /signup on NO_ACCOUNT error", async () => {
    mockUseSelector.mockReturnValue("test@example.com");
    mockDispatch.mockResolvedValue({
      type: resetPassword.rejected.type,
      payload: { code: "NO_ACCOUNT" },
    });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const button = screen.getByText("Update Password");

    await act(async () => {
      button.click();
      await vi.runAllTimersAsync();
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });

  it("sets error but does not navigate for other failures", async () => {
    mockUseSelector.mockReturnValue("test@example.com");
    mockDispatch.mockResolvedValue({
      type: resetPassword.rejected.type,
      payload: { code: "UNKNOWN_ERROR" },
    });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const button = screen.getByText("Update Password");

    await act(async () => {
      button.click();
      await vi.runAllTimersAsync();
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("redirects to /forgot-password if forgotEmail is missing", () => {
    mockUseSelector.mockReturnValueOnce("");

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/forgot-password");
  });
});
