import IconButton from '@components/form/IconButton';
import React, { memo, useState } from 'react'
import EyeIcon from '../../Icons/Eye'
import Switch from '../../../components/form/Switch'

export interface SettingQuestionnerItemProps {
    id?: any,
    title?: string,
    onChange?: (key: string, checked: boolean) => Promise<void>,
    onViewClick?: () => void,
    checked?: boolean,
    showView?: boolean,
    name: string,
}

const SettingQuestionnerItem: React.FC<SettingQuestionnerItemProps> = ({
    title = '',
    onChange = () => {},
    onViewClick = () => {},
    showView = true,
    checked = false,
    name,
}) => {

    const [loading, setLoading] = useState(false)

    async function handleChange(checked: boolean) {
        setLoading(true)
        await onChange(name, checked)
        setLoading(false)
    }
    return (
        <div className="flex justify-between items-center py-3 space-x-3">
            <h3 className="font-medium break-all">
                {title}
            </h3>
            <div className="flex items-center space-x-2">
                {showView &&
                    <IconButton className='hover:text-primary' onClick={onViewClick}>
                        <EyeIcon className="text-lg cursor-pointer" />
                    </IconButton>
                }
                <Switch
                    name={name}
                    loading={loading}
                    checked={checked}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}

export default memo(SettingQuestionnerItem);