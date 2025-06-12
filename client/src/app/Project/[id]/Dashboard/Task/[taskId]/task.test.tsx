import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { beforeEach, describe, it, vi } from "vitest";

// Мокаем зависимости
vi.mock("@/store/hooks");
vi.mock("@/store/slices/user.slice");
vi.mock("@/utils/user.utils");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));
vi.mock("react-hook-form", () => ({
  useForm: () => ({
    register: vi.fn(),
    handleSubmit: vi.fn((fn) => fn),
    formState: { errors: {} },
  }),
}));

// Мокаем компоненты
vi.mock("@/Components/Button/Button", () => ({
  default: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/Components/Input/Input", () => ({
  default: vi
    .fn()
    .mockImplementation(
      ({ label, id, placeholder, type, error, ...props }: any) => (
        <div>
          <label htmlFor={id}>{label}</label>
          <input
            id={id}
            placeholder={placeholder}
            type={type}
            {...props}
            data-testid={id}
          />
          {error && <span data-testid={`${id}-error`}>{error}</span>}
        </div>
      )
    ),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe("RegistrationPage", () => {
  const mockDispatch = vi.fn();
  const mockUseSelector = useAppSelector as vi.Mock;
  const mockUseRouter = useRouter as vi.Mock;
  const mockRouterPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppDispatch as vi.Mock).mockReturnValue(mockDispatch);
    mockUseRouter.mockReturnValue({ push: mockRouterPush });
    mockUseSelector.mockReturnValue({ error: [], loading: false });
  });

  it("рендерит форму регистрации", () => {});

  it("показывает ошибки валидации при пустой форме", async () => {});

  it("показывает ошибку при несовпадении паролей", async () => {});

  it("отправляет форму при валидных данных", async () => {});

  it("показывает ошибки из стора", () => {});

  it("переходит на страницу входа по ссылке", () => {});
});
