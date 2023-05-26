import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  RawAxiosRequestHeaders,
} from 'axios';
import { APIPlatformSerializer } from 'serializers/api-platform';
import getConfig from 'next/config';
import { APIList, APIListResult, APISingleResult, GenericAPIObject } from 'model';
import { SerializerInterface } from 'serializers/interface';
import { Token } from 'storage';
import { ROUTES } from 'routes';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

interface EndpointInterface {
  endpoint?: string;
}

interface DepthLoaderInterface {
  depth?: number;
}

interface ConfigInterface {
  config?: AxiosRequestConfig;
}

const getHeaders = (): RawAxiosRequestHeaders => ({
  Accept: 'application/ld+json',
  'Content-Type': 'application/ld+json',
});

export abstract class API {
  endpoint = '';
  filter = {};
  pagination = {};

  constructor({
    filter = {},
    pagination = {},
  }: { filter?: Record<string, string>; pagination?: { page?: number } } = {}) {
    this.filter = filter;
    this.pagination = pagination;
  }

  getBaseUrl = (): string => '';

  request(config?: CreateAxiosDefaults): AxiosInstance {
    const instance = axios.create({
      baseURL: this.getBaseUrl(),
      headers: {
        ...getHeaders(),
        ...(config?.headers ?? {}),
      },
      ...(config ?? {}),
    });
    instance.interceptors.request.use((r) => {
      const token = new Token().get();
      if (token) {
        r.headers['Authorization'] = `Bearer ${token}`;
      }
      return r;
    });
    instance.interceptors.response.use(
      (r) => r,
      (r) => {
        if (401 === r.response.status) {
          new Token().delete();
          if (typeof window !== 'undefined') {
            window.location.pathname = ROUTES.SIGN_IN;
          }
        }
        return Promise.reject(r);
      }
    );

    return instance;
  }

  async deleteRequest({ endpoint }: EndpointInterface = {}): Promise<AxiosResponse> {
    return this.request().delete(`${this.endpoint}${endpoint || ''}`);
  }

  async getRequest({ config, endpoint = '' }: ConfigInterface & EndpointInterface = {}): Promise<AxiosResponse> {
    return this.request(config).get(
      `${this.endpoint}${endpoint}?${
        new URLSearchParams({
          ...this.pagination,
          ...this.filter,
        }).toString() || ''
      }`
    );
  }

  async patchRequest({ data, endpoint = '' }: AxiosRequestConfig & EndpointInterface = {}): Promise<AxiosResponse> {
    return this.request().patch(`${this.endpoint}${endpoint}`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
    });
  }

  async postRequest({
    config = {},
    data,
    endpoint = '',
  }: AxiosRequestConfig & EndpointInterface & ConfigInterface = {}): Promise<AxiosResponse> {
    return this.request().post(`${this.endpoint}${endpoint}`, data, config);
  }

  async putRequest({ data, endpoint }: AxiosRequestConfig & EndpointInterface = {}): Promise<AxiosResponse> {
    return this.request().put(`${this.endpoint}${endpoint || ''}`, JSON.stringify(data));
  }
}

export class APIPlatform<T extends APISingleResult, U extends GenericAPIObject<T>> extends API {
  protected serializer: SerializerInterface<T> = new APIPlatformSerializer();

  getBaseUrl = (): string => serverRuntimeConfig.API_URL || publicRuntimeConfig.API_URL;

  getMany({ config, depth }: DepthLoaderInterface & ConfigInterface = {}): Promise<APIList<T>> {
    return this.getRequest({ config })
      .then(({ data }: { data: APIListResult<T> }) => data)
      .then((data) => {
        return {
          items: this.serializer.serializeMany(data['hydra:member'], depth),
          total: data['hydra:totalItems'],
        } as APIList<T>;
      });
  }

  create(data: U) {
    return this.postRequest({ data }).then(({ data: v }) => this.serializer.serialize(v));
  }

  getOne({ config, depth, id }: DepthLoaderInterface & ConfigInterface & T) {
    return this.getRequest({ config, endpoint: `/${id}` })
      .then(({ data: v }) => this.serializer.serialize(v, depth))
      .catch(console.warn);
  }

  /*
  update({ id }: APIPlatformSingleInterface) {
    return this.patchRequest({ endpoint: id }).then().catch(console.warn);
  }

  delete({ id }: APIPlatformSingleInterface) {
    return this.deleteRequest({ endpoint: id }).then().catch(console.warn);
  }
  */
}
