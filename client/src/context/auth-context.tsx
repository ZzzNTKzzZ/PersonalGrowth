
import { authService, LoginDto, RegisterDto } from "@/services/auth.service";
import { createContext, useEffect, useState, useContext } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean
    login: (dto: LoginDto) => Promise<void>
    register: (dto: RegisterDto) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null> (null)

export function  AuthProvider({ children}: { children: React.ReactNode}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    
    const checkAuth = async () => {
        try {
            const token = await authService.getAccessToken()

            if(token) {
                setIsAuthenticated(Boolean(token))
            }
        } finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (dto:LoginDto) => {
        await authService.login(dto)
        setIsAuthenticated(true)
    }

    const register = async (dto: RegisterDto) => {
        await authService.register(dto)
        setIsAuthenticated(true)
    }

    const logout = async () => {
        await authService.logout()
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, isLoading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth =  () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within an AuthProvider')
    return context
}