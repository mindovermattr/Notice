"use client";
import { loginSchema, TLoginSchema } from "@/@schemes/auth.schema";
import Button from "@/Components/Button/Button";
import Input from "@/Components/Input/Input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginThunk } from "@/store/slices/user.slice";
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
    resolver: zodResolver(loginSchema),
  });
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const router = useRouter();

  const submitHandler = async (data: TLoginSchema) => {
    try {
      const resp = await dispatch(loginThunk(data)).unwrap();
      setUser(resp);
      router.push("/Dashboard/Kanban");
    } catch (error) {
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
      <legend className={styles.form__title}>Вход</legend>
      <fieldset className={styles.form__fields}>
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
      </fieldset>
      <Button className={styles.form__button}>Войти</Button>
      <div>
        <p className={styles.form__registration}>У вас еще нет аккаунта?</p>
        <p className={styles.form__registration}>
          <Link className={styles.form__link} href="registration">
            Зарегистрироваться?
          </Link>
        </p>
      </div>
      {!!user.error.length && user.error.map((el) => <p>{el}</p>)}
    </form>
  );
}
