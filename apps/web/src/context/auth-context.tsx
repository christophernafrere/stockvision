"use client";
import { usePathname } from "next/navigation";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

type AuthContextType = {
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (accessToken: string) => void;
    logout: () => Promise<void>;
    apiFetch: (
        input: RequestInfo | URL,
        init?: RequestInit,
    ) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

const publicRoutes = ["/auth/sign-in", "/auth/sign-up"];

export function AuthProvider({ children }: AuthProviderProps) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const accessTokenRef = useRef<string | null>(null);
    const refreshPromiseRef = useRef<Promise<string | null> | null>(null);
    const isAuthenticated = accessToken !== null;

    const login = (nextAccessToken: string) => {
        accessTokenRef.current = nextAccessToken;
        setAccessToken(nextAccessToken);
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:4000/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } finally {
            accessTokenRef.current = null;
            setAccessToken(null);
        }
    };

    const apiFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        if (isLoading && refreshPromiseRef.current) {
            await refreshPromiseRef.current;
        }

        const fetchWithToken = (token: string | null) =>
            fetch(input, {
                ...init,
                headers: {
                    ...init?.headers,
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

        const response = await fetchWithToken(accessTokenRef.current);

        if (response.status !== 401) {
            return response;
        }

        const refreshResponse = await fetch(
            "http://localhost:4000/auth/refresh",
            {
                method: "POST",
                credentials: "include",
            },
        );

        if (!refreshResponse.ok) {
            accessTokenRef.current = null;
            setAccessToken(null);
            return response;
        }

        const data = await refreshResponse.json();
        login(data.accessToken);

        return fetchWithToken(accessTokenRef.current);
    };

    useEffect(() => {
        if (publicRoutes.includes(pathname)) {
            setIsLoading(false);
            return;
        }

        const refresh = async (): Promise<string | null> => {
            try {
                const response = await fetch(
                    "http://localhost:4000/auth/refresh",
                    { method: "POST", credentials: "include" },
                );

                if (!response.ok) {
                    accessTokenRef.current = null;
                    setAccessToken(null);
                    return null;
                }

                const data = await response.json();
                login(data.accessToken);
                return data.accessToken;
            } catch {
                accessTokenRef.current = null;
                setAccessToken(null);
                return null;
            } finally {
                setIsLoading(false);
            }
        };

        refreshPromiseRef.current = refresh();
    }, [pathname]);

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                apiFetch,
                isLoading,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
