import dayjs from "dayjs";
import api from "./configs/api";
import { CommonModelResponse, SettingTypes } from "./interfaces/common";
import { Client } from "./interfaces/model/client";
import { Company, Unit } from "./interfaces/model/company";
import { CompanyClientExtraField } from "./interfaces/model/companyClientExtraField";
import { Setting } from "./interfaces/model/setting";
import { User } from "./interfaces/model/user";
import { AestheticInterestData } from "./interfaces/questionary";
import strings from "./lang/Lang";
import { Category } from "@interface/model/category";
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')

export function shadeColor(color: string, percent: number) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + percent)).toString(16)).substr(-2));


    // let R: number = parseInt(color.substring(1, 3), 16);
    // let G: number = parseInt(color.substring(3, 5), 16);
    // let B: number = parseInt(color.substring(5, 7), 16);

    // R = parseInt((R * (100 + percent) / 100).toString());
    // G = parseInt((G * (100 + percent) / 100).toString());
    // B = parseInt((B * (100 + percent) / 100).toString());

    // R = (R < 255) ? R : 255;
    // G = (G < 255) ? G : 255;
    // B = (B < 255) ? B : 255;

    // let RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
    // let GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
    // let BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

    // return "#" + RR + GG + BB;
}

export const consentPermissions = (settings: Setting[], companyClientFields: CompanyClientExtraField[]) => {
    const firstList = settings.filter((v) => v.value === '1').map((setting) => {
        switch (setting.key) {
            case 'SHOW_HEALTH_QUESTIONNAIRE':
                return strings.HealthQuestionnaire;
            case 'SHOW_AESTHETIC_INTEREST':
                return strings.Aestethicinterest;
            case 'SHOW_COVID_19':
                return strings.Covid19Questionnaire;
            case 'SHOW_LETTER_OF_CONSENT':
                return strings.LettersofConsents;
        }
        return '';
    }).filter((v) => v);

    const secondList = settings.filter((v) => v.value === '1').map((setting) => {
        switch (setting.key) {
            case 'PORTAL_VIEW_OCCUPATION':
                return strings.setting_occupation;
            case 'PORTAL_VIEW_DATE_OF_BIRTH':
                return strings.setting_date_of_birth;
            case 'PORTAL_VIEW_CITY':
                return strings.setting_city;
            case 'PORTAL_VIEW_PHONE':
                return strings.setting_phone;
            case 'PORTAL_VIEW_STREET_ADDRESS':
                return strings.setting_street_address;
            case 'PORTAL_VIEW_ZIPCODE':
                return strings.setting_zip_code;
            case 'PORTAL_VIEW_STATE':
                return strings.setting_state;
            case 'PORTAL_VIEW_COUNTRY':
                return strings.setting_country;
            case 'PORTAL_VIEW_PROFILE':
                return strings.setting_profile;
        }
        return '';
    }).filter((v) => v);

    const thirdList = companyClientFields.filter((f) => f.view).map((fields) => {
        return fields.name;
    });

    const fourthList = [
        strings.setting_name,
        strings.setting_email,
        strings.setting_health_information,
    ];

    return [...fourthList, ...secondList, ...thirdList, ...firstList];
}

export const isValidDate = (date: string) => {
    return dayjs(date, 'YYYY-MM-DD').isValid();
}

export function getUrlExtension(url: string) {
    return url.split(/[#?]/)[0].split('.').pop()?.trim();
}

export function makeXMLRequest(method: string, url: string, formData: FormData, onprogress: (this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => any): Promise<XMLHttpRequest> {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            resolve(xhr);
        };

        xhr.upload.onprogress = onprogress;

        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('X-App-Locale', strings.getLanguage());

        xhr.withCredentials = true;

        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };

        xhr.send(formData);
    });
}

export async function generateCanvasImage(file: string): Promise<Blob | string> {
    const image = await toImage(file);
    // Resize the image
    let canvas = document.createElement('canvas');

    const expecedWidth = 1620;
    const width = expecedWidth; // 1580
    const height = expecedWidth * (image.height / image.width);

    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')?.drawImage(image, 0, 0, width, height);

    if (canvas?.toBlob) {
        return await new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    return resolve(blob)
                }
                reject("error");
            }, `jpeg`, 0.7);
        });
    } else {
        return canvas.toDataURL(`image/jpeg`, 0.7);
    }
}

export const toImage = async (string: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
    const image = new Image();
    image.src = string;
    image.onload = () => resolve(image);
    image.onerror = () => reject("not loaded");
});

