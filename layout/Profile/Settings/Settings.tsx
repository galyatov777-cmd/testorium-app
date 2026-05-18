'use client';

import React from 'react';
import {
	useForm,
	SubmitHandler,
	UseFormRegister,
	FieldError,
} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/layout/AuthProvider/AuthProvider';

// ─── Schema ──────────────────────────────────────────────────────────────────

const schema = z.object({
	name: z.string().min(2, 'Мінімум 2 символи'),
	about: z.string().max(300, 'Максимум 300 символів').optional(),
	email: z.string().email('Невірний email'),
	university: z.string().min(2, 'Мінімум 2 символи'),
	role: z.string().min(2, 'Мінімум 2 символи'),
});

type FormValues = z.infer<typeof schema>;

// ─── Sub-components ───────────────────────────────────────────────────────────

type FieldProps = {
	label: string;
	name: keyof FormValues;
	register: UseFormRegister<FormValues>;
	error?: FieldError;
	type?: string;
};

const Field: React.FC<FieldProps> = ({
	label,
	name,
	register,
	error,
	type = 'text',
}) => (
	<div className='flex flex-col gap-1'>
		<label className='text-sm font-medium text-slate-600'>{label}</label>
		<input
			type={type}
			{...register(name)}
			className={`border rounded-lg px-3 py-2 text-sm outline-none transition
				focus:ring-2 focus:ring-indigo-200
				${error ? 'border-red-400' : 'border-slate-200 focus:border-indigo-400'}`}
		/>
		{error && <p className='text-xs text-red-500'>{error.message}</p>}
	</div>
);

const TextareaField: React.FC<FieldProps> = ({
	label,
	name,
	register,
	error,
}) => (
	<div className='flex flex-col gap-1'>
		<label className='text-sm font-medium text-slate-600'>{label}</label>
		<textarea
			{...register(name)}
			rows={4}
			className={`border rounded-lg px-3 py-2 text-sm outline-none transition resize-none
				focus:ring-2 focus:ring-indigo-200
				${error ? 'border-red-400' : 'border-slate-200 focus:border-indigo-400'}`}
		/>
		{error && <p className='text-xs text-red-500'>{error.message}</p>}
	</div>
);

// ─── Settings ─────────────────────────────────────────────────────────────────

const Settings: React.FC = () => {
	const { user, token, setAuthData } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: user?.full_name ?? '',
			about: user?.about ?? '',
			email: user?.email ?? '',
			university: user?.university ?? '',
			role: user?.role ?? '',
		},
	});

	const onSubmit: SubmitHandler<FormValues> = async data => {
		const res = await fetch('http://localhost:3003/users/me', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});

		const updatedUser = await res.json();

		if (!res.ok) {
			throw new Error(updatedUser.message || 'Помилка оновлення');
		}

		setAuthData(token!, updatedUser);
	};

	// react-hook-form сам ловит throw из onSubmit — используем errors.root
	const wrappedSubmit = handleSubmit(async data => {
		try {
			await onSubmit(data);
			// можно заменить alert на toast
			alert('Профіль оновлено ✅');
		} catch (err: any) {
			alert(err.message);
		}
	});

	return (
		<form onSubmit={wrappedSubmit} className='space-y-5 max-w-xl'>
			<Field label="Ім'я" name='name' register={register} error={errors.name} />
			<TextareaField
				label='Про себе'
				name='about'
				register={register}
				error={errors.about}
			/>
			<Field
				label='Email'
				name='email'
				type='email'
				register={register}
				error={errors.email}
			/>
			<Field
				label='Заклад'
				name='university'
				register={register}
				error={errors.university}
			/>
			<Field label='Роль' name='role' register={register} error={errors.role} />

			<button
				type='submit'
				disabled={isSubmitting || !isDirty}
				className='bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium
					hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
			>
				{isSubmitting ? 'Збереження...' : 'Зберегти зміни'}
			</button>
		</form>
	);
};

export default Settings;
