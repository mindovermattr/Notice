"use client";
import { useAppDispatch } from "@/store/hooks";
import { getProjectsThunk, selectProject } from "@/store/slices/projects.slice";
import { ReactNode, use, useEffect } from "react";

const layout = ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getProject = async () => {
      await dispatch(getProjectsThunk());
      dispatch(selectProject({ id: +id }));
    };
    getProject();
  }, []);
  return <>{children}</>;
};

export default layout;
