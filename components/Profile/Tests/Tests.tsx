import TestsProps from './Tests.props';
import Test from '../Test/Test';

const Tests = (props: TestsProps) => {
	return (
		<div className='space-y-3'>
			{props.tests.map((test, index) => (
				<Test key={index} {...test} />
			))}

			<a
				className='bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-indigo-200 transition'
				href='/add-test'
			>
				Створити тест
			</a>
		</div>
	);
};

export default Tests;
