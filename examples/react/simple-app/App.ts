import { DefineTemplate, machineFactory } from '../../../src/core/Machine';

export type AppState = 'LoggedOut' | 'LoggedIn';

export type AppTemplate = DefineTemplate<
  AppState,
  {
    LoggedOut: {
      model: { error?: string };
      transitionPayloads: {
        LOGIN_SUCCESS: string;
        LOGIN_ERROR: string;
      };
    };
    LoggedIn: {
      model: { name: string };
      transitionPayloads: {
        LOGOUT: null;
        NAME_TO_LOWERCASE: null;
      };
    };
  }
>;

export const initAppMachine = machineFactory<AppState, AppTemplate>({
  LoggedOut: {
    LOGIN_ERROR: (_model, error) => ['LoggedOut', { error }],
    LOGIN_SUCCESS: (_model, name) => ['LoggedIn', { name }],
  },
  LoggedIn: {
    NAME_TO_LOWERCASE: model => ['LoggedIn', { name: model.name.toLowerCase() }],
    LOGOUT: () => ['LoggedOut', {}],
  },
});
