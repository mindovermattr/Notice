const page = ({ taskId }: { taskId: Promise<string> }) => {
  console.log(taskId);
  return <div>page</div>;
};

export default page;
