import {
	ArrowDown,
	Clock,
	Users,
	Award,
	BarChart2,
	CheckCircle2,
} from 'lucide-react';
import { TestProps } from './Test.props';
import { useState } from 'react';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
);

const Test = (props: TestProps) => {
	const [isShowStatistics, setIsShowStatistics] = useState<boolean>(false);

	const toggleStatistics = () => {
		setIsShowStatistics(prev => !prev);
	};
	const scoreValue =
		typeof props.score === 'string' && props.score.includes('/')
			? parseInt(props.score.split('/')[0])
			: Number(props.score) || 0;

	const averageValue =
		typeof props.average === 'string' && props.average.includes('/')
			? parseInt(props.average.split('/')[0])
			: Number(props.average) || 0;

	const totalQuestions = props.count || 10;

	const scorePercent = Math.round((scoreValue / totalQuestions) * 100);
	const averagePercent = Math.round((averageValue / totalQuestions) * 100);

	const getScoreColor = (percent: number) => {
		if (percent >= 80) return 'text-emerald-600';
		if (percent >= 50) return 'text-amber-500';
		return 'text-rose-500';
	};

	return (
		<div className='border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white'>
			{/* Header */}
			<div className='p-5 flex justify-between items-start gap-3'>
				<div className='flex-1 min-w-0'>
					<p className='font-semibold text-slate-800 text-base leading-snug truncate'>
						{props.title}
					</p>
					<div className='flex items-center gap-3 mt-1 flex-wrap'>
						<span className='flex items-center gap-1 text-xs text-slate-500'>
							<BarChart2 size={12} />
							{props.count} питань
						</span>
						<span className='flex items-center gap-1 text-xs text-slate-500'>
							<Users size={12} />
							{props.completed} проходжень
						</span>
						{props.estimatedTime && (
							<span className='flex items-center gap-1 text-xs text-slate-500'>
								<Clock size={12} />~{props.estimatedTime} хв
							</span>
						)}
					</div>
				</div>

				<div className='flex items-center gap-3 shrink-0'>
					<button className='text-indigo-600 text-sm font-semibold hover:text-indigo-800 transition-colors'>
						Переглянути
					</button>
					<button
						onClick={toggleStatistics}
						className='w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center'
						aria-label='Статистика'
					>
						<ArrowDown
							className={`text-slate-500 transition-transform duration-300 ${isShowStatistics ? 'rotate-180' : ''}`}
							size={15}
						/>
					</button>
				</div>
			</div>

			{/* Expandable Statistics */}
			<div
				className={`transition-all duration-300 overflow-hidden ${
					isShowStatistics ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
				}`}
			>
				<div className='border-t border-slate-100 px-5 py-5 bg-slate-50 flex flex-col gap-6'>
					{/* Score Cards Row */}
					<div className='grid grid-cols-3 gap-3'>
						<div className='bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex flex-col gap-1'>
							<p className='text-xs text-slate-400 font-medium uppercase tracking-wide'>
								Останній
							</p>
							<p
								className={`text-2xl font-bold ${getScoreColor(scorePercent)}`}
							>
								{scorePercent}%
							</p>
							<p className='text-xs text-slate-500'>{props.score} правильних</p>
						</div>

						<div className='bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex flex-col gap-1'>
							<p className='text-xs text-slate-400 font-medium uppercase tracking-wide'>
								Середній
							</p>
							<p
								className={`text-2xl font-bold ${getScoreColor(averagePercent)}`}
							>
								{averagePercent}%
							</p>
							<p className='text-xs text-slate-500'>
								{props.average} правильних
							</p>
						</div>

						<div className='bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex flex-col gap-1'>
							<p className='text-xs text-slate-400 font-medium uppercase tracking-wide'>
								Проходжень
							</p>
							<p className='text-2xl font-bold text-indigo-600'>
								{props.completed}
							</p>
							<p className='text-xs text-slate-500'>всього разів</p>
						</div>
					</div>

					{/* Quick Stats Footer */}
					<div className='flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200'>
						<span className='flex items-center gap-1'>
							<CheckCircle2 size={12} className='text-emerald-500' />
							Успіх:{' '}
							<span className='font-semibold text-slate-700 ml-0.5'>
								{scorePercent >= 60 ? 'Так' : 'Ні'}
							</span>
						</span>
						{props.lastAttemptDate && (
							<span className='flex items-center gap-1'>
								<Clock size={12} />
								Останнє: {props.lastAttemptDate}
							</span>
						)}
						<span className='flex items-center gap-1'>
							<Award size={12} className='text-indigo-400' />
							Рейтинг:{' '}
							<span className='font-semibold text-slate-700 ml-0.5'>
								{props.rank ?? '—'}
							</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Test;
