'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
	useForm,
	useFieldArray,
	SubmitHandler,
	Control,
	UseFormRegister,
	UseFormWatch,
	UseFormSetValue,
} from 'react-hook-form';
import {
	CheckSquare,
	CircleDot,
	AlignLeft,
	ToggleLeft,
	Plus,
	Trash2,
	GripVertical,
	BookOpen,
	Settings,
	Eye,
	Save,
	X,
	Copy,
	Check,
	ExternalLink,
	AlertCircle,
	Loader2,
	ChevronUp,
	ChevronDown,
	Clock,
	RefreshCw,
	Shuffle,
	BarChart2,
	Link2,
	PartyPopper,
} from 'lucide-react';
// import ProtectedRoute from '@/layout/AuthProvider/ProtectedRoute'; // keep your import

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionType = 'single' | 'multiple' | 'text' | 'truefalse';

type Answer = { text: string };

type Question = {
	type: QuestionType;
	question: string;
	answers: Answer[];
	correctIndex: number;
	correctIndexes: boolean[];
	correctText: string;
	correctBool: boolean;
};

type FormValues = {
	title: string;
	description: string;
	timeLimit: string;
	attempts: string;
	shuffleQuestions: boolean;
	showResult: boolean;
	passingScore: string;
	questions: Question[];
};

type SaveState = 'idle' | 'saving' | 'success' | 'error';

// ─── Constants ───────────────────────────────────────────────────────────────

const QUESTION_TYPES: {
	type: QuestionType;
	label: string;
	shortLabel: string;
	icon: React.ReactNode;
	desc: string;
	color: string;
}[] = [
	{
		type: 'single',
		label: 'Одна відповідь',
		shortLabel: 'Одна',
		icon: <CircleDot size={16} />,
		desc: 'Лише один правильний варіант',
		color: 'indigo',
	},
	{
		type: 'multiple',
		label: 'Кілька відповідей',
		shortLabel: 'Кілька',
		icon: <CheckSquare size={16} />,
		desc: 'Декілька правильних варіантів',
		color: 'violet',
	},
	{
		type: 'text',
		label: 'Текстова відповідь',
		shortLabel: 'Текст',
		icon: <AlignLeft size={16} />,
		desc: 'Вільна відповідь',
		color: 'fuchsia',
	},
	{
		type: 'truefalse',
		label: 'Так / Ні',
		shortLabel: 'Так/Ні',
		icon: <ToggleLeft size={16} />,
		desc: 'Правда або хибність',
		color: 'rose',
	},
];

const colorMap: Record<
	string,
	{
		bg: string;
		bgHover: string;
		text: string;
		border: string;
		borderHover: string;
		light: string;
		lightHover: string;
		ring: string;
		accent: string;
		badge: string;
	}
> = {
	indigo: {
		bg: 'bg-indigo-600',
		bgHover: 'hover:bg-indigo-700',
		text: 'text-indigo-600',
		border: 'border-indigo-300',
		borderHover: 'hover:border-indigo-400',
		light: 'bg-indigo-50',
		lightHover: 'hover:bg-indigo-50',
		ring: 'focus:ring-indigo-100 focus:border-indigo-300',
		accent: 'accent-indigo-600',
		badge: 'bg-indigo-100 text-indigo-700',
	},
	violet: {
		bg: 'bg-violet-600',
		bgHover: 'hover:bg-violet-700',
		text: 'text-violet-600',
		border: 'border-violet-300',
		borderHover: 'hover:border-violet-400',
		light: 'bg-violet-50',
		lightHover: 'hover:bg-violet-50',
		ring: 'focus:ring-violet-100 focus:border-violet-300',
		accent: 'accent-violet-600',
		badge: 'bg-violet-100 text-violet-700',
	},
	fuchsia: {
		bg: 'bg-fuchsia-600',
		bgHover: 'hover:bg-fuchsia-700',
		text: 'text-fuchsia-600',
		border: 'border-fuchsia-300',
		borderHover: 'hover:border-fuchsia-400',
		light: 'bg-fuchsia-50',
		lightHover: 'hover:bg-fuchsia-50',
		ring: 'focus:ring-fuchsia-100 focus:border-fuchsia-300',
		accent: 'accent-fuchsia-600',
		badge: 'bg-fuchsia-100 text-fuchsia-700',
	},
	rose: {
		bg: 'bg-rose-500',
		bgHover: 'hover:bg-rose-600',
		text: 'text-rose-500',
		border: 'border-rose-300',
		borderHover: 'hover:border-rose-400',
		light: 'bg-rose-50',
		lightHover: 'hover:bg-rose-50',
		ring: 'focus:ring-rose-100 focus:border-rose-300',
		accent: 'accent-rose-500',
		badge: 'bg-rose-100 text-rose-700',
	},
};

