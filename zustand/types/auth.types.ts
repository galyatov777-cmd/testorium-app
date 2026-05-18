export interface User {
	id: number;
	full_name: string;
	email: string;
}

export interface AuthState {
	user: User | null;
	token: string | null;
	loading: boolean;

	login: (email: string, password: string) => Promise<void>;

	register: (
		full_name: string,
		email: string,
		password: string,
	) => Promise<void>;

	logout: () => void;

	checkAuth: () => Promise<void>;
}
