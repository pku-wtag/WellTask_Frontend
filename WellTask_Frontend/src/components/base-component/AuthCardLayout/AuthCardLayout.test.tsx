import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthCardLayout } from "./AuthCardLayout";

describe("AuthCardLayout Component", () => {
  it("renders title and description", () => {
    render(
      <MemoryRouter>
        <AuthCardLayout title="Test Title" description="Test Description">
          <div>Child</div>
        </AuthCardLayout>
      </MemoryRouter>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("renders URL button when url prop is provided", () => {
    render(
      <MemoryRouter>
        <AuthCardLayout title="Test" url={{ label: "Go Home", path: "/home" }}>
          <div>Child</div>
        </AuthCardLayout>
      </MemoryRouter>
    );

    // Find the button by its text
    const button = screen.getByRole("button", { name: "Go Home" });
    expect(button).toBeInTheDocument();

    // Check that it is wrapped inside a link with correct href
    const link = button.closest("a");
    expect(link).toHaveAttribute("href", "/home");
  });

  it("renders alert when alert prop is provided", () => {
    render(
      <MemoryRouter>
        <AuthCardLayout
          title="Test"
          alert={{ title: "Warning!", message: "This is an alert" }}
        >
          <div>Child</div>
        </AuthCardLayout>
      </MemoryRouter>
    );

    expect(screen.getByText("Warning!")).toBeInTheDocument();
    expect(screen.getByText("This is an alert")).toBeInTheDocument();
  });

  it("renders alert without title if only message is provided", () => {
    render(
      <MemoryRouter>
        <AuthCardLayout title="Test" alert={{ message: "Only message alert" }}>
          <div>Child</div>
        </AuthCardLayout>
      </MemoryRouter>
    );

    expect(screen.queryByText("Only message alert")).toBeInTheDocument();
  });

  it("renders background image", () => {
    render(
      <MemoryRouter>
        <AuthCardLayout title="Test">
          <div>Child</div>
        </AuthCardLayout>
      </MemoryRouter>
    );

    const bgImage = screen.getByAltText("Background");
    expect(bgImage).toBeInTheDocument();
    expect(bgImage).toHaveAttribute("src", "/bg.png");
  });
});
