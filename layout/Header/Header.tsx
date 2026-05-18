'use client';

import Link from 'next/link';
import React from 'react';
import { useAuth } from '@/layout/AuthProvider/AuthProvider';

const Header = () => {
	const { user, loading, logout } = useAuth();

	return (
		<header className='px-6 pt-6 pb-8 max-w-7xl mx-auto border-b border-slate-50 w-full'>
			<nav className='flex justify-between items-center'>
				<Link
					href='/'
					className='text-xl font-bold tracking-tight text-indigo-600'
				>
					TESTORIUM
				</Link>

				<div className='flex space-x-4 items-center'>
					{/* ⏳ Пока грузится — ничего не показываем */}
					{loading ? null : user ? (
						<>
							{/* Имя пользователя */}
							<span className='text-sm text-slate-600 mr-10 font-semibold'>
								{user.full_name}
							</span>

							{/* Профиль */}
							<Link
								href='/profile'
								className='bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:shadow-indigo-200 transition'
							>
								Профіль
							</Link>

							{/* Logout */}
							<button
								onClick={logout}
								className='bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition'
							>
								Вийти
							</button>
						</>
					) : (
						<>
							{/* Вхід */}
							<Link
								href='/login'
								className='bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:shadow-indigo-200 transition'
							>
								Вхід
							</Link>

							{/* Реєстрація */}
							<Link
								href='/register'
								className='bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition'
							>
								Реєстрація
							</Link>
						</>
					)}
				</div>
			</nav>
		</header>
	);
};

export default Header;
