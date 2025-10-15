import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, {
  clearMessage,
  clearError,
} from "@/redux/slices/authSlice";
import { vi } from "vitest";
import { Dialog } from "./Dialog";

vi.mock("@/redux/slices/authSlice", async () => {
  const actual = await vi.importActual("@/redux/slices/authSlice");
  return {
    ...actual,
    clearMessage: vi.fn(() => ({ type: "auth/clearMessage" })),
    clearError: vi.fn(() => ({ type: "auth/clearError" })),
  };
});

const createMockStore = () =>
  configureStore({ reducer: { auth: authReducer } });

const renderWithProvider = (component: React.ReactElement) => {
  const store = createMockStore();
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe("Dialog Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders message with default info styling", () => {
    const { container } = renderWithProvider(<Dialog message="Test message" />);

    expect(screen.getByText("Test message")).toBeInTheDocument();
    const dialog = container.querySelector(".fixed");
    expect(dialog).toHaveClass("bg-blue-100", "text-blue-800");
  });

  it("renders with success styling", () => {
    const { container } = renderWithProvider(
      <Dialog message="Success" type="success" />
    );

    const dialog = container.querySelector(".fixed");
    expect(dialog).toHaveClass("bg-green-100", "text-green-800");
  });

  it("renders with error styling", () => {
    const { container } = renderWithProvider(
      <Dialog message="Error" type="error" />
    );

    const dialog = container.querySelector(".fixed");
    expect(dialog).toHaveClass("bg-red-100", "text-red-800");
  });

  it("dispatches clearMessage after duration for success type", async () => {
    renderWithProvider(
      <Dialog message="Success" type="success" duration={3000} />
    );

    expect(clearMessage).not.toHaveBeenCalled();

    vi.advanceTimersByTime(3000);
    await vi.runAllTimersAsync();

    expect(clearMessage).toHaveBeenCalled();
  });

  it("dispatches clearError after duration for error type", async () => {
    renderWithProvider(<Dialog message="Error" type="error" duration={2000} />);

    expect(clearError).not.toHaveBeenCalled();

    vi.advanceTimersByTime(2000);
    await vi.runAllTimersAsync();

    expect(clearError).toHaveBeenCalled();
  });

  it("does not dispatch action for info type", () => {
    const { store } = renderWithProvider(
      <Dialog message="Info" type="info" duration={1000} />
    );
    const dispatchSpy = vi.spyOn(store, "dispatch");

    vi.advanceTimersByTime(1000);

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("clears timeout on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
    const { unmount } = renderWithProvider(
      <Dialog message="Test" type="success" />
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
