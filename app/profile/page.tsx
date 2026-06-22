'use client';

import MainInfo from '@/components/Profile/MainInfo/MainInfo';
import Tests from '@/components/Profile/Tests/Tests';
import Stats from '@/layout/Profile/Stats/Stats';
import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import Link from 'next/link';
import Settings from '@/layout/Profile/Settings/Settings';
import ProtectedRoute from '@/layout/AuthProvider/ProtectedRoute';
import { useAuth } from '@/layout/AuthProvider/AuthProvider';

type Tab = {
	id: string;
	label: string;
	content: React.ReactNode;
};

export default function Profile() {
	const [activeTab, setActiveTab] = useState('info');
	const { user } = useAuth();

	// 🔥 НОВЕ: стейт для тестів
	const [tests, setTests] = useState<any[]>([]);
	const [loadingTests, setLoadingTests] = useState(true);

	// 🔥 НОВЕ: запит до бекенду
	useEffect(() => {
		const fetchTests = async () => {
			try {
				const token = localStorage.getItem('token');

				const res = await fetch(
					'http://localhost:3003/tests/my',
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);

				const data = await res.json();

				console.log('TESTS DATA:', data); // 👉 подивись що приходить

				// 🔥 МАППІНГ під твій компонент Test
				const testsArray = Array.isArray(data)
					? data
					: Array.isArray(data.tests)
						? data.tests
						: [];

				const formatted = testsArray.map((t: any) => ({
					title: t.title,
					count: t.count || t.questions?.length || 0,
					completed: t.completed || 0,
					score: t.score || 0,
					average: t.average || 0,
				}));

				setTests(formatted);
			} catch (err) {
				console.error('Ошибка загрузки тестов:', err);
			} finally {
				setLoadingTests(false);
			}
		};

		fetchTests();
	}, []);

	const tabs: Tab[] = [
		{
			id: 'info',
			label: 'Головна інформація',
			content: <MainInfo />,
		},
		{
			id: 'tests',
			label: 'Тести',
			content: loadingTests ? (
				<div className='text-sm text-slate-400'>Завантаження...</div>
			) : (
				<Tests tests={tests} />
			),
		},
		{
			id: 'settings',
			label: 'Налаштування',
			content: <Settings />,
		},
	];

	return (
		<ProtectedRoute>
			<main className='min-h-[85vh] bg-white text-slate-900 selection:bg-indigo-100 px-6 py-10'>
				<div className='max-w-6xl mx-auto'>
					{/* Header */}
					<div className='mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
						<div className='flex items-center gap-4'>
							<div className='relative w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-lg'>
								{user?.full_name?.charAt(0).toUpperCase() || 'U'}
								{/* <div className='w-6 h-6 absolute flex items-center justify-center rounded-full bg-white border border-slate-300 -bottom-1 -right-1  hover:bg-indigo-100 transition'>
									<Camera size={14} className='text-indigo-600 ' />
									<input
										type='file'
										name='avatar'
										id='avatar'
										className='absolute w-6 h-6 top-0 left-0 cursor-pointer z-10 bg-transparent opacity-0'
									/>
								</div> */}
							</div>

							<div>
								<h1 className='text-xl font-semibold'>
									{user?.full_name || 'Користувач'}
								</h1>
								<p className='text-sm text-slate-500'>{user?.email}</p>
							</div>
						</div>

						<div className='flex gap-4 items-center'>
							<Link
								href={'/add-test'}
								className='bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-indigo-200 transition'
							>
								Створити тест
							</Link>
						</div>
					</div>

					{/* Tabs */}
					<div className='mb-6 border-b border-slate-200 flex gap-6'>
						{tabs.map(tab => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`pb-3 text-sm font-medium transition ${
									activeTab === tab.id
										? 'text-indigo-600 border-b-2 border-indigo-600'
										: 'text-slate-500 hover:text-slate-900'
								}`}
							>
								{tab.label}
							</button>
						))}
					</div>

					{/* Tab content */}
					<div className='mt-4'>
						{tabs.find(tab => tab.id === activeTab)?.content}
					</div>
				</div>
			</main>
		</ProtectedRoute>
	);
}
