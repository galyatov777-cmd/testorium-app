'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

interface User {
	id: string;
	full_name: string;
	email: string;
	phone?: string;
	location?: string;
	birth_date?: string;
	created_at?: string;
	about?: string;
	university?: string;
	role?: string;
}

interface AuthContextValue {
	user: User | null;
	token: string | null;
	loading: boolean;
	logout: () => void;
	setAuthData: (token: string, user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const initAuth = async () => {
			const storedToken = localStorage.getItem('token');

			if (!storedToken) {
				setLoading(false);
				return;
			}

			try {
				const res = await fetch('http://localhost:3003/auth/me', {
					headers: {
						Authorization: `Bearer ${storedToken}`,
					},
				});

				if (!res.ok) {
					throw new Error('Unauthorized');
				}

				const userData: User = await res.json();

				setToken(storedToken);
				setUser(userData);
			} catch (e) {
				console.log('AUTH ERROR:', e);

				// ❗ НЕ удаляем токен мгновенно (можно оставить для дебага)
				localStorage.removeItem('token');
				setUser(null);
				setToken(null);
			} finally {
				setLoading(false); // ✅ только тут
			}
		};

		initAuth();
	}, []);

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);
		setToken(null);
		router.push('/login');
	};

	const setAuthData = (newToken: string, newUser: User) => {
		console.log('SET TOKEN:', newToken);
		localStorage.setItem('token', newToken);
		setToken(newToken);
		setUser(newUser);
	};

	return (
		<AuthContext.Provider value={{ user, token, loading, logout, setAuthData }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}
