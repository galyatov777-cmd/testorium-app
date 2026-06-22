import Link from 'next/link';
import React from 'react';

const Footer = () => {
	return (
		<footer className='border-t border-slate-100 pt-20 pb-10 px-6 bg-white'>
			<div className='max-w-7xl mx-auto'>
				{/* CTA */}
				<div className='text-center max-w-2xl mx-auto mb-24 py-6'>
					<h2 className='text-3xl md:text-4xl font-semibold tracking-tight mb-4'>
						Готові підвищити якість освіти?
					</h2>
					<p className='text-slate-600 mb-6'>
						Почніть використовувати Testorium вже сьогодні — без складних
						налаштувань.
					</p>
					<button className='bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium text-base hover:shadow-lg hover:shadow-indigo-200 transition'>
						Зареєструватися
					</button>
				</div>

				{/* Main grid */}
				<div className='grid md:grid-cols-4 gap-10 mb-16'>
					{/* Brand */}
					<div>
						<h3 className='text-lg font-semibold mb-4'>Testorium</h3>
						<p className='text-slate-500 text-sm leading-relaxed mb-4'>
							Платформа для створення тестів, оцінювання знань та управління
							навчальним процесом.
						</p>

						<div className='flex gap-4 text-slate-400 text-sm'>
							<a href='#' className='hover:text-indigo-600 transition'>
								Telegram
							</a>
							<a href='#' className='hover:text-indigo-600 transition'>
								Facebook
							</a>
							<a href='#' className='hover:text-indigo-600 transition'>
								Instagram
							</a>
						</div>
					</div>

					{/* Company */}
					<div>
						<h4 className='font-semibold mb-4'>Компанія</h4>
						<ul className='space-y-2 text-slate-500 text-sm'>
							<li>
								<Link
									href='/contacts'
									className='hover:text-slate-900 transition'
								>
									Контакти
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h4 className='font-semibold mb-4'>Правова інформація</h4>
						<ul className='space-y-2 text-slate-500 text-sm'>
							<li>
								<Link
									href='/privacy-policy'
									className='hover:text-slate-900 transition'
								>
									Політика конфіденційності
								</Link>
							</li>
							<li>
								<Link href='/' className='hover:text-slate-900 transition'>
									Умови використання
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom */}
				<div className='flex flex-col md:flex-row justify-between items-center border-t border-slate-100 pt-6 text-sm text-slate-400'>
					<p>© 2026 Testorium. Усі права захищено.</p>

					<div className='flex gap-6 mt-4 md:mt-0'>
						<a href='#' className='hover:text-slate-600 transition'>
							Telegram
						</a>
						<a href='#' className='hover:text-slate-600 transition'>
							WhatsApp
						</a>
						<a href='#' className='hover:text-slate-600 transition'>
							Viber
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
