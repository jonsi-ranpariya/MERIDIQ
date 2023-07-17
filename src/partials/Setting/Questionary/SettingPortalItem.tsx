import React from 'react';
import strings from '../../../lang/Lang';
import Checkbox from '../../MaterialCheckbox/MaterialCheckbox';

export interface SettingPortalItemProps {
    title?: string,
    onRequiredChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onViewChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    viewChecked?: boolean,
    requiredChecked?: boolean,
    disabled?: boolean,
    viewName: string,
    requiredName: string,
}

const SettingPortalItem: React.FC<SettingPortalItemProps> = ({
    title = '',
    onRequiredChange = () => {},
    onViewChange = () => {},
    viewChecked = false,
    requiredChecked = false,
    disabled = false,
    viewName,
    requiredName,
}) => {
    return (
        <div className="flex justify-between items-center px-3 py-4 hover:bg-primary/5">
            <p className="break-all">
                {title}
            </p>
            <div className="flex items-center space-x-3">
                <Checkbox
                    label={strings.setting_view}
                    checked={viewChecked}
                    onChange={onViewChange}
                    disabled={disabled}
                    name={viewName}
                />
                <Checkbox
                    label={strings.setting_required}
                    checked={requiredChecked}
                    onChange={onRequiredChange}
                    disabled={disabled}
                    name={requiredName}
                />
            </div>
        </div>
    );
}

export default SettingPortalItem;