export function getAestheticInterest(aestheticInterests: AestheticInterestData, imageData: string = '', formData = new FormData()) {
    aestheticInterests.forEach((aestheticInterest, index) => {
        Object.keys(aestheticInterest).forEach((name) => {
            if (name === 'notes') {
                formData.set(`aesthetic_interest[${index}][notes]`, aestheticInterest.notes || '');
            } else if (name === 'answer_checkbox') {
                (aestheticInterest?.answer_checkbox || []).forEach((answerCheckbox, localIndex) => {
                    formData.set(`aesthetic_interest[${index}][answer_checkbox][${localIndex}]`, answerCheckbox.toString());
                });
            } else if (name === 'other') {
                formData.set(`aesthetic_interest[${index}][other]`, aestheticInterest.other || '');
            } else if (name === 'image') {
                if (imageData) {
                    if (aestheticInterest.image instanceof Blob) {
                        formData.set(`aesthetic_interest[${index}][image]`, aestheticInterest.image);
                    } else if (isDataURL(imageData || '')) {
                        formData.set(`aesthetic_interest[${index}][image]`, convertBase64ToFile(imageData));
                    } else {
                        formData.set(`aesthetic_interest[${index}][image]`, 'null');
                    }
                } else {
                    try {
                        if (aestheticInterest.image instanceof Blob) {
                            formData.set(`aesthetic_interest[${index}][image]`, aestheticInterest.image);
                        } else if (isDataURL(aestheticInterest.image || '')) {
                            formData.set(`aesthetic_interest[${index}][image]`, convertBase64ToFile(aestheticInterest.image || ''));
                        } else {
                            formData.set(`aesthetic_interest[${index}][image]`, aestheticInterest.image || 'null');
                        }
                    } catch (error) {
                        formData.set(`aesthetic_interest[${index}][image]`, 'null');
                    }
                }
            }
        });
    });

    return formData;
}

//eslint-disable-next-line
const isDataURLRegex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

