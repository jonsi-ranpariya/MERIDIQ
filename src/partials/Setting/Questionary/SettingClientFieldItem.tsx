
import IconButton from '@components/form/IconButton';
import Input from '@components/form/Input';
import React, { Ref, useRef, useState } from 'react';
import strings from '../../../lang/Lang';
import DeleteIcon from '../../Icons/Delete';
import Checkbox from '../../MaterialCheckbox/MaterialCheckbox';

export interface SettingClientFieldItemProps {
    updateName?: (name: string) => void,
    onRequiredChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onViewChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onDelete?: () => void,
    viewChecked?: boolean,
    requiredChecked?: boolean,
    oldName: string,
}

const SettingClientFieldItem: React.FC<SettingClientFieldItemProps> = ({
    updateName = () => {},
    oldName,
    onRequiredChange = () => {},
    onViewChange = () => {},
    onDelete = () => {},
    requiredChecked,
    viewChecked
}) => {
    const [name, setName] = useState(oldName);
    const ref = useRef<HTMLInputElement>();

    return (
        <div className="flex flex-col md:flex-row items-start justify-between md:items-center py-3 md:py-1.5 md:pr-3 hover:bg-primary/5">
            <div className="flex mb-1 md:mb-0">
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    ref={ref as Ref<HTMLInputElement>}
                    onBlur={() => {
                        if (name !== oldName) {
                            updateName(name);
                        }
                    }}
                    onKeyPress={event => {
                        if (event.key === 'Enter' && name !== oldName) {
                            ref.current?.blur();
                        }
                    }}
                />
                <IconButton onClick={onDelete}>
                    <DeleteIcon />
                </IconButton>
            </div>
            <div className="flex items-center space-x-3">
                <Checkbox
                    label={strings.setting_view}
                    checked={viewChecked}
                    onChange={onViewChange}
                />
                <Checkbox
                    label={strings.setting_required}
                    checked={requiredChecked}
                    onChange={onRequiredChange}
                />
            </div>
        </div>
    );
}

export default SettingClientFieldItem;