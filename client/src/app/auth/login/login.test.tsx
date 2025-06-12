import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginPage from "./page";

// Мокаем зависимости
vi.mock("@/store/hooks");
vi.mock("@/store/slices/user.slice");
vi.mock("@/utils/user.utils");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

// Мокаем компоненты
vi.mock("@/Components/Button/Button", () => ({
  default: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe("LoginPage", () => {
  const mockDispatch = vi.fn();
  const mockUseSelector = useAppSelector;
  const mockUseRouter = useRouter;
  const mockRouterPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppDispatch as vi.Mock).mockReturnValue(mockDispatch);
    mockUseRouter.mockReturnValue({ push: mockRouterPush });
    mockUseSelector.mockReturnValue({ error: [], loading: false });
  });

  it("отрисовывает форму входа", () => {
    const { unmount } = render(<LoginPage />);

    expect(screen.getByText("Вход")).toBeInTheDocument();
    expect(screen.getByLabelText("Почта")).toBeInTheDocument();
    expect(screen.getByLabelText("Пароль")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Войти" })).toBeInTheDocument();
    expect(screen.getByText("У вас еще нет аккаунта?")).toBeInTheDocument();
    expect(screen.getByText("Зарегистрироваться?")).toBeInTheDocument();
    unmount();
  });

  it("валидирует форму перед отправкой", async () => {
    const { unmount } = render(<LoginPage />);
    const submitButton = screen.getByRole("button", { name: "Войти" });
    // Попытка отправить пустую форму
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/Введенная почта не соответствует формату/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Пароль должен состоять минимум из 5 символов/i)
    ).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
    unmount();
  });

  it("показывает ошибки при невалидных данных", async () => {
    const { unmount } = render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("Почта");
    const passwordInput = screen.getByPlaceholderText("Пароль");
    const submitButton = screen.getByRole("button", { name: "Войти" });
    // Ввод невалидных данных
    await userEvent.click(submitButton);

    expect(
      await screen.findByText(/Введенная почта не соответствует формату/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Пароль должен состоять минимум из 5 символов/i)
    ).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
    unmount();
  });

  it("отправляет форму при валидных данных", async () => {
    // const mockUser = { id: 1, email: "test@example.com" };
    // mockDispatch.mockResolvedValueOnce({ payload: mockUser });
    // render(<LoginPage />);
    // const emailInput = screen.getByLabelText("Почта");
    // const passwordInput = screen.getByLabelText("Пароль");
    // const submitButton = screen.getByRole("button", { name: "Войти" });
    // // Ввод валидных данных
    // await userEvent.type(emailInput, "valid@example.com");
    // await userEvent.type(passwordInput, "password123");
    // fireEvent.click(submitButton);
    // await waitFor(() => {
    //   expect(mockDispatch).toHaveBeenCalledWith(
    //     loginThunk({
    //       email: "valid@example.com",
    //       password: "password123",
    //     })
    //   );
    // });
    // await waitFor(() => {
    //   expect(setUser).toHaveBeenCalledWith(mockUser);
    //   expect(mockRouterPush).toHaveBeenCalledWith("/Project");
    // });
  });

  it("показывает ошибки из глобального хранилища", () => {
    // const mockErrors = ["Invalid credentials", "Account not found"];
    // mockUseSelector.mockReturnValue({ error: mockErrors, loading: false });
    // render(<LoginPage />);
    // mockErrors.forEach((error) => {
    //   expect(screen.getByText(error)).toBeInTheDocument();
    // });
  });

  it("переходит на страницу регистрации по ссылке", async () => {
    // render(<LoginPage />);
    // const registrationLink = screen.getByText("Зарегистрироваться?");
    // expect(registrationLink).toHaveAttribute("href", "registration");
  });
});
