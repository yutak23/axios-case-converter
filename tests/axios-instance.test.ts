import { describe, it, expect, expectTypeOf } from 'vitest';
import axios, { AxiosResponse } from 'axios';
import axiosCaseConverter, { InterceptorIds } from '../src/index.js';

describe('Test axiosCaseConverter with AxiosInstance', () => {
	describe('no options', () => {
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
