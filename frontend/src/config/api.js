const DEFAULT_DEV_API_URL = 'http://localhost:8000/api';

const API_BASE_URL = import.meta.env.VITE_API_URL
	?? (import.meta.env.DEV ? DEFAULT_DEV_API_URL : '/api');

export default API_BASE_URL;
