import Board from "@/Components/Board/Board";
import Header from "@/Components/Header/Header";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header />
      <Board>{children}</Board>
    </>
  );
};

export default Layout;
