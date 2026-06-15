import { BookOpen, CheckCircle, BarChart3 } from 'lucide-react';

const Features = () => {
	return (
		<section className='px-6 py-24 max-w-7xl mx-auto'>
			<h2 className='text-3xl font-bold mb-4 text-center'>
				Чому здобувачі обирають Testorium?
			</h2>
			<p className='text-center text-slate-500 mb-16 max-w-xl mx-auto'>
				Все необхідне для підготовки та проходження тестування з освітніх компонентів — в одному місці.
			</p>
			<div className='grid md:grid-cols-3 gap-12'>
				{[
					{
						icon: <BookOpen className='text-indigo-600' />,
						title: 'Тести з кожної дисципліни',
						desc: 'Проходьте тестування з усіх освітніх компонентів свого навчального плану в одному місці, без зайвих реєстрацій.',
					},
					{
						icon: <CheckCircle className='text-indigo-600' />,
						title: 'Миттєвий результат',
						desc: 'Дізнайтесь свій бал одразу після завершення тесту — детальний розбір відповідей доступний без очікування.',
					},
					{
						icon: <BarChart3 className='text-indigo-600' />,
						title: 'Відстеження прогресу',
						desc: 'Аналізуйте свою успішність по кожному компоненту, виявляйте прогалини у знаннях і вдосконалюйтесь.',
					},
				].map((item, i) => (
					<div
						key={i}
						className='p-8 border border-slate-100 rounded-2xl bg-slate-50/50 hover:shadow-sm transition'
					>
						<div className='mb-4'>{item.icon}</div>
						<h3 className='text-xl font-bold mb-3'>{item.title}</h3>
						<p className='text-slate-600'>{item.desc}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default Features;
