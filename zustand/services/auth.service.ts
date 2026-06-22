const API_URL = 'http://localhost:3003';

export const loginRequest = async (email: string, password: string) => {
	const response = await fetch(`${API_URL}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Login error');
	}

	return data;
};

export const registerRequest = async (
	full_name: string,
	email: string,
	password: string,
) => {
	const response = await fetch(`${API_URL}/auth/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			full_name,
			email,
			password,
		}),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Register error');
	}

	return data;
};

export const meRequest = async (token: string) => {
	const response = await fetch(`${API_URL}/auth/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Auth error');
	}

	return data;
};
