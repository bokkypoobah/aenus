/**
  * villus v1.0.1
  * (c) 2021 Abdelrahman Awad
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue'), require('graphql')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue', 'graphql'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Villus = {}, global.Vue, global.graphql));
}(this, (function (exports, vue, graphql) { 'use strict';

  function toWatchableSource(value) {
      if (vue.isRef(value)) {
          return value;
      }
      if (vue.isReactive(value)) {
          const refs = vue.toRefs(value);
          return Object.keys(refs).map(refKey => refs[refKey]);
      }
      throw new Error('value is not reactive');
  }
  // Uses same component provide as its own injections
  // Due to changes in https://github.com/vuejs/vue-next/pull/2424
  function injectWithSelf(symbol, onMissing) {
      var _a;
      const vm = vue.getCurrentInstance();
      const injection = vue.inject(symbol, (_a = vm === null || vm === void 0 ? void 0 : vm.provides) === null || _a === void 0 ? void 0 : _a[symbol]);
      if (injection === null || injection === undefined) {
          throw onMissing();
      }
      return injection;
  }

  // https://github.com/FormidableLabs/urql/blob/master/src/utils/error.ts
  const generateErrorMessage = (networkError, graphqlErrors) => {
      let error = '';
      if (networkError !== undefined) {
          return (error = `[Network] ${networkError.message}`);
      }
      if (graphqlErrors !== undefined) {
          graphqlErrors.forEach(err => {
              error += `[GraphQL] ${err.message}\n`;
          });
      }
      return error.trim();
  };
  function normalizeGqlError(error) {
      if (typeof error === 'string') {
          return new graphql.GraphQLError(error);
      }
      if (typeof error === 'object' && error.message) {
          return new graphql.GraphQLError(error.message, error.nodes, error.source, error.positions, error.path, error, error.extensions || {});
      }
      return error;
  }
  class CombinedError extends Error {
      constructor({ response, networkError, graphqlErrors, }) {
          const gqlErrors = graphqlErrors === null || graphqlErrors === void 0 ? void 0 : graphqlErrors.map(normalizeGqlError);
          const message = generateErrorMessage(networkError, gqlErrors);
          super(message);
          this.name = 'CombinedError';
          this.response = response;
          this.message = message;
          this.networkError = networkError;
          this.graphqlErrors = gqlErrors;
      }
      get isGraphQLError() {
          return !!(this.graphqlErrors && this.graphqlErrors.length);
      }
      toString() {
          return this.message;
      }
  }

  var fastJsonStableStringify = function (data, opts) {
      if (!opts) opts = {};
      if (typeof opts === 'function') opts = { cmp: opts };
      var cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false;

      var cmp = opts.cmp && (function (f) {
          return function (node) {
              return function (a, b) {
                  var aobj = { key: a, value: node[a] };
                  var bobj = { key: b, value: node[b] };
                  return f(aobj, bobj);
              };
          };
      })(opts.cmp);

      var seen = [];
      return (function stringify (node) {
          if (node && node.toJSON && typeof node.toJSON === 'function') {
              node = node.toJSON();
          }

          if (node === undefined) return;
          if (typeof node == 'number') return isFinite(node) ? '' + node : 'null';
          if (typeof node !== 'object') return JSON.stringify(node);

          var i, out;
          if (Array.isArray(node)) {
              out = '[';
              for (i = 0; i < node.length; i++) {
                  if (i) out += ',';
                  out += stringify(node[i]) || 'null';
              }
              return out + ']';
          }

          if (node === null) return 'null';

          if (seen.indexOf(node) !== -1) {
              if (cycles) return JSON.stringify('__cycle__');
              throw new TypeError('Converting circular structure to JSON');
          }

          var seenIndex = seen.push(node) - 1;
          var keys = Object.keys(node).sort(cmp && cmp(node));
          out = '';
          for (i = 0; i < keys.length; i++) {
              var key = keys[i];
              var value = stringify(node[key]);

              if (!value) continue;
              if (out) out += ',';
              out += JSON.stringify(key) + ':' + value;
          }
          seen.splice(seenIndex, 1);
          return '{' + out + '}';
      })(data);
  };

  /**
   * Normalizes a query string or object to a string.
   */
  function normalizeQuery(query) {
      if (typeof query === 'string') {
          return query;
      }
      if (query && query.kind) {
          return graphql.print(query);
      }
      return null;
  }

  async function parseResponse(response) {
      let json;
      const responseData = {
          ok: response.ok,
          statusText: response.statusText,
          status: response.status,
          headers: response.headers,
      };
      try {
          json = await response.json();
      }
      catch (err) {
          return Object.assign(Object.assign({}, responseData), { statusText: err.message, body: null });
      }
      return Object.assign(Object.assign({}, responseData), { body: json });
  }
  function resolveGlobalFetch() {
      if (typeof window !== 'undefined' && 'fetch' in window && window.fetch) {
          return window.fetch.bind(window);
      }
      if (typeof global !== 'undefined' && 'fetch' in global) {
          return global.fetch;
      }
      return undefined;
  }
  const DEFAULT_FETCH_OPTS = {
      method: 'POST',
      headers: {
          'content-type': 'application/json',
      },
  };
  function mergeFetchOpts(lhs, rhs) {
      return Object.assign(Object.assign(Object.assign({}, lhs), rhs), { method: rhs.method || lhs.method || DEFAULT_FETCH_OPTS.method, headers: Object.assign(Object.assign({}, (lhs.headers || {})), (rhs.headers || {})) });
  }
  function makeFetchOptions({ query, variables }, opts) {
      const normalizedQuery = normalizeQuery(query);
      if (!normalizedQuery) {
          throw new Error('A query must be provided.');
      }
      return mergeFetchOpts({ body: JSON.stringify({ query: normalizedQuery, variables }) }, opts);
  }

  function hash(x) {
      let h, i, l;
      for (h = 5381 | 0, i = 0, l = x.length | 0; i < l; i++) {
          h = (h << 5) + h + x.charCodeAt(i);
      }
      return h >>> 0;
  }
  function getQueryKey(operation, ...components) {
      const variables = operation.variables ? fastJsonStableStringify(operation.variables) : '';
      const query = normalizeQuery(operation.query);
      return hash(`${query}${variables}${components.join('')}`);
  }

  function normalizeChildren(context, slotProps) {
      if (!context.slots.default) {
          return [];
      }
      return context.slots.default(slotProps) || [];
  }

  function cache() {
      const resultCache = {};
      function setCacheResult({ key }, result) {
          resultCache[key] = result;
      }
      function getCachedResult({ key }) {
          return resultCache[key];
      }
      return function cachePlugin({ afterQuery, useResult, operation }) {
          if (operation.type !== 'query' || operation.cachePolicy === 'network-only') {
              return;
          }
          // Set the cache result after query is resolved
          afterQuery(result => {
              setCacheResult(operation, result);
          });
          // Get cached item
          const cachedResult = getCachedResult(operation);
          if (operation.cachePolicy === 'cache-only') {
              return useResult(cachedResult || { data: null, error: null }, true);
          }
          // if exists in cache, terminate with result
          if (cachedResult) {
              return useResult(cachedResult, operation.cachePolicy === 'cache-first');
          }
      };
  }

  function fetch(opts) {
      const fetch = (opts === null || opts === void 0 ? void 0 : opts.fetch) || resolveGlobalFetch();
      if (!fetch) {
          throw new Error('Could not resolve a fetch() method, you should provide one.');
      }
      return async function fetchPlugin(ctx) {
          var _a, _b;
          const { useResult, opContext, operation } = ctx;
          const fetchOpts = makeFetchOptions(operation, opContext);
          let response;
          try {
              response = await fetch(opContext.url, fetchOpts).then(parseResponse);
          }
          catch (err) {
              return useResult({
                  data: null,
                  error: new CombinedError({ response, networkError: err }),
              }, true);
          }
          // Set the response on the context
          ctx.response = response;
          const data = (_a = response.body) === null || _a === void 0 ? void 0 : _a.data;
          if (!response.ok || !response.body) {
              // It is possible than a non-200 response is returned with errors, it should be treated as GraphQL error
              const ctorOptions = {
                  response,
              };
              if ((_b = response.body) === null || _b === void 0 ? void 0 : _b.errors) {
                  ctorOptions.graphqlErrors = response.body.errors;
              }
              else {
                  ctorOptions.networkError = new Error(response.statusText);
              }
              return useResult({
                  data,
                  error: new CombinedError(ctorOptions),
              }, true);
          }
          useResult({
              data,
              error: response.body.errors
                  ? new CombinedError({ response: response, graphqlErrors: response.body.errors })
                  : null,
          }, true);
      };
  }

  function dedup() {
      // Holds references to pending operations
      const pendingLookup = {};
      return function dedupPlugin(ctx) {
          // Don't dedup mutations or subscriptions
          if (ctx.operation.type !== 'query') {
              return;
          }
          // extract the original useResult function
          const { useResult } = ctx;
          // Clean up pending queries after they are resolved
          ctx.afterQuery(() => {
              delete pendingLookup[ctx.operation.key];
          });
          // If pending, re-route the result to it
          if (pendingLookup[ctx.operation.key]) {
              return pendingLookup[ctx.operation.key].then(result => {
                  useResult(result, true);
              });
          }
          // Hold a resolve fn reference
          let resolveOp;
          // Create a pending operation promise and add it to lookup
          pendingLookup[ctx.operation.key] = new Promise(resolve => {
              resolveOp = resolve;
          });
          // resolve the promise once the result are set via another plugin
          ctx.useResult = function (...args) {
              useResult(...args);
              resolveOp(args[0]);
          };
      };
  }

  const VILLUS_CLIENT = Symbol('villus.client');

  const defaultPlugins = () => [cache(), dedup(), fetch()];
  class Client {
      constructor(opts) {
          this.install = () => undefined;
          this.url = opts.url;
          this.defaultCachePolicy = opts.cachePolicy || 'cache-first';
          this.plugins = opts.use || [...defaultPlugins()];
      }
      /**
       * Executes an operation and returns a normalized response.
       */
      async execute(operation, type, queryContext, onResultChanged) {
          let result;
          const opContext = Object.assign(Object.assign({ url: this.url }, DEFAULT_FETCH_OPTS), { headers: Object.assign(Object.assign({}, DEFAULT_FETCH_OPTS.headers), ((queryContext === null || queryContext === void 0 ? void 0 : queryContext.headers) || {})) });
          let terminateSignal = false;
          const afterQuery = [];
          const context = {
              useResult(pluginResult, terminate) {
                  if (terminate) {
                      terminateSignal = true;
                  }
                  // this means the `useResult` was called multiple times
                  if (result) {
                      onResultChanged === null || onResultChanged === void 0 ? void 0 : onResultChanged(pluginResult);
                  }
                  result = pluginResult;
              },
              afterQuery(cb) {
                  afterQuery.push(cb);
              },
              operation: Object.assign(Object.assign({}, operation), { key: getQueryKey(operation), type, cachePolicy: ('cachePolicy' in operation ? operation.cachePolicy : this.defaultCachePolicy) || this.defaultCachePolicy }),
              opContext,
          };
          let lastI = 0;
          for (let i = 0; i < this.plugins.length; i++) {
              const plugin = this.plugins[i];
              await plugin(context);
              if (result) {
                  lastI = i;
                  break;
              }
          }
          return new Promise((resolve, reject) => {
              if (!result) {
                  reject(new Error('Operation result was not set by any plugin, make sure you have default plugins configured or review documentation'));
                  return;
              }
              resolve(result);
              (async () => {
                  if (!terminateSignal) {
                      for (let i = lastI + 1; i < this.plugins.length; i++) {
                          const plugin = this.plugins[i];
                          await plugin(context);
                      }
                  }
                  const afterQueryCtx = { response: context.response };
                  for (let i = 0; i < afterQuery.length; i++) {
                      const afterCb = afterQuery[i];
                      await afterCb(result, afterQueryCtx);
                  }
              })();
          });
      }
      async executeQuery(operation, queryContext, onResultChanged) {
          return this.execute(operation, 'query', queryContext, onResultChanged);
      }
      async executeMutation(operation, queryContext) {
          return this.execute(operation, 'mutation', queryContext);
      }
      async executeSubscription(operation) {
          const result = await this.execute(operation, 'subscription');
          return result;
      }
  }
  function createClient(opts) {
      const client = new Client(opts);
      client.install = (app) => app.provide(VILLUS_CLIENT, client);
      return client;
  }

  function useClient(opts) {
      const client = createClient(opts);
      vue.provide(VILLUS_CLIENT, client);
      return client;
  }

  const Provider = vue.defineComponent({
      name: 'VillusClientProvider',
      props: {
          url: {
              type: String,
              required: true,
          },
          cachePolicy: {
              type: String,
              default: '',
          },
          use: {
              type: Array,
              default: undefined,
          },
      },
      setup(props, ctx) {
          useClient({
              url: props.url,
              cachePolicy: props.cachePolicy,
              use: props.use,
          });
          return () => {
              return normalizeChildren(ctx, {});
          };
      },
  });
  function withProvider(component, clientOpts) {
      return vue.defineComponent({
          name: 'VillusWithClientHoc',
          setup(props, ctx) {
              useClient(clientOpts);
              return () => {
                  return vue.h(component, Object.assign(Object.assign({}, props), ctx.attrs), ctx.slots);
              };
          },
      });
  }

  function useQuery(opts) {
      const client = injectWithSelf(VILLUS_CLIENT, () => {
          return new Error('Cannot detect villus Client, did you forget to call `useClient`?');
      });
      let { query, variables, cachePolicy, fetchOnMount } = normalizeOptions(opts);
      const data = vue.ref(null);
      const isFetching = vue.ref(fetchOnMount !== null && fetchOnMount !== void 0 ? fetchOnMount : false);
      const isDone = vue.ref(false);
      const error = vue.ref(null);
      // This is to prevent state mutation for racing requests, basically favoring the very last one
      let lastPendingOperation;
      function onResultChanged(result) {
          data.value = result.data;
          error.value = result.error;
      }
      async function execute(overrideOpts) {
          isFetching.value = true;
          const vars = (vue.isRef(variables) ? variables.value : variables) || {};
          const pendingExecution = client.executeQuery({
              query: vue.isRef(query) ? query.value : query,
              variables: (overrideOpts === null || overrideOpts === void 0 ? void 0 : overrideOpts.variables) || vars,
              cachePolicy: (overrideOpts === null || overrideOpts === void 0 ? void 0 : overrideOpts.cachePolicy) || cachePolicy,
          }, vue.unref(opts === null || opts === void 0 ? void 0 : opts.context), onResultChanged);
          lastPendingOperation = pendingExecution;
          const res = await pendingExecution;
          // Avoid state mutation if the pendingExecution isn't the last pending operation
          if (pendingExecution !== lastPendingOperation) {
              // we still return this result to preserve the integrity of "execute" calls
              return { data: res.data, error: res.error };
          }
          onResultChanged(res);
          isDone.value = true;
          isFetching.value = false;
          lastPendingOperation = undefined;
          return { data: data.value, error: error.value };
      }
      if (vue.isRef(query)) {
          vue.watch(query, () => execute());
      }
      let stopVarsWatcher;
      const isWatchingVariables = vue.ref(true);
      function beginWatchingVars() {
          let oldCache;
          if ((!vue.isRef(variables) && !vue.isReactive(variables)) || !variables) {
              return;
          }
          const watchableVars = toWatchableSource(variables);
          isWatchingVariables.value = true;
          stopVarsWatcher = vue.watch(watchableVars, newValue => {
              const id = hash(fastJsonStableStringify(newValue));
              // prevents duplicate queries.
              if (id === oldCache) {
                  return;
              }
              oldCache = id;
              execute();
          }, { deep: true });
      }
      function unwatchVariables() {
          if (!isWatchingVariables.value)
              return;
          stopVarsWatcher();
          isWatchingVariables.value = false;
      }
      function watchVariables() {
          if (isWatchingVariables.value)
              return;
          beginWatchingVars();
      }
      beginWatchingVars();
      const api = { data, isFetching, isDone, error, execute, unwatchVariables, watchVariables, isWatchingVariables };
      vue.onMounted(() => {
          if (fetchOnMount) {
              execute();
          }
      });
      return Object.assign(Object.assign({}, api), { async then(onFulfilled) {
              fetchOnMount = false;
              await api.execute();
              return onFulfilled(api);
          } });
  }
  function normalizeOptions(opts) {
      const defaultOpts = {
          variables: {},
          fetchOnMount: true,
      };
      return Object.assign(Object.assign(Object.assign({}, defaultOpts), opts), { query: opts.query });
  }

  const QueryImpl = vue.defineComponent({
      name: 'Query',
      props: {
          query: {
              type: [String, Object],
              required: true,
          },
          variables: {
              type: Object,
              default: null,
          },
          cachePolicy: {
              type: String,
              default: undefined,
          },
          watchVariables: {
              type: Boolean,
              default: true,
          },
          suspended: {
              type: Boolean,
              default: false,
          },
          fetchOnMount: {
              type: Boolean,
              default: true,
          },
      },
      setup(props, ctx) {
          function createRenderFn(api) {
              const { data, error, isFetching, isDone, execute, watchVariables, isWatchingVariables, unwatchVariables } = api;
              vue.watch(vue.toRef(props, 'watchVariables'), value => {
                  if (value === isWatchingVariables.value) {
                      return;
                  }
                  if (value) {
                      watchVariables();
                      return;
                  }
                  unwatchVariables();
              }, {
                  immediate: true,
              });
              return () => {
                  const slotProps = {
                      data: data.value,
                      error: error.value,
                      isFetching: isFetching.value,
                      isDone: isDone.value,
                      execute,
                  };
                  return normalizeChildren(ctx, slotProps);
              };
          }
          const opts = {
              query: vue.toRef(props, 'query'),
              variables: vue.toRef(props, 'variables'),
              fetchOnMount: props.fetchOnMount,
              cachePolicy: props.cachePolicy,
          };
          if (props.suspended) {
              return useQuery(opts).then(createRenderFn);
          }
          return createRenderFn(useQuery(opts));
      },
  });
  const Query = QueryImpl;

  function useMutation(query, opts) {
      const client = injectWithSelf(VILLUS_CLIENT, () => {
          return new Error('Cannot detect villus Client, did you forget to call `useClient`?');
      });
      const data = vue.ref(null);
      const isFetching = vue.ref(false);
      const isDone = vue.ref(false);
      const error = vue.ref(null);
      // This is to prevent state mutation for racing requests, basically favoring the very last one
      let lastPendingOperation;
      async function execute(variables) {
          isFetching.value = true;
          const vars = variables || {};
          const pendingExecution = client.executeMutation({
              query,
              variables: vars, // FIXME: fix this casting
          }, vue.unref(opts === null || opts === void 0 ? void 0 : opts.context));
          lastPendingOperation = pendingExecution;
          const res = await pendingExecution;
          // Avoid state mutation if the pendingExecution isn't the last pending operation
          if (pendingExecution !== lastPendingOperation) {
              // we still return this result to preserve the integrity of "execute" calls
              return { data: res.data, error: res.error };
          }
          data.value = res.data;
          error.value = res.error;
          isDone.value = true;
          isFetching.value = false;
          lastPendingOperation = undefined;
          return { data: data.value, error: error.value };
      }
      return { data, isFetching, isDone, error, execute };
  }

  const MutationImpl = vue.defineComponent({
      name: 'Mutation',
      props: {
          query: {
              type: [String, Object],
              required: true,
          },
      },
      setup(props, ctx) {
          const { data, isFetching, isDone, error, execute } = useMutation(props.query);
          return () => {
              return normalizeChildren(ctx, {
                  data: data.value,
                  isFetching: isFetching.value,
                  isDone: isDone.value,
                  error: error.value,
                  execute,
              });
          };
      },
  });
  const Mutation = MutationImpl;

  const defaultReducer = (_, val) => val.data;
  function useSubscription({ query, variables, paused }, reduce = defaultReducer) {
      const client = injectWithSelf(VILLUS_CLIENT, () => {
          return new Error('Cannot detect villus Client, did you forget to call `useClient`?');
      });
      const data = vue.ref(reduce(null, { data: null, error: null }));
      const error = vue.ref(null);
      const isPaused = vue.ref(paused || false);
      function handleResponse(result) {
          data.value = reduce(data.value, result);
          error.value = result.error;
      }
      async function initObserver() {
          isPaused.value = false;
          const result = await client.executeSubscription({
              query: vue.unref(query),
              variables: vue.unref(variables),
          });
          return result.subscribe({
              next(result) {
                  if (isPaused.value) {
                      return;
                  }
                  const response = transformResult(result);
                  handleResponse(response);
              },
              // eslint-disable-next-line
              complete() { },
              error(err) {
                  if (isPaused.value) {
                      return;
                  }
                  const response = { data: null, error: new CombinedError({ networkError: err, response: null }) };
                  return handleResponse(response);
              },
          });
      }
      let observer;
      if (!paused) {
          vue.onMounted(async () => {
              observer = await initObserver();
          });
      }
      vue.onBeforeUnmount(() => {
          if (observer) {
              observer.unsubscribe();
          }
      });
      function pause() {
          isPaused.value = true;
      }
      async function resume() {
          if (!observer) {
              reInit();
          }
          isPaused.value = false;
      }
      async function reInit() {
          if (observer) {
              observer.unsubscribe();
          }
          observer = await initObserver();
      }
      if (vue.isRef(query)) {
          vue.watch(query, reInit);
      }
      if (vue.isRef(variables)) {
          vue.watch(variables, reInit);
      }
      return { data, error, isPaused, pause, resume };
  }
  /**
   * Transforms the result from a standard operation result to villus result
   */
  function transformResult(result) {
      if (!result.errors) {
          return { data: result.data || null, error: null };
      }
      return {
          data: result.data || null,
          error: new CombinedError({ graphqlErrors: [...result.errors], response: null }),
      };
  }

  const SubscriptionImpl = vue.defineComponent({
      name: 'Subscription',
      props: {
          query: {
              type: [String, Object],
              required: true,
          },
          variables: {
              type: Object,
              default: null,
          },
          paused: {
              type: Boolean,
              default: false,
          },
          reduce: {
              type: Function,
              default: undefined,
          },
      },
      setup(props, ctx) {
          const { data, error, pause, isPaused, resume } = useSubscription({
              query: props.query,
              variables: props.variables,
              paused: props.paused,
          }, props.reduce || defaultReducer);
          vue.watch(vue.toRef(props, 'paused'), value => {
              if (value === isPaused.value) {
                  return;
              }
              if (value) {
                  pause();
                  return;
              }
              resume();
          });
          return () => {
              const slotProps = {
                  data: data.value,
                  error: error.value,
                  pause,
                  isPaused: isPaused.value,
                  resume,
              };
              return normalizeChildren(ctx, slotProps);
          };
      },
  });
  const Subscription = SubscriptionImpl;

  function handleSubscriptions(forwarder) {
      const forward = forwarder;
      return function subscriptionsHandlerPlugin({ operation, useResult }) {
          if (operation.type !== 'subscription') {
              return;
          }
          if (!forward) {
              throw new Error('No subscription forwarder was set.');
          }
          useResult(forward(operation), true);
      };
  }

  function definePlugin(fn) {
      return fn;
  }

  exports.Client = Client;
  exports.CombinedError = CombinedError;
  exports.Mutation = Mutation;
  exports.Provider = Provider;
  exports.Query = Query;
  exports.Subscription = Subscription;
  exports.VILLUS_CLIENT = VILLUS_CLIENT;
  exports.cache = cache;
  exports.createClient = createClient;
  exports.dedup = dedup;
  exports.defaultPlugins = defaultPlugins;
  exports.definePlugin = definePlugin;
  exports.fetch = fetch;
  exports.getQueryKey = getQueryKey;
  exports.handleSubscriptions = handleSubscriptions;
  exports.useClient = useClient;
  exports.useMutation = useMutation;
  exports.useQuery = useQuery;
  exports.useSubscription = useSubscription;
  exports.withProvider = withProvider;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
