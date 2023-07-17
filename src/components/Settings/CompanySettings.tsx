
import LanguageSelect from '@components/form/LanguageSelect';
import Select from '@components/form/Select';
import Heading from '@components/heading/Heading';
import Skeleton from '@components/Skeleton/Skeleton';
import { ThemePalette } from '@provider/ThemeProvider';
import * as React from 'react';
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useSWR from "swr";
import api from "../../configs/api";
import { commonFetch, saveSetting } from "../../helper";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import { SettingResponse, SettingTypes } from "../../interfaces/common";
import strings from "../../lang/Lang";
import UnitSelect from "../../partials/Select/UnitSelect";
import SettingQuestionnerItem from "../../partials/Setting/Questionary/SettingQuestionnerItem";

export interface CompanySettingsProps {}

const CompanySettings: React.FC<CompanySettingsProps> = () => {

    const { data, mutate, error } = useSWR<SettingResponse, Error>(api.setting, commonFetch);
    const [savingSetting, setSavingSetting] = React.useState(false);
    const navigate = useNavigate();
    const loading = !data && !error;

    const { user } = useAuth()
    const isAdmin = user?.user_role === api.adminRole;

    const themeList = {
        light: strings.light,
        dark: strings.dark,
        system: strings.system,
    }

    const handleChange = async (key: string, value: boolean) => {
        if (savingSetting) return;
        setSavingSetting(true);
        const data = await saveSetting({
            key: key as SettingTypes,
            value: value ? '1' : '0',
        });
        if (data.webStatus === 401) {
            navigate('/');
        }
        if (data.status === '1') {
            await mutate();
            toast.success(data.message);
        } else {
            toast.error(data.message || 'please try again');
        }
        setSavingSetting(false);
    };

    const { theme, setTheme } = useTheme();

    const locItem = data?.data.find((setting) => setting.key === api.LOC_CHECKBOX)

    const locSettingsValue = locItem === undefined || (locItem?.value === "1")

    return (
        <>
            <div className="space-y-4 max-w-xl">
                <Heading text={strings.systemSettings} variant="headingTitle" />
                {isAdmin && <UnitSelect label={strings.UNIT} />}
                <LanguageSelect />
                <Select
                    value={theme}
                    label={strings.Theme}
                    // @ts-ignore
                    displayValue={(val) => val ? themeList[val as string] : ""}
                    onChange={(val) => {
                        setTheme(val as ThemePalette)
                    }}
                >
                    <Select.Option value='light'>{strings.light}</Select.Option>
                    <Select.Option value='dark'>{strings.dark}</Select.Option>
                    <Select.Option value='system'>{strings.system}</Select.Option>
                </Select>

            </div>
            <div className=" max-w-xl mt-4">
                {!isAdmin ? <></> : loading ? (
                    <>
                        <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                        <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                        <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                    </>
                ) :
                    <>
                        <SettingQuestionnerItem
                            showView={false}
                            title={strings.Client_Welcome_Email}
                            name={api.SEND_CLIENT_WELCOME_EMAIL as SettingTypes}
                            onChange={handleChange}
                            checked={!!data?.data.find((setting) => setting.key === api.SEND_CLIENT_WELCOME_EMAIL && setting.value === '1')}
                        />
                        <SettingQuestionnerItem
                            showView={false}
                            title={strings.send_email_to_clients}
                            name={api.SEND_CLIENT_EMAILS as SettingTypes}
                            onChange={handleChange}
                            checked={!!data?.data.find((setting) => setting.key === api.SEND_CLIENT_EMAILS && setting.value === '1')}
                        />
                        <SettingQuestionnerItem
                            showView={false}
                            title={strings.super_user_email_when_new_client_register}
                            name={api.SUPER_USER_MAIL_WHEN_CLIENT_REGISTER as SettingTypes}
                            onChange={handleChange}
                            checked={!!data?.data.find((setting) => setting.key === api.SUPER_USER_MAIL_WHEN_CLIENT_REGISTER && setting.value === '1')}
                        />
                        <SettingQuestionnerItem
                            showView={false}
                            title={strings.ACTIVATE_2FA}
                            name={api.SHOW_2FA as SettingTypes}
                            onChange={handleChange}
                            checked={!!data?.data.find((setting) => setting.key === api.SHOW_2FA && setting.value === '1')}
                        />
                        <SettingQuestionnerItem
                            showView={false}
                            title={strings.show_loc_signature}
                            name={api.LOC_CHECKBOX}
                            onChange={handleChange}
                            checked={locSettingsValue}
                        />
                    </>
                }
            </div>
        </>
    );
}

export default CompanySettings;