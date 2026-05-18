import React from 'react';
import { Users, UsersIcon, ZoomIn } from 'lucide-react';
import WhomElement from '@/components/WhomElement/WhomElement';
import Image from 'next/image';
import imagePlatform from '@/public/teston.jpg';

const Whom = () => {
	return (
		<section className='bg-slate-900 text-white py-24 px-6'>
			<div className='max-w-7xl mx-auto flex flex-col md:flex-row items-stretch gap-16'>
				<div className='md:w-1/2'>
					<h2 className='text-4xl font-bold mb-6'>Для кого цей ресурс?</h2>
					<div className='flex gap-5'>
						<WhomElement
							title='Здобувачі освіти'
							description='Проходьте тестування у зручному інтерфейсі з будь-якого
									пристрою.'
							icon={<UsersIcon size={24} />}
						/>

						<WhomElement
							title='Викладачі'
							description='Створюйте бази питань та керуйте процесом оцінювання в
									реальному часі.'
							icon={<ZoomIn size={24} />}
						/>
					</div>
				</div>
				<div className='md:w-1/2 bg-slate-800 aspect-video rounded-3xl flex items-center justify-center border border-slate-700'>
					<Image
						src={imagePlatform}
						alt='testorium'
						width={1500}
						height={1500}
						className='w-full rounded-3xl border border-slate-700'
					/>
				</div>
			</div>
		</section>
	);
};

export default Whom;
