import React from 'react';

const Process = () => {
	return (
		<section className='px-6 py-24 max-w-7xl mx-auto text-center'>
			<h2 className='text-3xl font-black mb-12'>Як це працює</h2>
			<div className='flex flex-col md:flex-row justify-between gap-8 relative'>
				{[
					{ step: '01', label: 'Реєстрація' },
					{ step: '02', label: 'Вибір компонента' },
					{ step: '03', label: 'Тестування' },
					{ step: '04', label: 'Аналіз результатів' },
				].map((item, i) => (
					<div key={i} className='flex-1'>
						<div className='text-4xl font-black text-slate-400 mb-2'>
							{item.step}
						</div>
						<div className='h-1 bg-indigo-600 w-12 mx-auto mb-4'></div>
						<h4 className='font-bold'>{item.label}</h4>
					</div>
				))}
			</div>
		</section>
	);
};

export default Process;
