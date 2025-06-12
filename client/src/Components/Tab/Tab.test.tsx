import { makeStore } from "@/store/store";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Tab from "./Tab";
import { Store, UnknownAction } from "@reduxjs/toolkit";

vi.mock("@/store/hooks", () => ({
  useAppDispatch: () => vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "1" }),
  useSelectedLayoutSegment: () => "Tasklist",
}));

describe("Tab Component", () => {
  let store: Store<unknown, UnknownAction, unknown>;

  beforeEach(() => {
    store = makeStore();
  });

  test("renders correctly", () => {
    const { unmount } = render(
      <Provider store={store}>
        <Tab />
      </Provider>
    );

    expect(screen.getByText("Список")).toBeInTheDocument();
    expect(screen.getByText("Канбан")).toBeInTheDocument();
    expect(screen.getByText("Гант")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /создать/i })
    ).toBeInTheDocument();
    unmount();
  });

  test("opens modal on button click", () => {
    const { unmount } = render(
      <Provider store={store}>
        <Tab />
      </Provider>
    );

    fireEvent.click(screen.getByTestId("create-button"));

    expect(screen.getByLabelText("Имя списка")).toBeInTheDocument();
    unmount();
  });
});
