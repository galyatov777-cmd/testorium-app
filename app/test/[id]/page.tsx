'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
	CheckSquare,
	CircleDot,
	AlignLeft,
	ToggleLeft,
	ChevronRight,
	ChevronLeft,
	BookOpen,
	CheckCircle2,
	XCircle,
	Award,
	RotateCcw,
	Flag,
} from 'lucide-react';
import { useParams } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────────────────────────

type QuestionType = 'single' | 'multiple' | 'text' | 'truefalse';

type Answer = {
	id?: number;
	text: string;
};

type Question = {
	id: number;
	type: QuestionType;
	question: string;
	answers?: Answer[];
	correctIndex?: number;
	correctIndexes?: boolean[];
	correctText?: string;
	correctBool?: boolean;
};

type Test = {
	id: number;
	title: string;
	description: string;
	questions: Question[];
};

type UserAnswers = Record<number, number | boolean[] | string | boolean>;

// ─── Constants ───────────────────────────────────────────────────────────────

const colorMap: Record<
	QuestionType,
	{
		bg: string;
		text: string;
		light: string;
		border: string;
		icon: React.ReactNode;
	}
> = {
	single: {
		bg: 'bg-indigo-600',
		text: 'text-indigo-600',
		light: 'bg-indigo-50',
		border: 'border-indigo-200',
		icon: <CircleDot size={14} />,
	},
	multiple: {
		bg: 'bg-violet-600',
		text: 'text-violet-600',
		light: 'bg-violet-50',
		border: 'border-violet-200',
		icon: <CheckSquare size={14} />,
	},
	text: {
		bg: 'bg-fuchsia-600',
		text: 'text-fuchsia-600',
		light: 'bg-fuchsia-50',
		border: 'border-fuchsia-200',
		icon: <AlignLeft size={14} />,
	},
	truefalse: {
		bg: 'bg-pink-600',
		text: 'text-pink-600',
		light: 'bg-pink-50',
		border: 'border-pink-200',
		icon: <ToggleLeft size={14} />,
	},
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isCorrect(
	q: Question,
	answer: UserAnswers[number] | undefined,
): boolean {
	if (answer === undefined) return false;
	if (q.type === 'single') return answer === q.correctIndex;
	if (q.type === 'truefalse') return answer === q.correctBool;
	if (q.type === 'text')
		return (
			String(answer).trim().toLowerCase() ===
			String(q.correctText ?? '')
				.trim()
				.toLowerCase()
		);
	if (q.type === 'multiple') {
		const a = answer as boolean[];
		return (q.correctIndexes ?? []).every((v, i) => v === (a[i] ?? false));
	}
	return false;
}

function formatTime(s: number) {
	const m = Math.floor(s / 60);
	const sec = s % 60;
	return `${m}:${sec.toString().padStart(2, '0')}`;
}

// ─── Result Screen ────────────────────────────────────────────────────────────

const ResultScreen: React.FC<{
	questions: Question[];
	answers: UserAnswers;
	timeTaken: number;
	onRetry: () => void;
	test: Test;
}> = ({ questions, answers, timeTaken, onRetry, test }) => {
	const total = questions.length;
	const correctCount = questions.filter(q =>
		isCorrect(q, answers[q.id]),
	).length;
	const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

	const grade =
		pct >= 90
			? {
					label: 'Відмінно',
					color: 'text-emerald-600',
					bg: 'bg-emerald-50',
					border: 'border-emerald-200',
				}
			: pct >= 70
				? {
						label: 'Добре',
						color: 'text-indigo-600',
						bg: 'bg-indigo-50',
						border: 'border-indigo-200',
					}
				: pct >= 50
					? {
							label: 'Задовільно',
							color: 'text-amber-600',
							bg: 'bg-amber-50',
							border: 'border-amber-200',
						}
					: {
							label: 'Незадовільно',
							color: 'text-red-600',
							bg: 'bg-red-50',
							border: 'border-red-200',
						};

	return (
		<div className='min-h-screen bg-slate-50 flex flex-col'>
			<header className='bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3'>
				<div className='w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center'>
					<BookOpen size={16} className='text-white' />
				</div>
				<span className='text-sm font-semibold text-slate-700'>
					{test.title}
				</span>
			</header>

			<div className='flex-1 max-w-2xl mx-auto w-full px-6 py-10 space-y-6'>
				{/* Score card */}
				<div className='bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden'>
					<div className='bg-gradient-to-br from-indigo-50 to-violet-50 px-8 py-8 text-center border-b border-slate-100'>
						<div className='inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4'>
							<Award size={28} className='text-indigo-500' />
						</div>
						<br />
						<div
							className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border mb-3 ${grade.color} ${grade.bg} ${grade.border}`}
						>
							{grade.label}
						</div>
						<div className='text-6xl font-bold text-slate-900 mb-1'>{pct}%</div>
						<p className='text-slate-500 text-sm'>
							{correctCount} з {total} правильних відповідей
						</p>
					</div>
					<div className='grid grid-cols-3 divide-x divide-slate-100 px-2'>
						{[
							{
								label: 'Правильно',
								value: correctCount,
								color: 'text-emerald-600',
							},
							{
								label: 'Помилки',
								value: total - correctCount,
								color: 'text-red-500',
							},
							{
								label: 'Час',
								value: formatTime(timeTaken),
								color: 'text-indigo-600',
							},
						].map(({ label, value, color }) => (
							<div key={label} className='text-center py-4'>
								<p className={`text-xl font-bold ${color}`}>{value}</p>
								<p className='text-xs text-slate-400 mt-0.5'>{label}</p>
							</div>
						))}
					</div>
				</div>

				{/* Progress bar */}
				<div className='bg-white rounded-2xl border border-slate-200 p-5 shadow-sm'>
					<div className='flex justify-between text-xs text-slate-500 mb-2'>
						<span>Результат</span>
						<span>{pct}%</span>
					</div>
					<div className='h-3 bg-slate-100 rounded-full overflow-hidden'>
						<div
							className='h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000'
							style={{ width: `${pct}%` }}
						/>
					</div>
				</div>

				{/* Question review */}
				<div className='space-y-3'>
					<p className='text-xs font-semibold text-slate-400 uppercase tracking-wider px-1'>
						Розбір відповідей
					</p>
					{questions.map(q => {
						const ok = isCorrect(q, answers[q.id]);
						const c = colorMap[q.type];

						// BUG FIX: helpers to render answer text safely from Answer[] objects
						const renderUserAnswer = () => {
							const ans = answers[q.id];
							if (ans === undefined) return '—';
							if (q.type === 'single' && q.answers) {
								const idx = ans as number;
								return q.answers[idx]?.text ?? '—';
							}
							if (q.type === 'multiple' && q.answers) {
								// BUG FIX: was calling .join() on Answer objects → [object Object]
								const selected = q.answers
									.filter((_, i) => (ans as boolean[])?.[i])
									.map(a => a.text);
								return selected.length > 0 ? selected.join(', ') : '—';
							}
							if (q.type === 'truefalse') {
								return ans === true ? 'Так' : ans === false ? 'Ні' : '—';
							}
							if (q.type === 'text') return String(ans);
							return '—';
						};

						const renderCorrectAnswer = () => {
							if (q.type === 'single' && q.answers) {
								return q.answers[q.correctIndex!]?.text ?? '—';
							}
							if (q.type === 'multiple' && q.answers) {
								// BUG FIX: same object mapping issue
								return q.answers
									.filter((_, i) => q.correctIndexes?.[i])
									.map(a => a.text)
									.join(', ');
							}
							if (q.type === 'truefalse') return q.correctBool ? 'Так' : 'Ні';
							if (q.type === 'text') return q.correctText ?? '';
							return '—';
						};

						return (
							<div
								key={q.id}
								className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${ok ? 'border-slate-200' : 'border-red-100'}`}
							>
								<div className='flex items-start gap-3 p-4'>
									<div
										className={`shrink-0 mt-0.5 ${c.light} ${c.text} p-1.5 rounded-lg`}
									>
										{c.icon}
									</div>
									<div className='flex-1 min-w-0'>
										<p className='text-sm font-medium text-slate-800 mb-2 leading-snug'>
											{q.question}
										</p>
										<div
											className={`text-xs rounded-xl px-3 py-2 mb-1.5 ${ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}
										>
											<span className='font-semibold'>Ваша відповідь: </span>
											{renderUserAnswer()}
										</div>
										{!ok && (
											<div className='text-xs bg-emerald-50 text-emerald-700 rounded-xl px-3 py-2'>
												<span className='font-semibold'>
													Правильна відповідь:{' '}
												</span>
												{renderCorrectAnswer()}
											</div>
										)}
									</div>
									<div className='shrink-0'>
										{ok ? (
											<CheckCircle2 size={20} className='text-emerald-500' />
										) : (
											<XCircle size={20} className='text-red-400' />
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>

				<button
					onClick={onRetry}
					className='w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors'
				>
					<RotateCcw size={16} /> Пройти знову
				</button>
			</div>
		</div>
	);
};

// ─── Main Test Page ───────────────────────────────────────────────────────────

const TakeTestPage: React.FC = () => {
	const { id } = useParams();
	const [test, setTest] = useState<Test | null>(null);
	const [loading, setLoading] = useState(true);
	const [started, setStarted] = useState(false);
	const [current, setCurrent] = useState(0);
	const [answers, setAnswers] = useState<UserAnswers>({});
	const [finished, setFinished] = useState(false);
	const [timeTaken, setTimeTaken] = useState(0);
	const [flagged, setFlagged] = useState<Set<number>>(new Set());

	// BUG FIX: timer — was never started, timeTaken was always 0
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (started && !finished) {
			timerRef.current = setInterval(() => {
				setTimeTaken(s => s + 1);
			}, 1000);
		}
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [started, finished]);

	useEffect(() => {
		const fetchTest = async () => {
			try {
				const res = await fetch(
					`http://testorium-server-production.up.railway.app/tests/${id}`,
				);
				if (!res.ok) throw new Error('Failed to load test');
				const data = await res.json();
				setTest(data);
			} catch (err) {
				console.error('FETCH TEST ERROR:', err);
			} finally {
				setLoading(false);
			}
		};
		if (id) fetchTest();
	}, [id]);

	const handleFinish = useCallback(() => {
		if (timerRef.current) clearInterval(timerRef.current);
		setFinished(true);
	}, []);

	const handleRetry = () => {
		setStarted(false);
		setFinished(false);
		setCurrent(0);
		setAnswers({});
		setTimeTaken(0);
		setFlagged(new Set());
	};

	// ── Early returns for loading/missing data ──
	// BUG FIX: ALL derived variables (q, c, answered) moved BELOW early returns
	// so they never execute when data is undefined → fixes "Cannot read properties of undefined"

	if (loading) {
		return (
			<div className='min-h-screen bg-slate-50 flex items-center justify-center'>
				<div className='text-slate-400 text-sm'>Завантаження тесту...</div>
			</div>
		);
	}

	if (!test) {
		return (
			<div className='min-h-screen bg-slate-50 flex items-center justify-center'>
				<div className='text-slate-400 text-sm'>Тест не знайдено</div>
			</div>
		);
	}

	const questions = test.questions ?? [];

	if (finished) {
		return (
			<ResultScreen
				test={test}
				questions={questions}
				answers={answers}
				timeTaken={timeTaken}
				onRetry={handleRetry}
			/>
		);
	}

	// ── START SCREEN ──
	if (!started) {
		return (
			<div className='min-h-screen bg-slate-50 flex flex-col'>
				<header className='bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3'>
					<div className='w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center'>
						<BookOpen size={16} className='text-white' />
					</div>
					<span className='text-sm font-semibold text-slate-700'>
						Тестування
					</span>
				</header>
				<div className='flex-1 flex items-center justify-center px-6'>
					<div className='bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md w-full p-8 text-center'>
						<div className='w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5'>
							<BookOpen size={26} className='text-indigo-500' />
						</div>
						<h1 className='text-2xl font-bold text-slate-900 mb-2'>
							{test.title}
						</h1>
						<p className='text-slate-500 text-sm mb-6'>{test.description}</p>
						<div className='text-xs text-slate-400 mb-6'>
							{questions.length} питань
						</div>
						<button
							onClick={() => setStarted(true)}
							className='w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2'
						>
							Розпочати тест <ChevronRight size={16} />
						</button>
					</div>
				</div>
			</div>
		);
	}

	// BUG FIX: q and derived values only computed here, after all guards pass
	const q: Question | undefined = questions[current];

	// Guard: if somehow current is out of bounds
	if (!q) {
		return (
			<div className='min-h-screen bg-slate-50 flex items-center justify-center'>
				<div className='text-slate-400 text-sm'>Питання не знайдено</div>
			</div>
		);
	}

	const c = colorMap[q.type]; // safe — q is defined and q.type exists
	const answered = answers[q.id];
	const totalAnswered = questions.filter(
		q => answers[q.id] !== undefined,
	).length;

	const setAnswer = (val: UserAnswers[number]) => {
		setAnswers(prev => ({ ...prev, [q.id]: val }));
	};

	const toggleFlag = () => {
		setFlagged(prev => {
			const next = new Set(prev);
			next.has(q.id) ? next.delete(q.id) : next.add(q.id);
			return next;
		});
	};

	// ── TEST SCREEN ──
	return (
		<div className='min-h-screen bg-slate-50 flex flex-col'>
			<header className='bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20'>
				<div className='flex items-center gap-3'>
					<div className='w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center'>
						<BookOpen size={16} className='text-white' />
					</div>
					<span className='text-sm font-semibold text-slate-700'>
						{test.title}
					</span>
				</div>
				<div className='flex items-center gap-3'>
					{/* BUG FIX: show live timer */}
					<span className='text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg'>
						{formatTime(timeTaken)}
					</span>
					<button
						onClick={handleFinish}
						className='text-sm text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors font-medium'
					>
						Завершити
					</button>
				</div>
			</header>

			<div className='flex flex-1 h-[calc(100vh-57px)]'>
				{/* ── LEFT: Nav ── */}
				<aside className='w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden'>
					<div className='p-4 border-b border-slate-100'>
						<div className='flex justify-between text-xs text-slate-500 mb-2'>
							<span>Прогрес</span>
							<span>
								{totalAnswered}/{questions.length}
							</span>
						</div>
						<div className='h-2 bg-slate-100 rounded-full overflow-hidden'>
							<div
								className='h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500'
								style={{
									width: `${questions.length > 0 ? (totalAnswered / questions.length) * 100 : 0}%`,
								}}
							/>
						</div>
					</div>

					<div className='flex-1 overflow-y-auto p-3 space-y-1'>
						{questions.map((question, i) => {
							// BUG FIX: guard — question could be undefined in edge cases
							if (!question) return null;
							const isActive = i === current;
							const isAnswered = answers[question.id] !== undefined;
							const isFlagged = flagged.has(question.id);
							const qc = colorMap[question.type];
							return (
								<button
									key={question.id}
									onClick={() => setCurrent(i)}
									className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
										isActive
											? `${qc.light} ${qc.border} border`
											: 'hover:bg-slate-50 border border-transparent'
									}`}
								>
									<span
										className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
											isAnswered
												? 'bg-indigo-600 text-white'
												: 'bg-slate-100 text-slate-400'
										}`}
									>
										{i + 1}
									</span>
									<div className='flex-1 min-w-0'>
										<p className='text-xs font-medium text-slate-700 truncate leading-snug'>
											{question.question.length > 30
												? question.question.slice(0, 30) + '...'
												: question.question}
										</p>
										<span className={`text-xs ${qc.text}`}>{qc.icon}</span>
									</div>
									{isFlagged && (
										<Flag size={11} className='text-amber-400 shrink-0' />
									)}
								</button>
							);
						})}
					</div>
				</aside>

				{/* ── CANVAS ── */}
				<div className='flex-1 overflow-y-auto'>
					<div className='max-w-2xl mx-auto py-8 px-6'>
						<div className='bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden'>
							<div className={`h-1.5 w-full ${c.bg}`} />

							<div className='p-7'>
								{/* Question header */}
								<div className='flex items-start justify-between gap-4 mb-6'>
									<div className='flex items-center gap-2.5'>
										<span className={`${c.light} ${c.text} p-2 rounded-xl`}>
											{c.icon}
										</span>
										<p className='text-xs text-slate-400'>
											Питання {current + 1} з {questions.length}
										</p>
									</div>
									<button
										onClick={toggleFlag}
										className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
											flagged.has(q.id)
												? 'border-amber-300 bg-amber-50 text-amber-600'
												: 'border-slate-200 text-slate-400 hover:border-amber-200 hover:text-amber-500'
										}`}
									>
										<Flag size={12} />{' '}
										{flagged.has(q.id) ? 'Позначено' : 'Позначити'}
									</button>
								</div>

								<h2 className='text-lg font-semibold text-slate-900 leading-snug mb-7'>
									{q.question}
								</h2>

								{/* Single */}
								{q.type === 'single' && q.answers && (
									<div className='space-y-3'>
										{q.answers.map((a, i) => (
											<button
												key={i}
												onClick={() => setAnswer(i)}
												className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${
													answered === i
														? 'border-indigo-400 bg-indigo-50'
														: 'border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/40'
												}`}
											>
												<span
													className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
														answered === i
															? 'border-indigo-500 bg-indigo-500'
															: 'border-slate-300'
													}`}
												>
													{answered === i && (
														<span className='w-2 h-2 bg-white rounded-full' />
													)}
												</span>
												<span className='text-sm font-medium text-slate-700'>
													{a.text}
												</span>
											</button>
										))}
									</div>
								)}

								{/* Multiple */}
								{q.type === 'multiple' && q.answers && (
									<div className='space-y-3'>
										<p className='text-xs text-slate-400 mb-1'>
											Оберіть усі правильні варіанти
										</p>
										{q.answers.map((a, i) => {
											const checked =
												(answers[q.id] as boolean[])?.[i] ?? false;
											return (
												<button
													key={i}
													onClick={() => {
														const prev =
															(answers[q.id] as boolean[]) ??
															Array(q.answers!.length).fill(false);
														const next = [...prev];
														next[i] = !next[i];
														setAnswer(next);
													}}
													className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${
														checked
															? 'border-violet-400 bg-violet-50'
															: 'border-slate-200 hover:border-violet-200 hover:bg-violet-50/40'
													}`}
												>
													<span
														className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
															checked
																? 'border-violet-500 bg-violet-500'
																: 'border-slate-300'
														}`}
													>
														{checked && (
															<span className='text-white text-xs font-bold'>
																✓
															</span>
														)}
													</span>
													<span className='text-sm font-medium text-slate-700'>
														{a.text}
													</span>
												</button>
											);
										})}
									</div>
								)}

								{/* Text */}
								{q.type === 'text' && (
									<textarea
										value={String(answers[q.id] ?? '')}
										onChange={e => setAnswer(e.target.value)}
										placeholder='Введіть вашу відповідь...'
										rows={4}
										className='w-full text-sm text-slate-800 placeholder-slate-300 bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 resize-none focus:outline-none focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-50 transition-all'
									/>
								)}

								{/* True/False */}
								{q.type === 'truefalse' && (
									<div className='grid grid-cols-2 gap-4'>
										{([true, false] as const).map(val => (
											<button
												key={String(val)}
												onClick={() => setAnswer(val)}
												className={`py-5 rounded-2xl border-2 text-base font-semibold transition-all ${
													answered === val
														? val
															? 'border-emerald-400 bg-emerald-50 text-emerald-700'
															: 'border-red-400 bg-red-50 text-red-700'
														: 'border-slate-200 text-slate-400 hover:border-pink-200 hover:bg-pink-50/40'
												}`}
											>
												{val ? '✓ Так' : '✗ Ні'}
											</button>
										))}
									</div>
								)}
							</div>

							{/* Footer nav */}
							<div className='px-7 py-4 border-t border-slate-100 flex items-center justify-between'>
								<button
									onClick={() => setCurrent(p => Math.max(0, p - 1))}
									disabled={current === 0}
									className='flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2 rounded-xl hover:bg-slate-100'
								>
									<ChevronLeft size={16} /> Назад
								</button>

								<div className='flex gap-1.5'>
									{questions.map((_, i) => (
										<button
											key={i}
											onClick={() => setCurrent(i)}
											className={`h-2 rounded-full transition-all ${
												i === current
													? 'bg-indigo-600 w-4'
													: answers[questions[i]?.id] !== undefined
														? 'bg-indigo-300 w-2'
														: 'bg-slate-200 w-2'
											}`}
										/>
									))}
								</div>

								{current < questions.length - 1 ? (
									<button
										onClick={() => setCurrent(p => p + 1)}
										className='flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-xl hover:bg-indigo-50 transition-colors'
									>
										Далі <ChevronRight size={16} />
									</button>
								) : (
									<button
										onClick={handleFinish}
										className='flex items-center gap-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-colors'
									>
										Завершити <ChevronRight size={16} />
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TakeTestPage;
