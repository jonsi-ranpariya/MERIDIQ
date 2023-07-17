import { ReactNode } from "react";

export interface ClientMediaListULProps {
  children: ReactNode | ReactNode[],
}

const ClientMediaListUL: React.FC<ClientMediaListULProps> = ({
  children
}) => {
  return (
    <ul className="mb-8">
      {children}
      <li />
    </ul>
  );
}

export default ClientMediaListUL;