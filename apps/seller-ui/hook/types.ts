export type User = {
    id: string;
    email: string;
    phone?: string;
    name?: string;
    // accessToken?: string;
    role: 'SELLER' | 'ADMIN';
};

export type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    status:"UNAUTHENTICATED"|"AUTHENTICATED"|"PENDING";
    accessToken: string | null;


};

export type AuthAction =
    | { type: 'LOGIN'; payload: {user:User, accessToken: string} }
    | { type: 'LOGOUT' };