export const onlyNumberAllowedRegex = /[`~!@#$%^&*()_\-=[\]{};':"\\|,.<>/?A-Za-z]+$/;

export function isDataURL(s: string) {
    return !!s.match(isDataURLRegex);
}

export function isClassComponent(component: any) {
    return (
        typeof component === 'function' &&
        !!component.prototype.isReactComponent
    )
}

export function isFunctionComponent(component: any) {
    return (
        typeof component === 'function' &&
        String(component).includes('return React.createElement')
    )
}

export function isReactComponent(component: any) {
    return (
        isClassComponent(component) ||
        isFunctionComponent(component)
    )
}

export function generateUserFullName(user?: User | null) {
    if (!user) return '';
    return generateFullName(user?.first_name || '', user?.last_name || '');
}

export function userRole(user?: User) {
    return user?.email === user?.company?.email ? strings.superUser : user?.user_role;
}

export function generateClientFullName(client?: Client) {
    return generateFullName(client?.first_name || '', client?.last_name || '');
}

export function generateClientFullNameWithEmail(client?: Client) {
    return `${generateFullName(client?.first_name || '', client?.last_name || '')} (${client?.email})`;
}

export function generateClientAvatarName(client?: Client) {
    return generateAvatarName(client?.first_name || '', client?.last_name || '');
}

export function generateFullName(first_name: string, last_name: string) {
    return `${first_name} ${last_name}`;
}

export function generateAvatarName(first_name: string, last_name: string) {
    return `${first_name.charAt(0)}${last_name.charAt(0)}`.toUpperCase();
}

export const questionaryTypeToName = (value?: string) => {
    if (value === "App\\AestheticInterest") {
        return strings.Aestethicinterest;
    }
    if (value === "App\\HealthQuestionary") {
        return strings.HealthQuestionnaire;
    }
    if (value === "App\\Covid19") {
        return strings.Covid19Questionnaire;
    }

    return strings.ClientQuestionnaire;
}

export function getUnitKeyToValue(value: string) {
    if (value === 'usd') {
        return '$';
    }
    if (value === 'eur') {
        return '€';
    }
    if (value === 'sek') {
        return 'kr';
    }
    if (value === 'gbp') {
        return '£';
    }
    return value;
}

export const commonFetch = async (url: string) => {
    try {
        const response = await fetch(url, {
            headers: {
                "Accept": 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': 'test',
                'X-App-Locale': strings.getLanguage(),
            },
            credentials: "include",
        });

        const data = await response.json();

        if (response.status !== 200 || data.status !== '1') {

            const error = new Error(data.message || 'server error, contact server.');
            error.status = response.status;
            throw error;
        }

        return data;
    } catch (error) {
        if (!navigator.onLine) {
            return;
        }
        throw error;
    }
};

interface SaveSettingProps {
    key: SettingTypes,
    value: '1' | '0'
}

export const getSignedUrl = async (url: string) => {
    const res = await fetch(api.getSignedUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'content-type': 'application/json',
            'X-App-Locale': strings.getLanguage(),
        },
        body: JSON.stringify({
            path: url.split('?')[0],
        }),
        credentials: 'include',
    })
    const data = await res.json() as CommonModelResponse<string>;

    try {
        return data.data;
    } catch (error) {
        console.log(error);
        return url;
    }
}

export const saveSetting = async ({
    key, value,
}: SaveSettingProps) => {
    const response = await fetch(api.settingStore, {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': 'test',
            'X-App-Locale': strings.getLanguage(),
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ key, value }),
    });

    const webStatus = response.status;

    const data = await response.json();
    return { ...data, webStatus };
};

interface SaveCompanyClientExtraFieldProps {
    id?: number,
    name?: string,
    required?: boolean,
    view?: boolean,
}

export const saveCompanyClientExtraField = async (value: SaveCompanyClientExtraFieldProps) => {
    const response = await fetch(value.id ?
        api.companyClientExtraFieldUpdate.replace(':id', value.id.toString())
        : api.companyClientExtraFieldStore, {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': 'test',
            'X-App-Locale': strings.getLanguage(),
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(value),
    });

    const webStatus = response.status;

    const data = await response.json();
    return { ...data, webStatus };
};

export const deleteCompanyClientExtraField = async (id: number) => {
    const response = await fetch(api.companyClientExtraFieldDelete.replace(':id', id.toString()), {
        method: 'DELETE',
        headers: {
            "Accept": 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': 'test',
            'X-App-Locale': strings.getLanguage(),
            'Content-Type': 'application/json',
        },
        credentials: "include",
    });

    const webStatus = response.status;

    const data = await response.json();
    return { ...data, webStatus };
};

export const handleQuestionnaireActiveChange = async ({
    id,
    checked,
}: {
    id: number,
    checked: '1' | '0',
}) => {
    const response = await fetch(api.questionnaireUpdate.replace(':id', id.toString()), {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': 'test',
            'X-App-Locale': strings.getLanguage(),
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            is_active: checked,
        }),
    })
    const webStatus = response.status;

    const data = await response.json();
    return { ...data, webStatus };
};

export const saveUnit = async ({ value }: { value: Unit }) => {
    const response = await fetch(api.companyUpdate, {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': 'test',
            'X-App-Locale': strings.getLanguage(),
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ unit: value }),
    });

    const webStatus = response.status;

    const data = await response.json();
    return { ...data, webStatus };
};

export const cancelSubscription = async () => {
    const response = await fetch(api.subscriptionDelete, {
        method: 'DELETE',
        headers: {
            "Accept": 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': 'test',
            'X-App-Locale': strings.getLanguage(),
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    const webStatus = response.status;

    const data = await response.json();
    return { ...data, webStatus };
};

export const toBase64 = async (file: File | Blob): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
});

export const heic2convert = async (file: File | Blob) => {
    return import('heic2any')
        .then(async ({ default: heic2any }) => {
            return await heic2any({
                blob: file as Blob,
                toType: "image/jpeg",
            }) as Blob
        });
}

export const convertBase64ToFile = (b64Data: string): File => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (b64Data.split(',')[0].indexOf('base64') >= 0) byteString = atob(b64Data.split(',')[1]);
    else byteString = unescape(b64Data.split(',')[1]);

    // separate out the mime component
    const mimeString = b64Data.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ia], { type: mimeString });
    return new File([blob], 'canvasImage.jpeg', { type: 'image/jpeg' });
};

export function renderAddress(company?: Company) {
    return [company?.street_address, company?.zip_code, company?.city, company?.state, company?.country].filter((val) => val && val.length).join(', ');
}

export type DetailType = string | undefined
export function printDetails(values: DetailType[]) {
    return values.filter((val) => {
        return val?.length;
    }).join(',\n');
}

export function nFormatter(num: number, digits: number = 0) {
    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export function iOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}


export function formatDate(date: string | undefined | null, formatter = 'YYYY-MM-DD HH:mm:ss') {
    if (!date) return undefined;
    dayjs.extend(utc)
    return dayjs.utc(date).local().format(formatter);
}

export function timeZone() {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    return dayjs.tz.guess();
}

export function isHTML(str: string) {
    var doc = new DOMParser().parseFromString(str, "text/html");
    return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
}


export function deleteCookie(name: string) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function setCookie(name: string) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export async function aDownload(filename: string, url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
}
export function generateCategoryName(category?: Category) {
    return generateCateName(category?.name || '');
}
export function generateCateName(category_name: string) {
    return `${category_name}`;
}
