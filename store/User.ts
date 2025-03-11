interface ApiResponse<T> {
	status_code: number;
	message: string;
	data?: T;
}

interface User {
	id: string;
	role: string;
	email: string;
	name: string;
	address: string;
	image_url: string;
}