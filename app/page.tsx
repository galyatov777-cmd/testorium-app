import Hero from '@/layout/Hero/Hero';
import Features from '@/layout/Features/Features';
import Whom from '@/layout/Whom/Whom';
import Process from '@/layout/Process/Process';

export default function Home() {
	return (
		<main className='min-h-screen bg-white text-slate-900 selection:bg-indigo-100'>
			<Hero />
			<Features />
			<Whom />
			<Process />
		</main>
	);
}
