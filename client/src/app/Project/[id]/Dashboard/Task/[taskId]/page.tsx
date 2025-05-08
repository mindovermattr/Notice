"use client";
import { use } from "react";

const page = ({ params }) => {
  const p = use(params);
  console.log(p);
  return <div>page</div>;
};

export default page;
