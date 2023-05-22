type APIConfiguration = {
  basepath?: string;
  enabled?: boolean;
};
type SurrogateKeys = {
  headers?: Record<string, string>;
  url?: string;
};
type Key = {
  disable_body?: boolean;
  disable_host?: boolean;
  disable_method?: boolean;
  disable_query?: boolean;
  headers?: ReadonlyArray<string>;
  hide?: boolean;
};

export type JsonSchema = {
  allowed_http_cache?: ReadonlyArray<string>;
  api?: {
    basepath?: string;
    prometheus?: APIConfiguration;
    souin?: APIConfiguration;
  };
  cache_keys?: Record<string, Key>;
  cache_name?: string;
  default_cache_control?: string;
  distributed?: boolean;
  regex?: { exclude: string };
  stale?: string;
  timeout?: {
    backend?: string;
    cache?: string;
  };
  ttl?: string;
  urls?: Record<string, { ttl?: string; default_cache_control?: string }>;
  ykeys?: Record<string, SurrogateKeys>;
  surrogate_keys?: Record<string, SurrogateKeys>;
};
