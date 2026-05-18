export default function Contacts() {
	return (
		<main className=' bg-white text-slate-900 selection:bg-indigo-100'>
			<div className='max-w-6xl mx-auto px-6 py-20'>
				{/* Header */}
				<div className='text-center max-w-2xl mx-auto mb-14'>
					<h1 className='text-4xl font-semibold tracking-tight mb-4'>
						Контакти
					</h1>
					<p className='text-slate-600'>
						Маєте питання, ідеї або потрібна допомога? Ми завжди відкриті для
						зв&apos;зку — оберіть будь-який зручний спосіб нижче.
					</p>
				</div>

				{/* Cards */}
				<div className='grid md:grid-cols-2 gap-6'>
					{/* Main contact card */}
					<div className='rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition'>
						<h2 className='text-xl font-semibold mb-4'>Загальний контакт</h2>

						<div className='space-y-3 text-slate-600'>
							<p>
								Пошта:{' '}
								<a
									href='mailto:support@testorium.com'
									className='text-indigo-600 hover:underline font-medium'
								>
									support@testorium.com
								</a>
							</p>

							<p>
								Phone:{' '}
								<a
									href='tel:+380000000000'
									className='text-indigo-600 hover:underline font-medium'
								>
									+38 (000) 000 00 00
								</a>
							</p>
						</div>

						<p className='text-sm text-slate-400 mt-4'>
							Ми зазвичай відповідаємо протягом кількох годин.
						</p>
					</div>

					{/* Socials */}
					<div className='rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition'>
						<h2 className='text-xl font-semibold mb-4'>Соціальні мережі</h2>

						<div className='grid grid-cols-2 gap-3'>
							<a
								href='https://t.me/yourusername'
								target='_blank'
								className='flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition'
							>
								<span>📩</span>
								<span className='font-medium'>Telegram</span>
							</a>

							<a
								href='https://wa.me/380000000000'
								target='_blank'
								className='flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition'
							>
								<span>💬</span>
								<span className='font-medium'>WhatsApp</span>
							</a>

							<a
								href='viber://chat?number=380000000000'
								className='flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition'
							>
								<span>📱</span>
								<span className='font-medium'>Viber</span>
							</a>

							<a
								href='https://facebook.com/yourpage'
								target='_blank'
								className='flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition'
							>
								<span>🌐</span>
								<span className='font-medium'>Facebook</span>
							</a>
						</div>
					</div>
				</div>

				{/* CTA */}
				<div className='mt-16 text-center'>
					<div className='inline-block rounded-2xl bg-indigo-600 px-8 py-6 text-white shadow-md'>
						<h3 className='text-xl font-semibold mb-2'>
							Потрібна допомога прямо зараз?
						</h3>
						<p className='text-indigo-100 mb-4'>
							Напишіть нам безпосередньо в Telegram — найшвидша відповідь.
						</p>
						<a
							href='https://t.me/yourusername'
							target='_blank'
							className='inline-block bg-white text-indigo-600 px-5 py-2 rounded-lg font-medium hover:bg-indigo-50 transition'
						>
							Відкрити Telegram
						</a>
					</div>
				</div>
			</div>
		</main>
	);
}
