import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { useMessage } from "@/hooks/useMessage";
import { signupUser } from "@/redux/thunks/authThunks";
import Signup from "./SignUp";

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

// ✅ Remove FormPanel mock so real FormPanel is used

describe("Signup Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.mocked(useMessage).mockReturnValue({ message: "", error: "" });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the page with all main components", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    expect(screen.getByText("Create an Account")).toBeInTheDocument();
    expect(screen.getByText("It's Simple and Easy!")).toBeInTheDocument();
    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(screen.getByTestId("side-panel")).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
  });

  it("displays success message when available", () => {
    vi.mocked(useMessage).mockReturnValue({
      message: "Account created successfully!",
      error: "",
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const dialog = screen.getByTestId("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent("Account created successfully!");
    expect(dialog).toHaveAttribute("data-type", "success");
  });

  it("displays error message when available", () => {
    vi.mocked(useMessage).mockReturnValue({
      message: "",
      error: "Email already exists",
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const dialog = screen.getByTestId("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent("Email already exists");
    expect(dialog).toHaveAttribute("data-type", "error");
  });

  it("does not display dialog when no message or error", () => {
    vi.mocked(useMessage).mockReturnValue({ message: "", error: "" });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("displays success message even if error exists (priority to message)", () => {
    vi.mocked(useMessage).mockReturnValue({
      message: "Success",
      error: "Error occurred",
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const dialog = screen.getByTestId("dialog");
    expect(dialog).toHaveTextContent("Success");
    expect(dialog).toHaveAttribute("data-type", "success");
  });

  it("navigates to login when signup is successful", async () => {
    const mockResult = { type: "auth/signupUser/fulfilled" };
    mockDispatch.mockResolvedValue(mockResult);
    vi.spyOn(signupUser.fulfilled, "match").mockReturnValue(true);

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const fullnameInput = screen.getByPlaceholderText("Enter your full name");
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    );
    const submitButton = screen.getByText("Create Account");

    // Fill inputs
    await act(async () => {
      fireEvent.change(fullnameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "Password123!" } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "Password123!" },
      });
      fireEvent.click(submitButton);
      await vi.advanceTimersByTimeAsync(1500);
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("does not navigate when signup fails", async () => {
    const mockResult = { type: "auth/signupUser/rejected" };
    mockDispatch.mockResolvedValue(mockResult);
    vi.spyOn(signupUser.fulfilled, "match").mockReturnValue(false);

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const fullnameInput = screen.getByPlaceholderText("Enter your full name");
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    );
    const submitButton = screen.getByText("Create Account");

    // Fill inputs
    await act(async () => {
      fireEvent.change(fullnameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "Password123!" } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "Password123!" },
      });
      fireEvent.click(submitButton);
      await vi.advanceTimersByTimeAsync(1500);
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

});
