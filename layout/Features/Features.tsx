import { BookOpen, CheckCircle, BarChart3 } from 'lucide-react';

const Features = () => {
	return (
		<section className='px-6 py-24 max-w-7xl mx-auto'>
			<h2 className='text-3xl font-bold mb-16 text-center'>
				Чому обирають Testorium?
			</h2>
			<div className='grid md:grid-cols-3 gap-12'>
				{[
					{
						icon: <BookOpen className='text-indigo-600' />,
						title: 'Гнучкість компонентів',
						desc: 'Можливість адаптації тестів під будь-яку дисципліну чи освітній модуль.',
					},
					{
						icon: <CheckCircle className='text-indigo-600' />,
						title: 'Миттєвий результат',
						desc: "Автоматична перевірка та надання зворотного зв'язку здобувачам освіти.",
					},
					{
						icon: <BarChart3 className='text-indigo-600' />,
						title: 'Аналітика',
						desc: 'Детальна статистика успішності для викладачів та адміністрації.',
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
