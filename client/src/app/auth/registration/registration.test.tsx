import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginPage from "./page";

// Моки для хуков и зависимостей
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/store/hooks", () => ({
  useAppDispatch: () => vi.fn(() => Promise.resolve({})),
  useAppSelector: vi.fn(() => ({ error: [] })),
}));

vi.mock("@/store/slices/user.slice", () => ({
  registrationThunk: vi.fn((data) => ({
    unwrap: () => Promise.resolve(data),
  })),
}));

vi.mock("@/utils/user.utils", () => ({
  setUser: vi.fn(),
}));

describe("LoginPage", () => {
  let dispatchMock: any;
  let pushMock: any;
  let setUserMock: any;

  beforeEach(() => {
    // Сброс моков перед каждым тестом
    vi.clearAllMocks();

    // Подмена useAppDispatch
    dispatchMock = vi.fn(() => ({
      unwrap: () => Promise.resolve({ id: "123", name: "Test" }),
    }));
    vi.mocked(require("@/store/hooks").useAppDispatch).mockReturnValue(
      dispatchMock
    );

    // Подмена useRouter
    pushMock = vi.fn();
    vi.mocked(require("next/navigation").useRouter).mockReturnValue({
      push: pushMock,
    });

    // Подмена setUser
    setUserMock = vi.mocked(require("@/utils/user.utils").setUser);
  });

  it("рендерит форму с полями", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText("Имя")).toBeInTheDocument();
    expect(screen.getByLabelText("Фамилия")).toBeInTheDocument();
    expect(screen.getByLabelText("Почта")).toBeInTheDocument();
    expect(screen.getByLabelText("Пароль")).toBeInTheDocument();
    expect(screen.getByLabelText("Подтв. пароль")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /зарегистрироваться/i })
    ).toBeInTheDocument();
  });

  it("показывает ошибки валидации при пустой отправке", async () => {
    render(<LoginPage />);
    userEvent.click(
      screen.getByRole("button", { name: /зарегистрироваться/i })
    );

    await waitFor(() => {
      expect(screen.getAllByText(/обязательное поле/i).length).toBeGreaterThan(
        0
      );
    });
  });

  it("вызывает dispatch с правильными данными и редиректит при успешной регистрации", async () => {
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText("Имя"), "John");
    await userEvent.type(screen.getByLabelText("Фамилия"), "Doe");
    await userEvent.type(screen.getByLabelText("Почта"), "john@example.com");
    await userEvent.type(screen.getByLabelText("Пароль"), "Password123");
    await userEvent.type(screen.getByLabelText("Подтв. пароль"), "Password123");

    userEvent.click(
      screen.getByRole("button", { name: /зарегистрироваться/i })
    );

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        name: "John",
        lastname: "Doe",
        email: "john@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      });
      expect(setUserMock).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith("/Project");
    });
  });

  it("не вызывает редирект при ошибке регистрации", async () => {
    dispatchMock.mockImplementationOnce(() => ({
      unwrap: () => Promise.reject(new Error("Registration failed")),
    }));

    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText("Имя"), "John");
    await userEvent.type(screen.getByLabelText("Фамилия"), "Doe");
    await userEvent.type(screen.getByLabelText("Почта"), "john@example.com");
    await userEvent.type(screen.getByLabelText("Пароль"), "Password123");
    await userEvent.type(screen.getByLabelText("Подтв. пароль"), "Password123");

    userEvent.click(
      screen.getByRole("button", { name: /зарегистрироваться/i })
    );

    await waitFor(() => {
      expect(pushMock).not.toHaveBeenCalled();
      expect(setUserMock).not.toHaveBeenCalled();
    });
  });

  it("отображает ошибки из user.error", () => {
    // Мокаем useAppSelector чтобы вернуть ошибки
    vi.mocked(require("@/store/hooks").useAppSelector).mockReturnValue({
      error: ["Ошибка 1", "Ошибка 2"],
    });

    render(<LoginPage />);

    expect(screen.getByText("Ошибка 1")).toBeInTheDocument();
    expect(screen.getByText("Ошибка 2")).toBeInTheDocument();
  });
});
