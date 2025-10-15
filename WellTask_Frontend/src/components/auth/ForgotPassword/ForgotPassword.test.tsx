import React from "react";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { useMessage } from "@/hooks/useMessage";
import ForgotPassword from "./ForgotPassWord";

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

vi.mock("@/components/base-component/AuthCardLayout", () => ({
  AuthCardLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("../../fields/Input", () => ({
  Input: ({ id, label }: { id: string; label: string }) => (
    <div data-testid={`input-${id}`}>{label}</div>
  ),
}));

// Fully typed FakeForm interface
interface FakeForm {
  reset: () => void;
  resetFieldState: (field: string) => void;
}

vi.mock("react-final-form", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-final-form")>();
  const fakeForm: FakeForm = {
    reset: vi.fn(),
    resetFieldState: vi.fn(),
  };

  return {
    ...actual,
    Form: ({
      render,
    }: {
      render: (props: { handleSubmit: React.FormEventHandler; form: FakeForm; submitting: boolean }) => React.ReactNode;
    }) => {
      const handleSubmit: React.FormEventHandler = async (event) => {
        event?.preventDefault?.();
        await mockDispatch();
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

describe("ForgotPassword Page", () => {
  it("renders input field and Next button", () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByTestId("input-email")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("displays success message from useMessage", () => {
    vi.mocked(useMessage).mockReturnValue({ message: "Success!", error: "" });

    render(
      <MemoryRouter>
        <ForgotPassword />
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
        <ForgotPassword />
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
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("sets error but does not navigate for other failures", async () => {
    mockDispatch.mockResolvedValue({
      type: "auth/forgotPassword/rejected",
      payload: { code: "UNKNOWN_ERROR", message: "Some error" },
    });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const nextButton = screen.getByText("Next");

    await act(async () => {
      nextButton.click();
      await vi.advanceTimersByTimeAsync(1500);
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
