"use client";
import { getProjectRole } from "@/api/project.api";
import { useAppDispatch } from "@/store/hooks";
import { getProjectsThunk, selectProject } from "@/store/slices/projects.slice";
import { getTasklistsThunk } from "@/store/slices/tasklists.slice";
import { setRole } from "@/store/slices/user.slice";
import { getUser } from "@/utils/user.utils";
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

  const user = getUser();

  useEffect(() => {
    const getProject = async () => {
      await dispatch(getProjectsThunk());
      dispatch(selectProject({ id: +id }));
      const resp = await getProjectRole({ id: +id, userId: user?.user.id });

      dispatch(setRole(resp.data.id));
      await dispatch(getTasklistsThunk({ id: +id }));
    };
    getProject();
  }, []);

  return <>{children}</>;
};

export default layout;
