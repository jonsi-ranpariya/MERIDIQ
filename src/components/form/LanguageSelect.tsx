import languages from "../../configs/languages";
import useTranslation, { Languages } from "@hooks/useTranslation";
import strings from "@lang/Lang";
import Select from "./Select";

export interface LanguageSelectProps {

}

const LanguageSelect: React.FC<LanguageSelectProps> = () => {
  const [language, setLanguage] = useTranslation();

  const selectedLanguage = languages.find((lang) => lang.value === language);

  return (
    <Select
      displayValue={(lang) => selectedLanguage?.name}
      value={selectedLanguage?.value}
      onChange={(lang) => setLanguage(lang as Languages)}
      label={strings.Language}
    >
      {languages.map((lang) => (
        <Select.Option key={lang.value} value={lang.value}>{lang.name}</Select.Option>
      ))}
    </Select>
  )
}

export default LanguageSelect;