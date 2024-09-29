import { ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
  return <div className="container flex items-center h-full">{children}</div>;
};

export default Container;
