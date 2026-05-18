export interface TestProps {
	title: string;
	count: number;
	completed: number;
	score: string | number;
	average: string | number;
	estimatedTime?: number; // у хвилинах
	lastAttemptDate?: string; // напр. "12 трав 2025"
	rank?: string | number; // рейтинг серед учасників
}
