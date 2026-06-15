import React from 'react';

const Process = () => {
	return (
		<section className='px-6 py-24 max-w-7xl mx-auto text-center'>
			<h2 className='text-3xl font-black mb-4'>Як розпочати</h2>
			<p className='text-slate-500 mb-12 max-w-lg mx-auto'>
				Чотири прості кроки — і ти вже проходиш тестування зі свого освітнього компонента.
			</p>
			<div className='flex flex-col md:flex-row justify-between gap-8 relative'>
				{[
					{ step: '01', label: 'Зареєструйся', sub: 'Створи акаунт за хвилину' },
					{ step: '02', label: 'Обери компонент', sub: 'Знайди потрібну дисципліну' },
					{ step: '03', label: 'Пройди тест', sub: 'Відповідай у зручному темпі' },
					{ step: '04', label: 'Отримай результат', sub: 'Миттєвий бал і розбір помилок' },
				].map((item, i) => (
					<div key={i} className='flex-1'>
						<div className='text-4xl font-black text-slate-300 mb-2'>
							{item.step}
						</div>
						<div className='h-1 bg-indigo-600 w-12 mx-auto mb-4'></div>
						<h4 className='font-bold mb-1'>{item.label}</h4>
						<p className='text-slate-500 text-sm'>{item.sub}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default Process;
