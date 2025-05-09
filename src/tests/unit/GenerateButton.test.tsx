import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../utils/test-utils";
import { GenerateButton } from "../../components/GenerateButton";

describe("GenerateButton", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders the button with correct text", () => {
    render(<GenerateButton onClick={mockOnClick} />);
    expect(screen.getByText(/generate flashcards/i)).toBeInTheDocument();
  });

  it("shows the wand icon when not loading", () => {
    render(<GenerateButton onClick={mockOnClick} />);
    // Check for SVG icon by class name
    const button = screen.getByRole("button");
    expect(button.innerHTML).toContain("lucide-wand-sparkles");
  });

  it("disables button when disabled prop is true", () => {
    render(<GenerateButton onClick={mockOnClick} disabled={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("disables button when isLoading prop is true", () => {
    render(<GenerateButton onClick={mockOnClick} isLoading={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows loading state when isLoading is true", () => {
    render(<GenerateButton onClick={mockOnClick} isLoading={true} />);
    expect(screen.getByText(/generating.../i)).toBeInTheDocument();
    // Check for animation class on button content
    const button = screen.getByRole("button");
    expect(button.innerHTML).toContain("animate-spin");
  });

  it("calls onClick function when clicked", async () => {
    const { user } = render(<GenerateButton onClick={mockOnClick} />);
    const button = screen.getByRole("button");

    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const { user } = render(<GenerateButton onClick={mockOnClick} disabled={true} />);
    const button = screen.getByRole("button");

    await user.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
