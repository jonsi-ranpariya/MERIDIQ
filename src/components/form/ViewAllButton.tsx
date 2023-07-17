import strings from "@lang/Lang";
import { Link } from "react-router-dom";
import Button from "./Button";

export interface ViewAllButtonProps {
  to: string
}

const ViewAllButton: React.FC<ViewAllButtonProps> = ({
  to,
}) => {
  return (
    <div className="flex justify-center mt-2">
      <Link to={to}>
        <Button size='small' variant='ghost'>{strings.ViewAll}</Button>
      </Link>
    </div>
  );
}

export default ViewAllButton;