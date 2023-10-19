import { describe, it, expect, expectTypeOf, beforeAll, afterAll } from 'vitest';
import axios, { AxiosResponse } from 'axios';
import axiosCaseConverter, { InterceptorIds, Options } from '../index.js';

describe('Test axiosCaseConverter', () => {
	describe('AxiosStatic', () => {
		const data = { requestInterceptorId: 0, responseInterceptorId: 0 };

		beforeAll(() => {
			const interceptorIds: InterceptorIds = axiosCaseConverter(axios);
			data.requestInterceptorId = interceptorIds.requestInterceptorId;
			data.responseInterceptorId = interceptorIds.responseInterceptorId;
		});

		afterAll(() => {
			axios.interceptors.request.eject(data.requestInterceptorId);
			axios.interceptors.response.eject(data.responseInterceptorId);
		});

		it('request params and response body', async () => {
			await expect(
				axios.get('/api/some', {
					params: { id: 1, snakeCase: 'snake_case' },
					adapter: (config) => {
						expect(config.params).toEqual({ id: 1, snake_case: 'snake_case' });
						expect(config.data).toBeUndefined();

						return new Promise<AxiosResponse>((resolve) => {
							resolve({
								data: { code: 200, camel_case: 'camelCase' },
								status: 200,
								statusText: '',
								headers: {},
								config
							});
						});
					}
				})
			).resolves.toHaveProperty('data', { code: 200, camelCase: 'camelCase' });
		});

		it('request body and response body', async () => {
			await expect(
				axios.post(
					'/api/some',
					{ id: 1, snakeCase: 'snake_case' },
					{
						adapter: (config) => {
							expect(config.params).toBeUndefined();
							expect(config.data).toEqual('{"id":1,"snake_case":"snake_case"}');

							return new Promise<AxiosResponse>((resolve) => {
								resolve({
									data: { code: 200, camel_case: 'camelCase' },
									status: 200,
									statusText: '',
									headers: {},
									config
								});
							});
						}
					}
				)
			).resolves.toHaveProperty('data', { code: 200, camelCase: 'camelCase' });
		});

		it('request body and no response body', async () => {
			await expect(
				axios.delete('/api/some', {
					data: { id: 1, snakeCase: 'snake_case' },
					adapter: (config) => {
						expect(config.params).toBeUndefined();
						expect(config.data).toEqual('{"id":1,"snake_case":"snake_case"}');

						return new Promise<AxiosResponse>((resolve) => {
							resolve({
								data: '',
								status: 204,
								statusText: '',
								headers: {},
								config
							});
						});
					}
				})
			).resolves.toHaveProperty('data', '');
		});

		it('no request body and no response body', async () => {
			await expect(
				axios.delete('/api/some', {
					adapter: (config) => {
						expect(config.params).toBeUndefined();
						expect(config.data).toBeUndefined();

						return new Promise<AxiosResponse>((resolve) => {
							resolve({
								data: '',
								status: 204,
								statusText: '',
								headers: {},
								config
							});
						});
					}
				})
			).resolves.toHaveProperty('data', '');
		});
	});

	describe('AxiosStatic with options', () => {
		const data = { requestInterceptorId: 0, responseInterceptorId: 0 };

		beforeAll(() => {
			const options: Options = {
				requestConvertExclude: ['snakeCaseExclude'],
				responseConvertExclude: [/exclude$/]
			};
			const interceptorIds: InterceptorIds = axiosCaseConverter(axios, options);
			data.requestInterceptorId = interceptorIds.requestInterceptorId;
			data.responseInterceptorId = interceptorIds.responseInterceptorId;
		});

		afterAll(() => {
			axios.interceptors.request.eject(data.requestInterceptorId);
			axios.interceptors.response.eject(data.responseInterceptorId);
		});

		it('request params and response body', async () => {
			await expect(
				axios.get('/api/some', {
					params: { id: 1, snakeCase: 'snake_case', snakeCaseExclude: 'snake_case_exclude' },
					adapter: (config) => {
						expect(config.params).toEqual({
							id: 1,
							snake_case: 'snake_case',
							snakeCaseExclude: 'snake_case_exclude'
						});
						expect(config.data).toBeUndefined();

						return new Promise<AxiosResponse>((resolve) => {
							resolve({
								data: {
									code: 200,
									camel_case: 'camelCase',
									camel_case_exclude: 'camel_case_exclude'
								},
								status: 200,
								statusText: '',
								headers: {},
								config
							});
						});
					}
				})
			).resolves.toHaveProperty('data', {
				code: 200,
				camelCase: 'camelCase',
				camel_case_exclude: 'camel_case_exclude'
			});
		});

		it('request body and response body', async () => {
			await expect(
				axios.post(
					'/api/some',
					{ id: 1, snakeCase: 'snake_case', snakeCaseExclude: 'snake_case_exclude' },
					{
						adapter: (config) => {
							expect(config.params).toBeUndefined();
							expect(config.data).toEqual(
								'{"id":1,"snake_case":"snake_case","snakeCaseExclude":"snake_case_exclude"}'
							);

							return new Promise<AxiosResponse>((resolve) => {
								resolve({
									data: {
										code: 200,
										camel_case: 'camelCase',
										camel_case_exclude: 'camel_case_exclude'
									},
									status: 200,
									statusText: '',
									headers: {},
									config
								});
							});
						}
					}
				)
			).resolves.toHaveProperty('data', {
				code: 200,
				camelCase: 'camelCase',
				camel_case_exclude: 'camel_case_exclude'
			});
		});

		it('request body and no response body', async () => {
			await expect(
				axios.delete('/api/some', {
					data: { id: 1, snakeCase: 'snake_case', snakeCaseExclude: 'snake_case_exclude' },
					adapter: (config) => {
						expect(config.params).toBeUndefined();
						expect(config.data).toEqual(
							'{"id":1,"snake_case":"snake_case","snakeCaseExclude":"snake_case_exclude"}'
						);

						return new Promise<AxiosResponse>((resolve) => {
							resolve({
								data: '',
								status: 204,
								statusText: '',
								headers: {},
								config
							});
						});
					}
				})
			).resolves.toHaveProperty('data', '');
		});

		it('no request body and no response body', async () => {
			await expect(
				axios.delete('/api/some', {
					adapter: (config) => {
						expect(config.params).toBeUndefined();
						expect(config.data).toBeUndefined();

						return new Promise<AxiosResponse>((resolve) => {
							resolve({
								data: '',
								status: 204,
								statusText: '',
								headers: {},
								config
							});
						});
					}
				})
			).resolves.toHaveProperty('data', '');
		});
	});

	describe('AxiosInstance', () => {
		it('should return requestInterceptorId and responseInterceptorId', () => {
			const instance = axios.create();
			expectTypeOf(axiosCaseConverter(instance)).toEqualTypeOf<InterceptorIds>();
		});

		it('request params and response body', async () => {
			const instance = axios.create();
			axiosCaseConverter(instance);

			await expect(
				instance.get('/api/some', {
					params: { id: 1, snakeCase: 'snake_case' },
					adapter: (config) => {
						expect(config.params).toEqual({ id: 1, snake_case: 'snake_case' });

						return new Promise<AxiosResponse>((resolve) => {
							resolve({
								data: { code: 200, camel_case: 'camelCase' },
								status: 200,
								statusText: '',
								headers: {},
								config
							});
						});
					}
				})
			).resolves.toHaveProperty('data', { code: 200, camelCase: 'camelCase' });
		});

		it('request body and response body', async () => {
			const instance = axios.create();
			axiosCaseConverter(instance);

			await expect(
				instance.post(
					'/api/some',
					{ id: 1, snakeCase: 'snake_case' },
					{
						adapter: (config) => {
							expect(config.data).toEqual('{"id":1,"snake_case":"snake_case"}');

							return new Promise<AxiosResponse>((resolve) => {
								resolve({
									data: { code: 200, camel_case: 'camelCase' },
									status: 200,
									statusText: '',
									headers: {},
									config
								});
							});
						}
					}
				)
			).resolves.toHaveProperty('data', { code: 200, camelCase: 'camelCase' });
		});

		it('request body and no response body', async () => {
			const instance = axios.create();
			axiosCaseConverter(instance);

			await expect(
				instance.delete('/api/some', {
					data: { id: 1, snakeCase: 'snake_case' },
					adapter: (config) => {
						expect(config.params).toBeUndefined();
						expect(config.data).toEqual('{"id":1,"snake_case":"snake_case"}');

						return new Promise<AxiosResponse>((resolve) => {
							resolve({
								data: '',
								status: 204,
								statusText: '',
								headers: {},
								config
							});
						});
					}
				})
			).resolves.toHaveProperty('data', '');
		});

		it('no request body and no response body', async () => {
			const instance = axios.create();
			axiosCaseConverter(instance);

			await expect(
				instance.delete('/api/some', {
					adapter: (config) => {
						expect(config.params).toBeUndefined();
						expect(config.data).toBeUndefined();

						return new Promise<AxiosResponse>((resolve) => {
							resolve({
								data: '',
								status: 204,
								statusText: '',
								headers: {},
								config
							});
						});
					}
				})
			).resolves.toHaveProperty('data', '');
		});
	});
});
