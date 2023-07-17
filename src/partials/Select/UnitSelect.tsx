import Select, { SelectProps } from '@components/form/Select';
import React, { useState } from 'react';
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import units from "../../configs/unit";
import { getUnitKeyToValue, saveUnit } from "../../helper";
import useAuth from "../../hooks/useAuth";
import { Unit } from "../../interfaces/model/company";

export interface UnitSelectProps extends Omit<SelectProps, "onChange" | "displayValue"> {
    disabled?: boolean
}

const UnitSelect: React.FC<UnitSelectProps> = ({ disabled, ...props }) => {

    const { mutate: reload, user } = useAuth();
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleUnitChange = async (val: string) => {
        setLoading(true);
        const data = await saveUnit({
            value: val as Unit
        });
        if (data.webStatus === 401) {
            navigate('/');
        }
        setLoading(false);
        if (data.status === '1') {
            reload();
            toast.success(data.message);
        } else {
            toast.error(data.message || 'please try again');
        }
    };

    return (
        <Select
            displayValue={() => getUnitKeyToValue(user?.company?.unit ?? '')}
            onChange={handleUnitChange}
            value={user?.company?.unit}
            disabled={disabled || loading}
            {...props}
        >
            {units.map((lang) => (
                <Select.Option value={lang.value} key={lang.value}>{lang.name}</Select.Option>
            ))}
        </Select>

    );
}

export default UnitSelect;