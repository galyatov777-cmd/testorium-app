'use client';

import Link from 'next/link';
import React from 'react';
import { useAuth } from '../AuthProvider/AuthProvider';

const Hero = () => {
	const { user } = useAuth();

	return (
		<section className='max-w-7xl mx-auto mt-12'>
			<h1 className='text-5xl md:text-6xl font-extrabold leading-tight mb-6'>
				Перевір знання з
				<br />
				<span className='text-indigo-600'>освітніх компонентів</span>
			</h1>
			<p className='text-xl text-slate-600 mb-10 leading-relaxed'>
				Зручна платформа для здобувачів освіти — проходь тестування
				<br />
				з дисциплін свого навчального плану, відстежуй прогрес і готуйся до підсумкового контролю.
			</p>
			{!user && (
				<div className='flex gap-4'>
					<Link
						href='/register'
						className='bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center gap-2'
					>
						Розпочати тестування
					</Link>
				</div>
			)}
		</section>
	);
};

export default Hero;
