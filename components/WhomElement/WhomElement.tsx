import { Users } from 'lucide-react';
import React from 'react';
import WhomElementProps from './WhomElement.props';

const WhomElement = (props: WhomElementProps) => {
	return (
		<div className='flex flex-col items-center text-center justify-center gap-5 py-12 px-8 bg-slate-800 rounded-2xl shadow-2xl'>
			<div className='bg-indigo-500/20 p-2 rounded-lg h-fit w-fit'>
				{props.icon ? props.icon : <Users size={24} />}
			</div>
			<div>
				<h4 className='font-bold text-lg'>{props.title}</h4>
				<p className='text-slate-400'>{props.description}</p>
			</div>
		</div>
	);
};

export default WhomElement;
