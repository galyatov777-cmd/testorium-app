import StatItemProps from './StatItem.props';

const StatItem = (props: StatItemProps) => {
	return (
		<div className='p-4 border border-slate-200 rounded-xl hover:shadow-lg transition'>
			<p className='text-sm text-slate-500 font-medium'>{props.title}</p>
			<p className='text-xl font-bold'>{props.value}</p>
		</div>
	);
};

export default StatItem;
