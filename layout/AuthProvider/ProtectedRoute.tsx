'use client';

import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, loading, token } = useAuth(); // 👈 добавили token
	const router = useRouter();

	useEffect(() => {
		// ❗ редирект только если точно нет токена
		if (!loading && !user && !token) {
			router.replace('/login');
		}
	}, [loading, user, token, router]);

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin' />
			</div>
		);
	}

	if (!user) return null;

	return <>{children}</>;
}
