'use client';

import { create } from 'zustand';

import {
	loginRequest,
	registerRequest,
	meRequest,
} from '@/zustand/services/auth.service';

import { AuthState, User } from '@/zustand/types/auth.types';

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	token: null,
	loading: false,

	login: async (email, password) => {
		try {
			set({ loading: true });

			const data = await loginRequest(email, password);

			localStorage.setItem('token', data.token);

			set({
				user: data.user,
				token: data.token,
			});
		} finally {
			set({ loading: false });
		}
	},

	register: async (full_name, email, password) => {
		try {
			set({ loading: true });

			const data = await registerRequest(full_name, email, password);

			localStorage.setItem('token', data.token);

			set({
				user: data.user,
				token: data.token,
			});
		} finally {
			set({ loading: false });
		}
	},

	logout: () => {
		localStorage.removeItem('token');

		set({
			user: null,
			token: null,
		});
	},

	checkAuth: async () => {
		try {
			const token = localStorage.getItem('token');

			if (!token) return;

			set({
				loading: true,
			});

			const user = await meRequest(token);

			set({
				user,
				token,
			});
		} catch {
			localStorage.removeItem('token');
		} finally {
			set({
				loading: false,
			});
		}
	},
}));