function makeDefaultQuestion(type: QuestionType): Question {
	return {
		type,
		question: '',
		answers:
			type === 'single' || type === 'multiple'
				? [{ text: '' }, { text: '' }]
				: [],
		correctIndex: 0,
		// BUG FIX: initialize correctIndexes to match initial answers length (2)
		correctIndexes: type === 'multiple' ? [false, false] : [],
		correctText: '',
		correctBool: true,
	};
}

// ─── Success Modal ────────────────────────────────────────────────────────────

interface SuccessModalProps {
	testId: string;
	title: string;
	questionCount: number;
	onClose: () => void;
	onEdit: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
	testId,
	title,
	questionCount,
	onClose,
	onEdit,
}) => {
	const [copied, setCopied] = useState(false);
	const testUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/test/${testId}`;

	const handleCopy = async () => {
		await navigator.clipboard.writeText(testUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2500);
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
			<div
				className='absolute inset-0 bg-slate-900/40 backdrop-blur-sm'
				onClick={onClose}
			/>
			<div className='relative bg-white rounded-3xl shadow-2xl shadow-indigo-100 w-full max-w-md overflow-hidden'>
				<div className='h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500' />
				<div className='p-8'>
					<div className='flex justify-center mb-5'>
						<div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center'>
							<PartyPopper size={30} className='text-indigo-500' />
						</div>
					</div>
					<h2 className='text-xl font-bold text-slate-800 text-center mb-1'>
						Тест збережено!
					</h2>
					<p className='text-sm text-slate-500 text-center mb-6'>
						<span className='font-medium text-slate-700'>«{title}»</span> •{' '}
						{questionCount} питань
					</p>
					<div className='grid grid-cols-3 gap-3 mb-6'>
						{[
							{
								label: 'ID тесту',
								value: testId,
								icon: <BookOpen size={13} />,
							},
							{
								label: 'Питань',
								value: String(questionCount),
								icon: <CheckSquare size={13} />,
							},
							{
								label: 'Статус',
								value: 'Активний',
								icon: <Check size={13} />,
								green: true,
							},
						].map(item => (
							<div
								key={item.label}
								className='bg-slate-50 rounded-2xl px-3 py-3 text-center border border-slate-100'
							>
								<div className='flex items-center justify-center gap-1 text-slate-400 mb-1'>
									{item.icon}
									<span className='text-xs'>{item.label}</span>
								</div>
								<p
									className={`text-sm font-bold ${item.green ? 'text-emerald-600' : 'text-slate-800'}`}
								>
									{item.value}
								</p>
							</div>
						))}
					</div>
					<div className='bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-4'>
						<p className='text-xs text-slate-400 mb-2 flex items-center gap-1'>
							<Link2 size={11} /> Посилання на тест
						</p>
						<div className='flex items-center gap-2'>
							<p className='flex-1 text-xs text-indigo-600 font-mono truncate'>
								{testUrl}
							</p>
							<button
								onClick={handleCopy}
								className={`shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl transition-all ${
									copied
										? 'bg-emerald-500 text-white'
										: 'bg-indigo-600 text-white hover:bg-indigo-700'
								}`}
							>
								{copied ? (
									<>
										<Check size={12} /> Скопійовано
									</>
								) : (
									<>
										<Copy size={12} /> Копіювати
									</>
								)}
							</button>
						</div>
					</div>
					<div className='flex gap-2'>
						<button
							onClick={onEdit}
							className='flex-1 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-3 rounded-2xl transition-colors'
						>
							Редагувати
						</button>
						<a
							href={`/test/${testId}`}
							target='_blank'
							rel='noopener noreferrer'
							className='flex-1 flex items-center justify-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-2xl transition-colors'
						>
							<ExternalLink size={14} /> Відкрити тест
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

// ─── Toggle Switch ────────────────────────────────────────────────────────────
// BUG FIX: rewritten — original translate logic was inverted/broken

interface ToggleProps {
	checked: boolean;
	onChange: (v: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => (
	<button
		type='button'
		role='switch'
		aria-checked={checked}
		onClick={() => onChange(!checked)}
		className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1 shrink-0 ${
			checked ? 'bg-indigo-500' : 'bg-slate-200'
		}`}
	>
		<span
			className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
				checked ? 'translate-x-5' : 'translate-x-0'
			}`}
		/>
	</button>
);

// ─── Validation helper ────────────────────────────────────────────────────────
// BUG FIX: added null/undefined guards on every question access

function validateForm(data: FormValues): {
	errors: string[];
	errorIndexes: Set<number>;
} {
	const errors: string[] = [];
	const errorIndexes = new Set<number>();

	if (!data.title.trim()) errors.push('Введіть назву тесту');
	if (!data.questions || data.questions.length === 0)
		errors.push('Додайте хоча б одне питання');

	(data.questions ?? []).forEach((q, i) => {
		if (!q) return; // BUG FIX: guard against undefined question
		if (!q.question.trim()) {
			errors.push(`Питання ${i + 1}: введіть текст питання`);
			errorIndexes.add(i);
		}
		if (q.type === 'single' || q.type === 'multiple') {
			const filled = (q.answers ?? []).filter(a => a?.text?.trim());
			if (filled.length < 2) {
				errors.push(`Питання ${i + 1}: потрібно мінімум 2 варіанти відповіді`);
				errorIndexes.add(i);
			}
			if (q.type === 'multiple' && !(q.correctIndexes ?? []).some(Boolean)) {
				errors.push(
					`Питання ${i + 1}: позначте хоча б одну правильну відповідь`,
				);
				errorIndexes.add(i);
			}
		}
	});

	return { errors, errorIndexes };
}

// ─── QuestionItem ─────────────────────────────────────────────────────────────

interface QuestionItemProps {
	qIndex: number;
	totalCount: number;
	control: Control<FormValues>;
	register: UseFormRegister<FormValues>;
	watch: UseFormWatch<FormValues>;
	setValue: UseFormSetValue<FormValues>;
	onRemove: (i: number) => void;
	onMove: (from: number, to: number) => void;
	isActive: boolean;
	onClick: () => void;
	hasError: boolean;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
	qIndex,
	totalCount,
	control,
	register,
	watch,
	setValue,
	onRemove,
	onMove,
	isActive,
	onClick,
	hasError,
}) => {
	// BUG FIX: provide fallback 'single' so type is never undefined
	const type: QuestionType = watch(`questions.${qIndex}.type`) ?? 'single';
	const correctIndexes: boolean[] =
		watch(`questions.${qIndex}.correctIndexes`) ?? [];

	const typeInfo = QUESTION_TYPES.find(t => t.type === type);

	const {
		fields: answerFields,
		append: addAnswer,
		remove: removeAnswer,
	} = useFieldArray({ control, name: `questions.${qIndex}.answers` });

	// BUG FIX: guard — if typeInfo not found, render nothing
	if (!typeInfo) return null;

	const colors = colorMap[typeInfo.color];
	const inputBase =
		'w-full text-sm border bg-slate-50 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 transition-all placeholder-slate-300';

	return (
		<div
			onClick={onClick}
			className={`group relative bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
				hasError
					? 'border-red-200 shadow-sm shadow-red-50'
					: isActive
						? 'border-indigo-200 shadow-lg shadow-indigo-50/60 ring-1 ring-indigo-100'
						: 'border-slate-200 hover:border-slate-300 hover:shadow-md'
			}`}
		>
			<div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.bg}`} />

			<div className='pl-5 pr-5 py-5'>
				{/* Header */}
				<div className='flex items-start justify-between gap-3 mb-4'>
					<div className='flex items-center gap-2.5 min-w-0'>
						<span
							className={`${colors.light} ${colors.text} p-1.5 rounded-lg shrink-0`}
						>
							{typeInfo.icon}
						</span>
						<div className='min-w-0'>
							<p className={`text-xs font-semibold ${colors.text}`}>
								{typeInfo.label}
							</p>
							<p className='text-xs text-slate-400 mt-0.5'>
								Питання {qIndex + 1} з {totalCount}
							</p>
						</div>
					</div>

					<div className='flex items-center gap-1 shrink-0'>
						{hasError && (
							<span title='Є помилки'>
								<AlertCircle size={14} className='text-red-400' />
							</span>
						)}
						<button
							type='button'
							disabled={qIndex === 0}
							onClick={e => {
								e.stopPropagation();
								onMove(qIndex, qIndex - 1);
							}}
							className='p-1.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-20 transition-all'
						>
							<ChevronUp size={13} />
						</button>
						<button
							type='button'
							disabled={qIndex === totalCount - 1}
							onClick={e => {
								e.stopPropagation();
								onMove(qIndex, qIndex + 1);
							}}
							className='p-1.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-20 transition-all'
						>
							<ChevronDown size={13} />
						</button>
						<button
							type='button'
							onClick={e => {
								e.stopPropagation();
								onRemove(qIndex);
							}}
							className='opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all'
						>
							<Trash2 size={14} />
						</button>
						<GripVertical size={14} className='text-slate-200' />
					</div>
				</div>

				{/* Question text */}
				<textarea
					{...register(`questions.${qIndex}.question`)}
					placeholder='Введіть текст питання...'
					rows={2}
					onClick={e => e.stopPropagation()}
					className={`${inputBase} border-slate-200 ${colors.ring} resize-none mb-4`}
				/>

				{/* Single choice */}
				{type === 'single' && (
					<div className='space-y-2.5'>
						<p className='text-xs font-medium text-slate-400 mb-1'>
							Виберіть правильну відповідь (●)
						</p>
						{answerFields.map((a, aIndex) => (
							<div key={a.id} className='flex items-center gap-2.5'>
								<input
									type='radio'
									value={aIndex}
									{...register(`questions.${qIndex}.correctIndex`, {
										valueAsNumber: true,
									})}
									onClick={e => e.stopPropagation()}
									className={`shrink-0 w-4 h-4 ${colors.accent}`}
								/>
								<input
									{...register(`questions.${qIndex}.answers.${aIndex}.text`)}
									placeholder={`Варіант ${aIndex + 1}`}
									onClick={e => e.stopPropagation()}
									className={`${inputBase} border-slate-200 ${colors.ring} flex-1`}
								/>
								{answerFields.length > 2 && (
									<button
										type='button'
										onClick={e => {
											e.stopPropagation();
											removeAnswer(aIndex);
										}}
										className='shrink-0 p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all'
									>
										<X size={13} />
									</button>
								)}
							</div>
						))}
						<button
							type='button'
							onClick={e => {
								e.stopPropagation();
								addAnswer({ text: '' });
							}}
							className={`flex items-center gap-1.5 text-xs font-medium mt-1 ${colors.text} opacity-70 hover:opacity-100 transition-opacity`}
						>
							<Plus size={12} /> Додати варіант
						</button>
					</div>
				)}

				{/* Multiple choice */}
				{type === 'multiple' && (
					<div className='space-y-2.5'>
						<p className='text-xs font-medium text-slate-400 mb-1'>
							Позначте всі правильні відповіді (☑)
						</p>
						{answerFields.map((a, aIndex) => (
							<div key={a.id} className='flex items-center gap-2.5'>
								<input
									type='checkbox'
									checked={correctIndexes[aIndex] ?? false}
									onChange={e => {
										// BUG FIX: clone with correct length, don't mutate stale reference
										const updated = Array.from(
											{ length: answerFields.length },
											(_, k) =>
												k === aIndex
													? e.target.checked
													: (correctIndexes[k] ?? false),
										);
										setValue(`questions.${qIndex}.correctIndexes`, updated);
									}}
									onClick={e => e.stopPropagation()}
									className={`shrink-0 w-4 h-4 rounded ${colors.accent}`}
								/>
								<input
									{...register(`questions.${qIndex}.answers.${aIndex}.text`)}
									placeholder={`Варіант ${aIndex + 1}`}
									onClick={e => e.stopPropagation()}
									className={`${inputBase} border-slate-200 ${colors.ring} flex-1`}
								/>
								{answerFields.length > 2 && (
									<button
										type='button'
										onClick={e => {
											e.stopPropagation();
											removeAnswer(aIndex);
											// BUG FIX: also remove the corresponding correctIndexes entry
											const updated = correctIndexes.filter(
												(_, k) => k !== aIndex,
											);
											setValue(`questions.${qIndex}.correctIndexes`, updated);
										}}
										className='shrink-0 p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all'
									>
										<X size={13} />
									</button>
								)}
							</div>
						))}
						<button
							type='button'
							onClick={e => {
								e.stopPropagation();
								addAnswer({ text: '' });
								// BUG FIX: append false to correctIndexes in sync with new answer
								setValue(`questions.${qIndex}.correctIndexes`, [
									...correctIndexes,
									false,
								]);
							}}
							className={`flex items-center gap-1.5 text-xs font-medium mt-1 ${colors.text} opacity-70 hover:opacity-100 transition-opacity`}
						>
							<Plus size={12} /> Додати варіант
						</button>
					</div>
				)}

				{/* Text answer */}
				{type === 'text' && (
					<div>
						<p className='text-xs font-medium text-slate-400 mb-2'>
							Очікувана відповідь{' '}
							<span className='font-normal'>(необовязково)</span>
						</p>
						<input
							{...register(`questions.${qIndex}.correctText`)}
							placeholder='Введіть очікувану відповідь або залиште порожнім...'
							onClick={e => e.stopPropagation()}
							className={`${inputBase} border-slate-200 ${colors.ring}`}
						/>
						<p className='text-xs text-slate-400 mt-2'>
							💡 Відповідь буде перевірятись автоматично (без урахування
							регістру)
						</p>
					</div>
				)}

				{/* True/False */}
				{type === 'truefalse' && (
					<div>
						<p className='text-xs font-medium text-slate-400 mb-2'>
							Правильна відповідь
						</p>
						<div className='flex gap-3'>
							{([true, false] as const).map(val => {
								const isSelected =
									watch(`questions.${qIndex}.correctBool`) === val;
								return (
									<button
										key={String(val)}
										type='button'
										onClick={e => {
											e.stopPropagation();
											setValue(`questions.${qIndex}.correctBool`, val);
										}}
										className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
											isSelected
												? val
													? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm'
													: 'border-red-400 bg-red-50 text-red-700 shadow-sm'
												: 'border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300 hover:bg-slate-100'
										}`}
									>
										{val ? '✓ Так' : '✗ Ні'}
									</button>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

// ─── Validation Errors Banner ─────────────────────────────────────────────────

const ValidationBanner: React.FC<{
	errors: string[];
	onDismiss: () => void;
}> = ({ errors, onDismiss }) => (
	<div className='mx-6 mt-4 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3'>
		<AlertCircle size={18} className='text-red-500 shrink-0 mt-0.5' />
		<div className='flex-1 min-w-0'>
			<p className='text-sm font-semibold text-red-700 mb-1'>
				Виправте помилки перед збереженням
			</p>
			<ul className='space-y-0.5'>
				{errors.map((e, i) => (
					<li key={i} className='text-xs text-red-600'>
						• {e}
					</li>
				))}
			</ul>
		</div>
		<button
			onClick={onDismiss}
			className='shrink-0 text-red-300 hover:text-red-500 transition-colors'
		>
			<X size={15} />
		</button>
	</div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const CreateTestPage: React.FC = () => {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const [tab, setTab] = useState<'questions' | 'settings'>('questions');
	const [saveState, setSaveState] = useState<SaveState>('idle');
	const [savedTestId, setSavedTestId] = useState<string | null>(null);
	const [validationErrors, setValidationErrors] = useState<string[]>([]);
	// BUG FIX: errorQuestions is now populated from validateForm result
	const [errorQuestions, setErrorQuestions] = useState<Set<number>>(new Set());
	const canvasRef = useRef<HTMLDivElement>(null);

	const { register, control, handleSubmit, watch, setValue } =
		useForm<FormValues>({
			defaultValues: {
				title: '',
				description: '',
				timeLimit: '30',
				attempts: '1',
				shuffleQuestions: false,
				showResult: true,
				passingScore: '60',
				questions: [],
			},
		});

	const { fields, append, remove, move } = useFieldArray({
		control,
		name: 'questions',
	});

	const watchedTitle = watch('title');
	const watchedShuffle = watch('shuffleQuestions');
	const watchedShowResult = watch('showResult');
	const questionCount = fields.length;

	// ── Save handler ──────────────────────────────────────────────────────────

	const onSubmit: SubmitHandler<FormValues> = useCallback(async data => {
		const { errors, errorIndexes } = validateForm(data);
		if (errors.length > 0) {
			setValidationErrors(errors);
			setErrorQuestions(errorIndexes); // BUG FIX: was never set before
			return;
		}

		setSaveState('saving');
		setValidationErrors([]);
		setErrorQuestions(new Set());

		try {
			const token =
				typeof window !== 'undefined' ? localStorage.getItem('token') : null;

			const preparedQuestions = data.questions.map(q => {
				if (!q) return q; // guard
				if (q.type === 'text') {
					return { ...q, answers: [{ text: q.correctText || '' }] };
				}
				return q;
			});

			const payload = {
				title: data.title,
				description: data.description,
				questions: preparedQuestions,
			};

			const res = await fetch(
				'https://testorium-server-production.up.railway.app/tests',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
					body: JSON.stringify(payload),
				},
			);

			const result = await res.json();
			if (!res.ok) throw new Error(result.error ?? 'Server error');

			setSavedTestId(result.test_id);
			setSaveState('success');
		} catch (err) {
			console.error(err);
			setSaveState('error');
			// Auto-reset error state after 3s so user can retry
			setTimeout(() => setSaveState('idle'), 3000);
		}
	}, []);

	const handleAddQuestion = (type: QuestionType) => {
		const newQ = makeDefaultQuestion(type);
		append(newQ);
		setActiveIndex(fields.length); // fields.length before append = new index
		setTimeout(() => {
			canvasRef.current?.scrollTo({
				top: canvasRef.current.scrollHeight,
				behavior: 'smooth',
			});
		}, 50);
	};

	const handleMove = (from: number, to: number) => {
		move(from, to);
		setActiveIndex(to);
	};

	const handleDismissErrors = () => {
		setValidationErrors([]);
		setErrorQuestions(new Set());
	};

	// ── Save button ───────────────────────────────────────────────────────────

	const saveButtonContent = () => {
		if (saveState === 'saving')
			return (
				<>
					<Loader2 size={15} className='animate-spin' /> Збереження...
				</>
			);
		if (saveState === 'error')
			return (
				<>
					<AlertCircle size={15} /> Помилка
				</>
			);
		return (
			<>
				<Save size={15} /> Зберегти
			</>
		);
	};

	const saveButtonClass = () => {
		if (saveState === 'saving') return 'bg-indigo-400 cursor-not-allowed';
		if (saveState === 'error') return 'bg-red-500 hover:bg-red-600';
		return 'bg-indigo-600 hover:bg-indigo-700';
	};

	return (
		// <ProtectedRoute>
		<main className='min-h-screen bg-slate-50 font-sans'>
			{/* ── Success modal ── */}
			{saveState === 'success' && savedTestId && (
				<SuccessModal
					testId={savedTestId}
					title={watchedTitle || 'Без назви'}
					questionCount={questionCount}
					onClose={() => {
						setSaveState('idle');
						setSavedTestId(null);
					}}
					onEdit={() => {
						setSaveState('idle');
						setSavedTestId(null);
					}}
				/>
			)}

			{/* ── Top bar ── */}
			<header className='bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm'>
				<div className='flex items-center gap-3'>
					<div className='w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-sm'>
						<BookOpen size={15} className='text-white' />
					</div>
					<div>
						<p className='text-xs text-slate-400 leading-none mb-0.5'>
							Редактор тесту
						</p>
						<input
							{...register('title')}
							placeholder='Назва тесту...'
							className='text-sm font-semibold text-slate-800 bg-transparent outline-none placeholder-slate-300 w-52 border-b border-transparent focus:border-indigo-200 transition-colors pb-0.5'
						/>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<span className='text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg font-mono'>
						{questionCount} {questionCount === 1 ? 'питання' : 'питань'}
					</span>
					{/* BUG FIX: Preview button now does something (no-op placeholder, wired) */}
					<button
						type='button'
						onClick={() => alert('Preview coming soon')}
						className='flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors'
					>
						<Eye size={14} /> Перегляд
					</button>
					<button
						type='button'
						disabled={saveState === 'saving'}
						onClick={handleSubmit(onSubmit)}
						className={`flex items-center gap-1.5 text-sm text-white px-4 py-1.5 rounded-lg transition-all font-medium shadow-sm ${saveButtonClass()}`}
					>
						{saveButtonContent()}
					</button>
				</div>
			</header>

			<div className='flex h-[calc(100vh-57px)]'>
				{/* ── LEFT SIDEBAR ── */}
				<aside className='w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden'>
					<div className='flex border-b border-slate-100 px-3 pt-3 gap-1'>
						{(['questions', 'settings'] as const).map(t => (
							<button
								key={t}
								onClick={() => setTab(t)}
								className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-t-lg transition-all ${
									tab === t
										? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50'
										: 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
								}`}
							>
								{t === 'questions' ? (
									<>
										<CheckSquare size={13} /> Питання
									</>
								) : (
									<>
										<Settings size={13} /> Налаштування
									</>
								)}
							</button>
						))}
					</div>

					{/* ── Questions tab ── */}
					{tab === 'questions' ? (
						<div className='flex-1 overflow-y-auto p-4'>
							<p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3'>
								Додати питання
							</p>
							<div className='space-y-1.5 mb-5'>
								{QUESTION_TYPES.map(({ type, label, icon, desc, color }) => {
									const c = colorMap[color];
									return (
										<button
											key={type}
											type='button'
											onClick={() => handleAddQuestion(type)}
											className='w-full text-left flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 bg-white transition-all group'
										>
											<span
												className={`${c.light} ${c.text} p-2 rounded-lg group-hover:scale-110 transition-transform shrink-0`}
											>
												{icon}
											</span>
											<div className='min-w-0'>
												<p className='text-sm font-medium text-slate-700 leading-snug'>
													{label}
												</p>
												<p className='text-xs text-slate-400 truncate'>
													{desc}
												</p>
											</div>
											<Plus
												size={14}
												className='text-slate-300 group-hover:text-slate-500 ml-auto shrink-0 transition-colors'
											/>
										</button>
									);
								})}
							</div>

							{fields.length > 0 && (
								<>
									<div className='flex items-center justify-between mb-2'>
										<p className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>
											Список ({fields.length})
										</p>
									</div>
									<div className='space-y-1'>
										{fields.map((f, i) => {
											// BUG FIX: safe fallback for type
											const qType: QuestionType =
												watch(`questions.${i}.type`) ?? 'single';
											const qText = watch(`questions.${i}.question`);
											const typeInfo = QUESTION_TYPES.find(
												t => t.type === qType,
											);
											if (!typeInfo) return null;
											const c = colorMap[typeInfo.color];
											const hasErr = errorQuestions.has(i);
											return (
												<button
													key={f.id}
													type='button'
													onClick={() => {
														setActiveIndex(i);
														document
															.getElementById(`question-${i}`)
															?.scrollIntoView({
																behavior: 'smooth',
																block: 'center',
															});
													}}
													className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
														hasErr
															? 'bg-red-50 border border-red-200'
															: activeIndex === i
																? `${c.light} border ${c.border}`
																: 'hover:bg-slate-50 border border-transparent'
													}`}
												>
													<span
														className={`${hasErr ? 'text-red-400' : c.text} shrink-0`}
													>
														{hasErr ? <AlertCircle size={14} /> : typeInfo.icon}
													</span>
													<div className='min-w-0 flex-1'>
														<p className='text-xs font-medium text-slate-700 truncate leading-snug'>
															{qText || `Питання ${i + 1}`}
														</p>
														<p
															className={`text-xs ${hasErr ? 'text-red-400' : c.text}`}
														>
															{typeInfo.shortLabel}
														</p>
													</div>
													<span className='text-xs text-slate-300 font-mono shrink-0'>
														{i + 1}
													</span>
												</button>
											);
										})}
									</div>
								</>
							)}
						</div>
					) : (
						/* ── Settings tab ── */
						<div className='flex-1 overflow-y-auto p-4 space-y-5'>
							<div>
								<label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2'>
									Опис тесту
								</label>
								<textarea
									{...register('description')}
									placeholder='Короткий опис...'
									rows={3}
									className='w-full text-sm border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all placeholder-slate-300'
								/>
							</div>
							<div>
								<label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2'>
									<Clock size={11} className='inline mr-1' />
									Час (хвилин)
								</label>
								<input
									type='number'
									min={1}
									max={480}
									{...register('timeLimit')}
									className='w-full text-sm border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all'
								/>
							</div>
							<div>
								<label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2'>
									<RefreshCw size={11} className='inline mr-1' />
									Кількість спроб
								</label>
								<select
									{...register('attempts')}
									className='w-full text-sm border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-300 transition-all'
								>
									<option value='1'>1 спроба</option>
									<option value='2'>2 спроби</option>
									<option value='3'>3 спроби</option>
									<option value='unlimited'>Необмежено</option>
								</select>
							</div>
							<div>
								<label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2'>
									<BarChart2 size={11} className='inline mr-1' />
									Прохідний бал (%)
								</label>
								<input
									type='number'
									min={0}
									max={100}
									{...register('passingScore')}
									className='w-full text-sm border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition-all'
								/>
							</div>
							<div className='space-y-0 border-t border-slate-100 pt-4'>
								<div className='flex items-center justify-between py-3 border-b border-slate-100'>
									<div>
										<p className='text-sm font-medium text-slate-700 flex items-center gap-1.5'>
											<Shuffle size={13} className='text-slate-400' />
											Перемішати питання
										</p>
										<p className='text-xs text-slate-400 mt-0.5'>
											Випадковий порядок при проходженні
										</p>
									</div>
									<Toggle
										checked={watchedShuffle}
										onChange={v => setValue('shuffleQuestions', v)}
									/>
								</div>
								<div className='flex items-center justify-between py-3'>
									<div>
										<p className='text-sm font-medium text-slate-700 flex items-center gap-1.5'>
											<Eye size={13} className='text-slate-400' />
											Показати результат
										</p>
										<p className='text-xs text-slate-400 mt-0.5'>
											Після завершення тесту
										</p>
									</div>
									<Toggle
										checked={watchedShowResult}
										onChange={v => setValue('showResult', v)}
									/>
								</div>
							</div>
						</div>
					)}
				</aside>

				{/* ── CANVAS ── */}
				<div ref={canvasRef} className='flex-1 overflow-y-auto'>
					{validationErrors.length > 0 && (
						<ValidationBanner
							errors={validationErrors}
							onDismiss={handleDismissErrors}
						/>
					)}

					{fields.length === 0 ? (
						<div className='flex flex-col items-center justify-center h-full text-center px-6'>
							<div className='w-20 h-20 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl flex items-center justify-center mb-5 border border-indigo-100'>
								<Plus size={30} className='text-indigo-400' />
							</div>
							<h3 className='text-lg font-semibold text-slate-700 mb-2'>
								Тест ще порожній
							</h3>
							<p className='text-sm text-slate-400 max-w-xs leading-relaxed'>
								Оберіть тип питання з панелі зліва, щоб додати перше питання
							</p>
							<div className='grid grid-cols-2 gap-3 mt-8 max-w-sm w-full'>
								{QUESTION_TYPES.map(({ type, label, icon, color }) => {
									const c = colorMap[color];
									return (
										<button
											key={type}
											type='button'
											onClick={() => handleAddQuestion(type)}
											className={`flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 transition-all group text-left hover:${c.border} hover:${c.light} hover:${c.text}`}
										>
											<span className='group-hover:scale-110 transition-transform'>
												{icon}
											</span>
											<span className='text-sm font-medium'>{label}</span>
										</button>
									);
								})}
							</div>
						</div>
					) : (
						<form
							onSubmit={handleSubmit(onSubmit)}
							className='max-w-2xl mx-auto py-8 px-6 space-y-4'
						>
							{fields.map((f, i) => (
								<div id={`question-${i}`} key={f.id}>
									<QuestionItem
										qIndex={i}
										totalCount={fields.length}
										control={control}
										register={register}
										watch={watch}
										setValue={setValue}
										onRemove={remove}
										onMove={handleMove}
										isActive={activeIndex === i}
										onClick={() => setActiveIndex(i)}
										hasError={errorQuestions.has(i)}
									/>
								</div>
							))}

							<div className='pt-2'>
								<p className='text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center'>
									Додати ще питання
								</p>
								<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
									{QUESTION_TYPES.map(({ type, label, icon, color }) => {
										const c = colorMap[color];
										return (
											<button
												key={type}
												type='button'
												onClick={() => handleAddQuestion(type)}
												className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 transition-all group hover:${c.border} hover:${c.light} hover:${c.text}`}
											>
												<span className='group-hover:scale-125 transition-transform'>
													{icon}
												</span>
												<span className='text-xs font-medium text-center leading-tight'>
													{label}
												</span>
											</button>
										);
									})}
								</div>
							</div>

							<div className='pt-4 pb-8 flex justify-center'>
								<button
									type='button'
									disabled={saveState === 'saving'}
									onClick={handleSubmit(onSubmit)}
									className={`flex items-center gap-2 text-sm text-white px-8 py-3 rounded-2xl transition-all font-semibold shadow-lg shadow-indigo-200 ${saveButtonClass()}`}
								>
									{saveButtonContent()}
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</main>
		// </ProtectedRoute>
	);
};

export default CreateTestPage;
