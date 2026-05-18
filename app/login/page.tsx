'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/layout/AuthProvider/AuthProvider';

export default function Login() {
	const { setAuthData } = useAuth();
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{},
	);
	const [loading, setLoading] = useState(false);

	const validate = () => {
		const newErrors: typeof errors = {};

		if (!email) {
			newErrors.email = 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = 'Invalid email format';
		}

		if (!password) {
			newErrors.password = 'Password is required';
		} else if (password.length < 6) {
			newErrors.password = 'Minimum 6 characters';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) return;

		setLoading(true);

		try {
			const res = await fetch(
				'http://testorium-server-production.up.railway.app/auth/login',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email, password }),
				},
			);

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || 'Login error');
			}

			// ❗ 1. Сначала сохраняем токен напрямую
			localStorage.setItem('token', data.token);

			// ❗ 2. Потом обновляем контекст
			setAuthData(data.token, data.user);

			// ❗ 3. Небольшая задержка (важно для Next.js)
			setTimeout(() => {
				console.log('LOGIN RESPONSE:', data);
				router.push('/profile');
			}, 100);
		} catch (err: any) {
			alert(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className='min-h-[85vh] flex items-center justify-center bg-white text-slate-900 selection:bg-indigo-100 px-6'>
			<div className='w-full max-w-md'>
				{/* Card */}
				<div className='border border-slate-200 rounded-2xl p-8 shadow-sm'>
					<h1 className='text-2xl font-semibold mb-2'>
						Залогінитися в Testorium
					</h1>
					<p className='text-slate-500 text-sm mb-6'>
						Введіть свої дані, щоб продовжити
					</p>

					<form onSubmit={handleSubmit} className='space-y-5'>
						{/* Email */}
						<div>
							<label className='block text-sm font-medium mb-1'>Пошта</label>
							<input
								type='email'
								value={email}
								onChange={e => setEmail(e.target.value)}
								className={`w-full px-4 py-2.5 rounded-lg border outline-none transition ${
									errors.email
										? 'border-red-400 focus:ring-2 focus:ring-red-100'
										: 'border-slate-200 focus:ring-2 focus:ring-indigo-100'
								}`}
								placeholder='you@example.com'
							/>
							{errors.email && (
								<p className='text-red-500 text-xs mt-1'>{errors.email}</p>
							)}
						</div>

						{/* Password */}
						<div>
							<label className='block text-sm font-medium mb-1'>Пароль</label>
							<input
								type='password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								className={`w-full px-4 py-2.5 rounded-lg border outline-none transition ${
									errors.password
										? 'border-red-400 focus:ring-2 focus:ring-red-100'
										: 'border-slate-200 focus:ring-2 focus:ring-indigo-100'
								}`}
								placeholder='••••••••'
							/>
							{errors.password && (
								<p className='text-red-500 text-xs mt-1'>{errors.password}</p>
							)}
						</div>

						{/* Login button */}
						<button
							type='submit'
							disabled={loading}
							className='w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-200 transition disabled:opacity-70'
						>
							{loading ? 'Заходить...' : 'Увійти'}
						</button>
					</form>

					{/* Divider */}
					<div className='my-6 border-t border-slate-100' />

					{/* Register */}
					<div className='text-center text-sm text-slate-500'>
						Не маєте облікового запису?{' '}
						<Link
							href='/register'
							className='text-indigo-600 font-medium hover:underline'
						>
							Створити обліковий запис
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
