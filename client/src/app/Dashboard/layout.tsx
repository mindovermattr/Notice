"use client";
import Board from "@/Components/Board/Board";
import Header from "@/Components/Header/Header";
import { login } from "@/store/slices/user.slice";
import { getUser } from "@/utils/user.utils";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const user = getUser();
    if (!user) redirect("/auth/login");
    dispatch(login(user));
  }, []);
  return (
    <>
      <Header />
      <Board>{children}</Board>
    </>
  );
};

export default Layout;
