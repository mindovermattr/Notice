"use client";
import Board from "@/Components/Board/Board";
import Header from "@/Components/Header/Header";
import { setUser } from "@/store/slices/user.slice";
import { getUser } from "@/utils/user.utils";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Layout = ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {
    id: string;
  };
}>) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const user = getUser();
    if (!user) redirect("/auth/login");
    dispatch(setUser(user));
  }, []);
  return (
    <>
      <Header />
      <Board>{children}</Board>
    </>
  );
};

export default Layout;
