import strings from "@lang/Lang";
import AddIcon from "@partials/Icons/Add";
import Button, { ButtonProps } from "./Button";

export interface AddButtonProps extends ButtonProps {

}

const AddButton: React.FC<AddButtonProps> = ({
  ...props
}) => {
  return (
    <Button size="small" {...props}>
      <span className="space-x-1 flex items-center">
        <AddIcon />
        <p>{strings.add}</p>
      </span>
    </Button>
  );
}

export default AddButton;