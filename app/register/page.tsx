'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/layout/AuthProvider/AuthProvider';

export default function Register() {
	const { setAuthData, user } = useAuth();
	const router = useRouter();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState<{
		name?: string;
		email?: string;
		password?: string;
		confirmPassword?: string;
	}>({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (user) {
			router.replace('/profile');
		}
	}, [user, router]);

	const validate = () => {
		const newErrors: typeof errors = {};

		if (!name) {
			newErrors.name = 'Name is required';
		}

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

		if (!confirmPassword) {
			newErrors.confirmPassword = 'Confirm your password';
		} else if (confirmPassword !== password) {
			newErrors.confirmPassword = 'Passwords do not match';
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
				'http://localhost:3003/auth/register',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ full_name: name, email, password }),
				},
			);

			const data = await res.json();

			if (!res.ok) {
				alert(data.message || 'Помилка');
				return;
			}

			localStorage.setItem('token', data.token);
			setAuthData(data.token, data.user);

			setTimeout(() => {
				router.push('/profile');
			}, 100);
		} catch (err) {
			console.error(err);
			alert('Server error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className='min-h-[85vh] flex items-center justify-center bg-white text-slate-900 selection:bg-indigo-100 px-6'>
			<div className='w-full max-w-md'>
				<div className='border border-slate-200 rounded-2xl p-8 shadow-sm'>
					<h1 className='text-2xl font-semibold mb-2'>
						Створити обліковий запис
					</h1>
					<p className='text-slate-500 text-sm mb-6'>
						Почніть використовувати Testorium вже сьогодні — без складних
						налаштувань.
					</p>

					<form onSubmit={handleSubmit} className='space-y-5'>
						<div>
							<label className='block text-sm font-medium mb-1'>
								Ім&apos;я
							</label>
							<input
								type='text'
								value={name}
								onChange={e => setName(e.target.value)}
								className={`w-full px-4 py-2.5 rounded-lg border outline-none transition ${
									errors.name
										? 'border-red-400 focus:ring-2 focus:ring-red-100'
										: 'border-slate-200 focus:ring-2 focus:ring-indigo-100'
								}`}
								placeholder='Your name'
							/>
							{errors.name && (
								<p className='text-red-500 text-xs mt-1'>{errors.name}</p>
							)}
						</div>

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

						<div>
							<label className='block text-sm font-medium mb-1'>
								Підтвердити пароль
							</label>
							<input
								type='password'
								value={confirmPassword}
								onChange={e => setConfirmPassword(e.target.value)}
								className={`w-full px-4 py-2.5 rounded-lg border outline-none transition ${
									errors.confirmPassword
										? 'border-red-400 focus:ring-2 focus:ring-red-100'
										: 'border-slate-200 focus:ring-2 focus:ring-indigo-100'
								}`}
								placeholder='••••••••'
							/>
							{errors.confirmPassword && (
								<p className='text-red-500 text-xs mt-1'>
									{errors.confirmPassword}
								</p>
							)}
						</div>

						<button
							type='submit'
							disabled={loading}
							className='w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-200 transition disabled:opacity-70'
						>
							{loading
								? 'Створення облікового запису...'
								: 'Створити обліковий запис'}
						</button>
					</form>

					<div className='my-6 border-t border-slate-100' />

					<div className='text-center text-sm text-slate-500'>
						Вже маєте обліковий запис?{' '}
						<Link
							href='/login'
							className='text-indigo-600 font-medium hover:underline'
						>
							Увійти
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
