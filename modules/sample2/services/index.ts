import ApiService, { baseUrl } from '~/composables/fetch';
import type { UseFetchOptions } from '#app';

const ElectionGroupService = {
    getSampleApi: (options: UseFetchOptions = {}) => ApiService.get(`${baseUrl}/sample`, options),
};

export default ElectionGroupService;
