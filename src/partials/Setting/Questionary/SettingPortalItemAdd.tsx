import IconButton from '@components/form/IconButton';
import Input from '@components/form/Input';
import React, { useState } from 'react';
import strings from '../../../lang/Lang';
import AddIcon from '../../Icons/Add';
import Checkbox from '../../MaterialCheckbox/MaterialCheckbox';

export interface SettingPortalItemAddProps {
    onAdd?: ({ required, view, name }: { required: boolean, view: boolean, name: string }) => void,
}

const SettingPortalItemAdd: React.FC<SettingPortalItemAddProps> = ({
    onAdd = () => {},
}) => {
    const [view, setView] = useState(false);
    const [required, setRequired] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState<string | undefined>(undefined);

    return (
        <div className="flex flex-col md:flex-row items-start justify-between md:items-center py-3 md:py-1.5 md:pr-3 hover:bg-primary/5">
            <div className="flex mb-1 md:mb-0">
                <Input
                    value={name}
                    placeholder={strings.Name}
                    error={error}
                    onChange={(e) => {
                        const val = e.target.value
                        setName(val)
                        if (val.length === 0) {
                            setError(strings.Required);
                        } else {
                            setError(undefined);
                        }
                    }}
                />
                <IconButton
                    onClick={() => {
                        setName('');
                        setRequired(false);
                        setView(false);
                        onAdd({ required, view, name })
                    }}
                >
                    <AddIcon />
                </IconButton>
            </div>
            <div className="flex items-center space-x-3">
                <Checkbox
                    label={strings.setting_view}
                    checked={view}
                    onChange={(e) => setView(e.currentTarget.checked)}
                />
                <Checkbox
                    label={strings.setting_required}
                    checked={required}
                    onChange={(e) => setRequired(e.currentTarget.checked)}
                />
            </div>
        </div>
    );
}

export default SettingPortalItemAdd;