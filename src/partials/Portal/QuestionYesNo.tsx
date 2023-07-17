
import Checkbox from "@partials/MaterialCheckbox/MaterialCheckbox";
import strings from "../../lang/Lang";
import TinyError from "../Error/TinyError";

export interface QuestionYesNoProps {
    question?: string,
    onChange?: (number: 0 | 1) => void,
    value?: 0 | 1 | null | '' | string,
    showBullet?: boolean,
    error?: boolean,
    helperText?: string | boolean,
    name?: string,
}

const QuestionYesNo: React.FC<QuestionYesNoProps> = ({
    question = '',
    onChange = () => {},
    value,
    showBullet = false,
    error = false,
    helperText = '',
    name,
}) => {
    return (
        <div>
            <div className="flex flex-col md:flex-row px-0 md:px-0 py-2">
                <p className="flex-grow font-medium">{question}</p>
                <div className="flex mt-2 md:mt-0 space-x-3">
                    <Checkbox
                        checked={value === 1}
                        onChange={() => onChange(1)}
                        name={name}
                        color="primary"
                        label={strings.Yes}
                    />
                    <Checkbox
                        checked={value === 0}
                        onChange={() => onChange(0)}
                        name={name}
                        color="primary"
                        label={strings.No}
                    />
                </div>
            </div>
            <TinyError
                error={error}
                helperText={helperText}
            />
        </div>
    );
}

export default QuestionYesNo;