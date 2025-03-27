type Config = {
    environment: string;
    apiBaseURL: string;
    wsBaseURL: string;
    supabaseURL: string;
    supabaseAnonKey: string;
    omisePublicKey: string;
};

export const config: Config = {
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || '',
    apiBaseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    wsBaseURL: process.env.NEXT_PUBLIC_WS_BASE_URL || '',
    supabaseURL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    omisePublicKey: process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY || '',
};
