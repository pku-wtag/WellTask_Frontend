import { render, screen } from "@testing-library/react";
import { SidePanel } from "./SidePanel";

describe("SidePanel Component", () => {
  it("does not render when isVisible is false", () => {
    render(
      <SidePanel
        title="Test Title"
        subtitle="Test Subtitle"
        isVisible={false}
      />
    );

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Subtitle")).not.toBeInTheDocument();
  });

  it("renders title and subtitle when isVisible is true", () => {
    render(<SidePanel title="Hello" subtitle="World" isVisible={true} />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("World")).toBeInTheDocument();
  });

  it("renders buttons when showAppButtons is true", () => {
    render(
      <SidePanel
        title="Hello"
        subtitle="World"
        isVisible={true}
        showAppButtons={true}
      />
    );

    expect(screen.getByText("Download on Apple")).toBeInTheDocument();
    expect(screen.getByText("Download on Android")).toBeInTheDocument();
  });

  it("applies 'order-last' class when position is right", () => {
    render(
      <SidePanel
        title="Hello"
        subtitle="World"
        isVisible={true}
        position="right"
      />
    );

    const container = screen.getByTestId("sidepanel-container");
    expect(container).toHaveClass("order-last");
  });

  it("applies 'order-first' class when position is left", () => {
    render(
      <SidePanel
        title="Hello"
        subtitle="World"
        isVisible={true}
        position="left"
      />
    );

    const container = screen.getByTestId("sidepanel-container");
    expect(container).toHaveClass("order-first");
  });
});
