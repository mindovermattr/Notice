import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Modal from "./Modal";

describe("Modal component", () => {
  const mockOnClose = vi.fn();
  const modalContent = "Modal Content";

  beforeEach(() => {
    if (!document.getElementById("modal-root")) {
      const portalRoot = document.createElement("div");
      portalRoot.setAttribute("id", "modal-root");
      document.body.appendChild(portalRoot);
    }
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders modal when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        {modalContent}
      </Modal>
    );

    expect(screen.getByText(modalContent)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("does not render modal when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        {modalContent}
      </Modal>
    );

    expect(screen.queryByText(modalContent)).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        {modalContent}
      </Modal>
    );

    await user.click(screen.getByRole("button"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when overlay is clicked (closeOnOverlayClick=true)", async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnOverlayClick={true}>
        {modalContent}
      </Modal>
    );

    const overlay = screen.getByTestId("modal-overlay");
    await user.click(overlay);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when overlay is clicked (closeOnOverlayClick=false)", async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnOverlayClick={false}>
        {modalContent}
      </Modal>
    );

    const overlay = screen.getByTestId("modal-overlay");
    await user.click(overlay);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("locks body scroll when modal is open", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        {modalContent}
      </Modal>
    );

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("unlocks body scroll when modal is closed", () => {
    const { unmount } = render(
      <Modal isOpen={true} onClose={mockOnClose}>
        {modalContent}
      </Modal>
    );

    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
