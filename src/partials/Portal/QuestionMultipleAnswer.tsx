import Checkbox from "@partials/MaterialCheckbox/MaterialCheckbox";
import TinyError from "../Error/TinyError";

export interface QuestionMultipleAnswerProps<T> {
    question?: string,
    onChange?: (index: number, checked: boolean) => void,
    values?: T[],
    options?: string[],
    showBullet?: boolean,
    error?: boolean,
    helperText?: string | boolean,
    name?: string,
}

function QuestionMultipleAnswer<T>({
    question = '',
    onChange = () => {},
    values = [],
    options = [],
    showBullet = false,
    error = false,
    helperText = '',
    name,
}: QuestionMultipleAnswerProps<T>) {
    return (
        <div className="">
            <p className="flex-grow font-semibold mb-2">{question}</p>
            <div className="grid grid-flow-row grid-cols-1 lg:grid-cols-2 pl-4 gap-2">
                {options.map((option, optionIndex) => {
                    return (
                        <Checkbox
                            key={`multiple_option_${optionIndex}`}
                            checked={!!values[optionIndex]}
                            onChange={(e) => {
                                onChange(optionIndex, e.currentTarget.checked);
                            }}
                            name={`checkbox_${optionIndex.toString()}`}
                            color="primary"
                            label={option}
                        />
                    );
                })}
            </div>
            <TinyError
                error={error}
                helperText={helperText}
            />
        </div>
    );
}

export default QuestionMultipleAnswer;