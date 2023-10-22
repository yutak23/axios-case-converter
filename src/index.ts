import { AxiosStatic, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

export interface InterceptorIds {
	/**
	 * The interceptor id to eject the case converting of the request.
	 *
	 * @example
	 * ```ts
	 * axios.interceptors.request.eject(requestInterceptorId);
	 * ```
	 */
	requestInterceptorId: number;

	/**
	 * The interceptor id to eject the case converting of the response.
	 *
	 * @example
	 * ```ts
	 * axios.interceptors.response.eject(responseInterceptorId);
	 * ```
	 */
	responseInterceptorId: number;
}

export interface Options {
	/**
	 * Exclude keys from being snake-cased at request `params` and `data`.
	 */
	requestExcludeKeys?: ReadonlyArray<string | RegExp>;

	/**
	 * Exclude keys from being camle-cased at response `data`.
	 */
	responseExcludeKeys?: ReadonlyArray<string | RegExp>;
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
			if (options && options.requestExcludeKeys)
				snakecaseKeysOptions.exclude = options.requestExcludeKeys;

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
		(response: AxiosResponse): AxiosResponse => {
			const { data } = response;
			if (!data) return response;

			const camelcaseKeysOptions: CaseKeysOptions = { deep: true };
			if (options && options.responseExcludeKeys)
				camelcaseKeysOptions.exclude = options.responseExcludeKeys;

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
