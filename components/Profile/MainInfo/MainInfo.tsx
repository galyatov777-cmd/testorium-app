'use client';

import React from 'react';
import { useAuth } from '@/layout/AuthProvider/AuthProvider';

const formatDate = (date?: string | null) => {
	if (!date) return '-';
	return new Date(date).toLocaleDateString();
};

const formatDateTime = (date?: string | null) => {
	if (!date) return '-';
	return new Date(date).toLocaleString();
};

const MainInfo = () => {
	const { user, loading } = useAuth();
	console.log(user);

	if (loading) {
		return <p className='text-slate-500'>Завантаження...</p>;
	}

	if (!user) {
		return <p className='text-red-500'>Користувач не знайдений</p>;
	}

	return (
		<div className='space-y-4'>
			<div>
				<p className='text-sm text-slate-500'>Імʼя</p>
				<p className='font-medium'>{user.full_name}</p>
			</div>

			<div>
				<p className='text-sm text-slate-500'>Про себе</p>
				<p className='font-medium'>{user.about || '-'}</p>
			</div>

			<div>
				<p className='text-sm text-slate-500'>Email</p>
				<p className='font-medium'>{user.email}</p>
			</div>

			<div>
				<p className='text-sm text-slate-500'>Номер телефону</p>
				<p className='font-medium'>{user.phone || '-'}</p>
			</div>

			<div>
				<p className='text-sm text-slate-500'>Місцезнаходження</p>
				<p className='font-medium'>{user.location || '-'}</p>
			</div>

			<div>
				<p className='text-sm text-slate-500'>Дата народження</p>
				<p className='font-medium'>{formatDate(user.birth_date)}</p>
			</div>

			<div>
				<p className='text-sm text-slate-500'>Заклад</p>
				<p className='font-medium'>{user.university || '-'}</p>
			</div>

			<div>
				<p className='text-sm text-slate-500'>Роль</p>
				<p className='font-medium'>{user.role || '-'}</p>
			</div>

			<div>
				<p className='text-sm text-slate-500'>Дата реєстрації</p>
				<p className='font-medium'>{formatDate(user.created_at)}</p>
			</div>
		</div>
	);
};

export default MainInfo;
