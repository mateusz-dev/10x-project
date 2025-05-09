import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../utils/test-utils";
import { CharacterCounter } from "../../components/CharacterCounter";

describe("CharacterCounter", () => {
  const minLength = 10;
  const maxLength = 50;
  const counterId = "test-counter";

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders without crashing", () => {
    render(<CharacterCounter count={20} minLength={minLength} maxLength={maxLength} counterId={counterId} />);
    expect(screen.getByText(/characters/i)).toBeInTheDocument();
  });

  it("displays the correct character count", () => {
    const count = 25;
    render(<CharacterCounter count={count} minLength={minLength} maxLength={maxLength} counterId={counterId} />);
    expect(screen.getByText(`${count} / ${maxLength} characters`)).toBeInTheDocument();
  });

  it("shows green text when count is valid", () => {
    const count = 25;
    render(<CharacterCounter count={count} minLength={minLength} maxLength={maxLength} counterId={counterId} />);
    const counterElement = screen.getByText(`${count} / ${maxLength} characters`);
    expect(counterElement).toHaveClass("text-green-600");
  });

  it("shows red text when count is too low", () => {
    const count = 5; // Less than minLength
    render(<CharacterCounter count={count} minLength={minLength} maxLength={maxLength} counterId={counterId} />);
    const counterElement = screen.getByText(`${count} / ${maxLength} characters`);
    expect(counterElement).toHaveClass("text-red-600");
    expect(screen.getByText("(5 more needed)")).toBeInTheDocument();
  });

  it("shows red text when count is too high", () => {
    const count = 60; // More than maxLength
    render(<CharacterCounter count={count} minLength={minLength} maxLength={maxLength} counterId={counterId} />);
    const counterElement = screen.getByText(`${count} / ${maxLength} characters`);
    expect(counterElement).toHaveClass("text-red-600");
    expect(screen.getByText("(10 too many)")).toBeInTheDocument();
  });

  it("shows muted text when count is zero", () => {
    render(<CharacterCounter count={0} minLength={minLength} maxLength={maxLength} counterId={counterId} />);
    const counterElement = screen.getByText(`0 / ${maxLength} characters`);
    expect(counterElement).toHaveClass("text-muted-foreground");
  });
});
