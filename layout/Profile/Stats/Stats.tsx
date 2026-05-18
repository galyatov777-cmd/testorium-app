import StatItem from '@/components/Profile/StatItem/StatItem';
import StatsProps from './Stats.props';

const Stats = (props: StatsProps) => {
	return (
		<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-10'>
			{props.stats.map((stat, index) => (
				<StatItem key={index} title={stat.title} value={stat.value} />
			))}
		</div>
	);
};

export default Stats;
