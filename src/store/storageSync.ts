import { Store, MutationPayload } from 'vuex';

interface PluginOptions<S> {
  mutationFilter?: (mutation: MutationPayload) => boolean;
  stateToStorage: (state: S) => string;
  storageToState: (st: string) => S;
  initMutationName?: string; // @INIT
  storageKey: string;
}

export default function createStorageSyncPlugin<S>(options: PluginOptions<S>) {
  const {
    mutationFilter = () => true,
    stateToStorage,
    storageToState,
    initMutationName = '@INIT',
    storageKey,
  } = options;

  let hasInit = false;

  return (store: Store<S>) => {
    // 首先初始化
    const storageRaw = window.localStorage.getItem(storageKey);
    if (storageRaw) {
      const parseResult = storageToState(storageRaw);
      if (parseResult !== undefined) {
        store.commit(initMutationName, parseResult);
      }
    }
    hasInit = true;

    // 订阅
    store.subscribe((mutation, state) => {
      if (!mutationFilter(mutation)) { return; }
      window.localStorage.setItem(storageKey, stateToStorage(state));
    });
  };
}
