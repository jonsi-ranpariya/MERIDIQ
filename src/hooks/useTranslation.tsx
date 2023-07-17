import React, {
    createContext, useContext, useEffect,
} from 'react';
import strings from '../lang/Lang';
import useLocalStorage from './useLocalStorage';

export interface OnlyChildrenProps {
    children: React.ReactNode,
}

export type Languages = "en" | "sv";

type TranslationContextProps = [Languages, (value: Languages) => void | Languages | null]

const TranslationContext = createContext<TranslationContextProps>([
    "en",
    () => {},
]);

export default function useTranslation() {
    return useContext(TranslationContext);
}

export function TranslationProvider({ children }: OnlyChildrenProps) {
    const {
        storedValue: language,
        setStorageValue,
    } = useLocalStorage<Languages>('language', strings.getLanguage() as Languages | 'en');

    document.querySelector("html")?.setAttribute('lang', language?.toString() || 'en');

    function setLanguage(lang: Languages) {
        setStorageValue(lang)
        strings.setLanguage(lang)
    }

    useEffect(() => {
        if (language) {
            strings.setLanguage(language);
        }
    }, [language])


    return (
        <TranslationContext.Provider
            value={[
                language || "en",
                setLanguage,
            ]}
        >
            {children}
        </TranslationContext.Provider>
    );
}
