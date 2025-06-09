import Header from "./Header";
import Footer from "./Footer";
import Navbar from "./Navbar";

type LayoutWrapperProps = {
  children: React.ReactNode;
};

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default LayoutWrapper;
