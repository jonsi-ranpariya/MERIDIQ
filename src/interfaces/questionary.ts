export interface HealthQuestionaryData extends Array<({
    answer: 0 | 1 | null | '',
    more_info: string,
} | {
    answer: 0 | 1 | null | '',
    more_info?: undefined,
} | {
    answer?: undefined,
    more_info: string,
})> { }

export interface HealthQuestionaryValues {
    data: HealthQuestionaryData,
    server?: string,
}

export interface Covid19QuestionaryData extends Array<({
    answer: 0 | 1 | null | '',
    more_info: string,
} | {
    answer: 0 | 1 | null | '',
    more_info?: undefined,
} | {
    answer?: undefined,
    more_info: string,
})> { }

export type AestheticInterestTypes = ({
    notes: string;
    answer_checkbox?: (0 | 1)[];
    image?: null | string | Blob;
    other?: string;
} | {
    answer_checkbox: (0 | 1)[];
    notes?: string;
    image?: null | string | Blob;
    other?: string;
} | {
    image: null | string | Blob;
    notes?: string;
    answer_checkbox?: (0 | 1)[];
    other?: string;
} | {
    image?: null | string | Blob;
    notes?: string;
    answer_checkbox: (0 | 1)[];
    other: string;
});

export interface AestheticInterestData extends Array<AestheticInterestTypes> { }

export interface Covid19QuestionaryValues {
    data: Covid19QuestionaryData,
    server?: string,
}

export interface AestheticInterestValues {
    data: AestheticInterestData,
    server?: string,
}

export const INITIAL_COVID19_STATE: Covid19QuestionaryData = [
    // 0
    {
        answer: '',
        more_info: '',
    },
    // 1
    {
        answer: '',
        more_info: '',
    },
    // 2
    {
        answer: '',
        more_info: '',
    },
    // 3
    {
        answer: '',
        more_info: '',
    },
    // 4
    {
        answer: '',
        more_info: '',
    },
    // 5
    {
        answer: '',
        more_info: '',
    },
    // 6
    {
        answer: '',
        more_info: '',
    },
    // 7
    {
        answer: '',
    },
    // 8
    {
        answer: '',
        more_info: '',
    },
    // 9
    {
        answer: '',
        more_info: '',
    },
    // 10
    {
        answer: '',
        more_info: '',
    },
    // 11
    {
        answer: '',
        more_info: '',
    },
];

export const INITIAL_AESTETHIC_STATE: AestheticInterestData = [
    // 0
    {
        notes: '',
    },
    // 1
    {
        answer_checkbox: [
            0, 0, 0, 0, 0,
        ],
    },
    // 2
    {
        answer_checkbox: [
            0, 0, 0, 0, 0, 0, 0, 0,
        ],
    },
    // 3
    {
        answer_checkbox: [
            0, 0, 0, 0,
        ],
    },
    // 4
    {
        answer_checkbox: [
            0, 0, 0, 0,
        ],
    },
    // 5
    {
        image: null,
    },
    // 6
    {
        answer_checkbox: [
            0, 0, 0, 0,
        ],
    },
    // 7
    {
        answer_checkbox: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        other: '',
    },
    // 8
    {
        answer_checkbox: [
            0, 0, 0, 0, 0, 0, 0,
        ],
        other: '',
    },
    // 9
    {
        answer_checkbox: [
            0, 0, 0,
        ],
    },
    // 10
    {
        notes: '',
    },
];

export const INITIAL_HEALTH_STATE: HealthQuestionaryData = [
    // 0
    {
        answer: '',
        more_info: '',
    },
    // 1
    {
        answer: '',
    },
    // 2
    {
        answer: '',
    },
    // 3
    {
        answer: '',
        more_info: '',
    },
    // 4
    {
        answer: '',
    },
    // 5
    {
        answer: '',
    },
    // 6
    {
        answer: '',
        more_info: '',
    },
    // 7
    {
        answer: '',
        more_info: '',
    },
    // 8
    {
        answer: '',
        more_info: '',
    },
    // 9
    {
        answer: '',
        more_info: '',
    },
    // 10
    {
        answer: '',
    },
    // 11
    {
        answer: '',
    },
    // 12
    {
        answer: '',
    },
    // 13
    {
        answer: '',
    },
    // 14
    {
        answer: '',
    },
    // 15
    {
        answer: '',
    },
    // 16
    {
        answer: '',
    },
    // 17
    {
        answer: '',
    },
    // 18
    {
        answer: '',
    },
    // 19
    {
        answer: '',
    },
    // 20
    {
        answer: '',
    },
    // 21
    {
        answer: '',
        more_info: '',
    },
    // 22
    {
        answer: '',
        more_info: '',
    },
    // 23
    {
        answer: '',
        more_info: '',
    },
    // 24
    {
        answer: '',
    },
    // 25
    {
        answer: '',
    },
    // 26
    {
        answer: '',
    },
    // 27
    {
        answer: '',
    },
    // 28
    {
        more_info: '',
    },
];