import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AiCoach from "./AiCoach";
import { vi } from "vitest";

// Mock Supabase client
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() =>
        Promise.resolve({
          data: {
            session: {
              access_token: "test-token",
            },
          },
        })
      ),
    },
    functions: {
      invoke: vi.fn(() =>
        Promise.resolve({
          data: {
            reply: "This is a test reply.",
          },
        })
      ),
    },
  },
}));

describe("AiCoach", () => {
  it("should render the component", () => {
    render(<AiCoach />);
    expect(screen.getByText("Critical Thinking Coach")).toBeInTheDocument();
  });

  it("should have a flex container for messages", async () => {
    render(<AiCoach />);
    const input = screen.getByPlaceholderText("Ask me anything...");
    const sendButton = screen.getByText("Send");

    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      const userMessage = screen.getByText("Test message");
      const messageContainer = userMessage.parentElement?.parentElement;
      expect(messageContainer?.classList.contains("flex")).toBe(true);
      expect(messageContainer?.classList.contains("flex-col")).toBe(true);
    });
  });
});
