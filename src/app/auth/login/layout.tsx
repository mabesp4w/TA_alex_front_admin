/** @format */

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Login Admin",
};

type Props = {
  children: React.ReactNode;
};

const layout = (props: Props) => {
  return <>{props.children}</>;
};

export default layout;
