"use client";
import Board from "@/Components/Board/Board";
import Header from "@/Components/Header/Header";
import { useAppDispatch } from "@/store/hooks";
import { getProjectsThunk } from "@/store/slices/projects.slice";
import { setUser } from "@/store/slices/user.slice";
import { getUser } from "@/utils/user.utils";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const user = getUser();
    if (!user) redirect("/auth/login");
    dispatch(setUser(user));
    dispatch(getProjectsThunk());
  }, []);

  return (
    <>
      <Header />
      <Board>{children}</Board>
    </>
  );
};

export default Layout;
