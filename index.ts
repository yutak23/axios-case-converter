import { AxiosStatic, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

export interface InterceptorIds {
	requestInterceptorId: number;
	responseInterceptorId: number;
}

export interface Options {
	requestConvertExclude?: ReadonlyArray<string | RegExp>;
	responseConvertExclude?: ReadonlyArray<string | RegExp>;
}

interface CaseKeysOptions {
	deep: boolean;
	exclude?: ReadonlyArray<string | RegExp>;
}

const axiosCaseConverter = (
	axios: AxiosStatic | AxiosInstance,
	options?: Options
): InterceptorIds => {
	const requestInterceptorId = axios.interceptors.request.use(
		(request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
			const { data, params } = request;

			const snakecaseKeysOptions: CaseKeysOptions = { deep: true };
			if (options?.requestConvertExclude)
				snakecaseKeysOptions.exclude = options.requestConvertExclude;

			if (params)
				return {
					...request,
					params: snakecaseKeys(params, snakecaseKeysOptions)
				};
			if (!data) return request;

			return {
				...request,
				// config.data could be a string
				// https://github.com/axios/axios/blob/v1.5.1/lib/defaults/index.js#L57
				data: typeof data === 'string' ? data : snakecaseKeys(data, snakecaseKeysOptions)
			};
		},
		(e) => Promise.reject(e)
	);

	const responseInterceptorId = axios.interceptors.response.use(
		(response: AxiosResponse) => {
			const { data } = response;
			if (!data) return response;

			const camelcaseKeysOptions: CaseKeysOptions = { deep: true };
			if (options?.responseConvertExclude)
				camelcaseKeysOptions.exclude = options.responseConvertExclude;

			return {
				...response,
				data: camelcaseKeys(data, camelcaseKeysOptions)
			};
		},
		(e) => Promise.reject(e)
	);

	return { requestInterceptorId, responseInterceptorId };
};

export default axiosCaseConverter;
