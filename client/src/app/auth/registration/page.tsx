"use client";
import {
  registrationSchema,
  TRegistrationSchema,
} from "@/@schemes/auth.schema";
import Input from "@/Components/Input/Input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registrationThunk } from "@/store/slices/user.slice";
import { setUser } from "@/utils/user.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import styles from "../page.module.scss";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
  });
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const router = useRouter();

  const submitHandler = async (data: TRegistrationSchema) => {
    try {
      const resp = await dispatch(registrationThunk(data)).unwrap();
      setUser(resp);
      router.push("/Dashboard/Kanban");
    } catch (error) {
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
      <legend className={styles.form__title}>Регистрация</legend>
      <fieldset className={styles.form__fields}>
        <div className={styles.surname}>
          <div className={styles.surname__field}>
            <Input
              {...register("name")}
              label="Имя"
              id="name"
              placeholder="Имя"
              error={errors.name?.message}
            />
          </div>
          <div className={styles.surname__field}>
            <Input
              {...register("lastname")}
              label="Фамилия"
              id="lastname"
              placeholder="Фамилия"
              error={errors.lastname?.message}
            />
          </div>
        </div>
        <Input
          {...register("email")}
          label="Почта"
          id="email"
          placeholder="Почта"
          type="email"
          error={errors.email?.message}
        />
        <Input
          {...register("password")}
          label="Пароль"
          id="password"
          placeholder="Пароль"
          type="password"
          error={errors.password?.message}
        />
        <Input
          {...register("confirmPassword")}
          label="Подтв. пароль"
          id="confirmPassword"
          placeholder="Подтв. пароль"
          type="password"
          error={errors.confirmPassword?.message}
        />
      </fieldset>
      <button className={styles.form__button}>Зарегистрироваться</button>
      <div>
        <p className={styles.form__registration}>У вас уже есть аккаунт?</p>
        <p className={styles.form__registration}>
          <Link className={styles.form__link} href="login">
            Войти?
          </Link>
        </p>
      </div>
      {!!user.error.length && user.error.map((error) => <p>{error}</p>)}
    </form>
  );
}
