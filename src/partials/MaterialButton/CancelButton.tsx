import Button, { ButtonProps } from "@components/form/Button";
import strings from "@lang/Lang";

export interface CancelButtonProps extends ButtonProps {

}

const CancelButton: React.FC<CancelButtonProps> = ({
  ...props
}) => {
  return <Button {...props} variant="outlined">{strings.Cancel}</Button>;
}

export default CancelButton;