import Link from 'next/link';
import React from 'react';

const Hero = () => {
	return (
		<section className='max-w-7xl mx-auto mt-12'>
			<h1 className='text-5xl md:text-6xl font-extrabold leading-tight mb-6'>
				Сучасна екосистема
				<br />
				для <span className='text-indigo-600'>оцінювання знань</span>
			</h1>
			<p className='text-xl text-slate-600 mb-10 leading-relaxed'>
				Інформаційний ресурс, створений для прозорого та ефективного проведення
				<br />
				тестування з освітніх компонентів. Спрощуємо контроль якості освіти.
			</p>
			<div className='flex gap-4'>
				<Link
					href='/register'
					className='bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center gap-2'
				>
					Розпочати
				</Link>
			</div>
		</section>
	);
};

export default Hero;
