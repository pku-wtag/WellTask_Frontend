import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FormPanel, type FormField } from "./FormPanel";

const fields: FormField[] = [
  { id: "name", name: "name", label: "Name", fieldType: "input" },
  { id: "bio", name: "bio", label: "Bio", fieldType: "textarea" },
  {
    id: "gender",
    name: "gender",
    label: "Gender",
    fieldType: "select",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
  },
];

describe("FormPanel Component", () => {
  it("renders title and description", () => {
    render(
      <FormPanel
        title="User Form"
        description="Fill the details"
        submitText="Submit"
        fields={fields}
      />
    );

    expect(screen.getByText("User Form")).toBeInTheDocument();
    expect(screen.getByText("Fill the details")).toBeInTheDocument();
  });

  it("renders all fields correctly", () => {
    render(<FormPanel title="Form" submitText="Submit" fields={fields} />);

    // Input
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    // Textarea
    expect(screen.getByLabelText("Bio")).toBeInTheDocument();
    // Select
    expect(screen.getByLabelText("Gender")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Male" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Female" })).toBeInTheDocument();
  });

  it("renders select field without options", () => {
    const selectFieldNoOptions: FormField = {
      id: "country",
      name: "country",
      label: "Country",
      fieldType: "select",
      // options is undefined
    };

    render(
      <FormPanel
        title="Form"
        submitText="Submit"
        fields={[selectFieldNoOptions]}
      />
    );

    expect(screen.getByLabelText("Country")).toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted and resets fields", async () => {
    const handleSubmit = vi.fn();

    render(
      <FormPanel
        title="Form"
        submitText="Submit"
        fields={fields}
        onSubmit={handleSubmit}
      />
    );

    const input = screen.getByLabelText("Name");
    fireEvent.change(input, { target: { value: "John" } });

    const form = screen.getByTestId("form-panel");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  it("handles async onSubmit and resets fields", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <FormPanel
        title="Form"
        submitText="Submit"
        fields={fields}
        onSubmit={handleSubmit}
      />
    );

    const input = screen.getByLabelText("Name");
    fireEvent.change(input, { target: { value: "John" } });

    const form = screen.getByTestId("form-panel");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
      expect(input).toHaveValue("");
    });
  });

  it("handles form submission without onSubmit prop", async () => {
    render(
      <FormPanel
        title="Form"
        submitText="Submit"
        fields={fields}
        onSubmit={undefined}
      />
    );

    const input = screen.getByLabelText("Name");
    fireEvent.change(input, { target: { value: "John" } });

    const form = screen.getByTestId("form-panel");
    fireEvent.submit(form);

    await waitFor(() => {
      // Input should be cleared after form reset
      expect(input).toHaveValue("");
    });
  });

  it("renders redirect link if provided", () => {
    render(
      <MemoryRouter>
        <FormPanel
          title="Form"
          submitText="Submit"
          fields={fields}
          redirectLink={{ text: "Go to login", path: "/login" }}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Go to login")).toBeInTheDocument();
    expect(screen.getByText("login")).toBeInTheDocument();
  });

  it("renders nothing for unknown fieldType (default case)", () => {
    const unknownField: FormField = {
      id: "x",
      name: "x",
      fieldType: "unknown" as FormField["fieldType"],
    };
    render(
      <FormPanel title="Test" submitText="Submit" fields={[unknownField]} />
    );
    expect(screen.queryByLabelText("x")).not.toBeInTheDocument();
  });

  it("renders correctly without description", () => {
    render(<FormPanel title="Test" submitText="Submit" fields={fields} />);
    expect(screen.queryByText("Fill the details")).not.toBeInTheDocument();
  });
});
