import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { useMessage } from "@/hooks/useMessage";
import { loginUser, AuthErrorCode } from "@/redux/thunks/authThunks";
import Login from "./Login";

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
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

vi.mock("@/components/base-component/SidePanel/SidePanel", () => ({
  SidePanel: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div data-testid="side-panel">
      {title} - {subtitle}
    </div>
  ),
}));

import React from "react";

vi.mock("@/components/base-component/Button", () => ({
  Button: ({
    children,
    onClick,
    type,
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button data-type={type} onClick={onClick}>
      {children}
    </button>
  ),
}));

interface FormPanelProps {
  title: string;
  description: string;
  submitText: string;
  redirectLink?: { path: string; text: string };
  onSubmit?: (values: { email: string; password: string }) => void;
}

vi.mock("@/components/base-component/FormPanel/FormPanel", () => ({
  FormPanel: ({
    title,
    description,
    submitText,
    redirectLink,
    onSubmit,
  }: FormPanelProps) => (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <button
        onClick={() =>
          onSubmit?.({ email: "a@test.com", password: "Password1!" })
        }
      >
        {submitText}
      </button>
      {redirectLink && <a href={redirectLink.path}>{redirectLink.text}</a>}
    </div>
  ),
}));

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.mocked(useMessage).mockReturnValue({ message: "", error: "" });

    // @ts-ignore
    loginUser.fulfilled.match = (action) => action.type === "auth/loginUser/fulfilled";
    // @ts-ignore
    loginUser.rejected.match = (action) => action.type === "auth/loginUser/rejected";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all main components", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText("Log in to Your Account")).toBeInTheDocument();
    expect(
      screen.getByText("Enter your credentials to continue")
    ).toBeInTheDocument();
    expect(screen.getByText("Log In")).toBeInTheDocument();
    expect(screen.getByTestId("side-panel")).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText("Forgot Password?")).toBeInTheDocument();
  });

  it("displays success message from useMessage", () => {
    vi.mocked(useMessage).mockReturnValue({ message: "Success!", error: "" });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const dialog = screen.getByTestId("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent("Success!");
    expect(dialog).toHaveAttribute("data-type", "success");
  });

  it("displays error message from useMessage", () => {
    vi.mocked(useMessage).mockReturnValue({ message: "", error: "Error!" });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const dialog = screen.getByTestId("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent("Error!");
    expect(dialog).toHaveAttribute("data-type", "error");
  });

  it("does not display dialog when no message or error", () => {
    vi.mocked(useMessage).mockReturnValue({ message: "", error: "" });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("navigates to dashboard when login is successful", async () => {
    const mockResult = {
      type: "auth/loginUser/fulfilled",
      payload: { id: "1", email: "a@test.com" },
    };
    mockDispatch.mockResolvedValue(mockResult);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = screen.getByText("Log In");

    await act(async () => {
      loginButton.click();
      await vi.advanceTimersByTimeAsync(1500);
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("sets error and navigates to signup when NO_ACCOUNT error occurs", async () => {
    const mockResult = {
      type: "auth/loginUser/rejected",
      payload: { code: AuthErrorCode.NO_ACCOUNT, message: "No account found" },
    };
    mockDispatch.mockResolvedValue(mockResult);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = screen.getByText("Log In");

    await act(async () => {
      loginButton.click();
      await vi.advanceTimersByTimeAsync(1500);
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });

  it("sets error but does not navigate for other login failures", async () => {
    const mockResult = {
      type: "auth/loginUser/rejected",
      payload: { code: "UNKNOWN_ERROR", message: "Login failed" },
    };
    mockDispatch.mockResolvedValue(mockResult);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = screen.getByText("Log In");

    await act(async () => {
      loginButton.click();
      await vi.advanceTimersByTimeAsync(1500);
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
