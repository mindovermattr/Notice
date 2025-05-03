"use client";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

const page = ({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const router = useRouter();
  const { id } = use(params);
  useEffect(() => {
    router.push(`${id}/Dashboard/Tasklist`);
  }, []);
  return <div>й</div>;
};

export default page;
