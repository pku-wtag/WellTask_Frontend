
import { render, screen, fireEvent } from "@testing-library/react";



import { vi } from "vitest";
import { Modal } from "./modal";

// Mock Button component
vi.mock("./Button", () => ({
  Button: vi.fn(({ children, onClick, ...props }) => (
    <button data-testid="button" {...props} onClick={onClick}>
      {children}
    </button>
  )),
}));

describe("Modal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders children when isOpen is true", () => {
    render(
      <Modal isOpen={true}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("renders close button when onClose is provided", () => {
    const mockOnClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    const button = screen.getByTestId("button");
    expect(button).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const mockOnClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    const button = screen.getByTestId("button");
    fireEvent.click(button);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("renders correctly with only children (no onClose)", () => {
    render(
      <Modal isOpen={true}>
        <div>Just Content</div>
      </Modal>
    );

    expect(screen.getByText("Just Content")).toBeInTheDocument();
    expect(screen.queryByTestId("button")).not.toBeInTheDocument();
  });

  it("has proper aria attributes", () => {
    render(
      <Modal isOpen={true}>
        <div>Modal Content</div>
      </Modal>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });
});
