"use client";
import { loginSchema, TLoginSchema } from "@/@schemes/auth.schema";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginThunk } from "@/store/slices/user.slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import styles from "./page.module.scss";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const submitHandler = async (data: TLoginSchema) => {
    const resp = await dispatch(loginThunk(data));
    console.log(user, resp);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
      <legend className={styles.form__title}>Вход</legend>
      <fieldset className={styles.form__fields}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          {...register("email")}
          className={styles.form__input}
          type="email"
          placeholder="example@mail.ru"
        />
        {errors.email && (
          <p className={`${styles.form__error} `}>{errors.email.message}</p>
        )}
        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          {...register("password")}
          className={styles.form__input}
          type="password"
          placeholder="Пароль"
        />
        {errors.password && (
          <p className={styles.form__error}>{errors.password.message}</p>
        )}
      </fieldset>
      <button className={styles.form__button}>Войти</button>
    </form>
  );
}
