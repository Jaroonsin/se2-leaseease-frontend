type Config = {
    environment: string;
    apiBaseURL: string;
    wsBaseURL: string;
    omisePublicKey: string;
};

export const config: Config = {
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || '',
    apiBaseURL: (process.env.NEXT_PUBLIC_API_BASE_URL || '') + '/api/v2',
    wsBaseURL: (process.env.NEXT_PUBLIC_WS_BASE_URL || '') + '/api/v2',
    omisePublicKey: process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY || '',
};
