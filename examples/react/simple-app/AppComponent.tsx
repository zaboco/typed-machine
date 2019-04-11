import * as React from 'react';
import { AppState, AppTemplate } from './App';
import { Machine } from '../../../src/core/Machine';
import { MachineAdapter } from '../../../src/react';
import { LoginForm } from './LoginForm';

export type AppComponentProps = {
  machine: Machine<AppState, AppTemplate>;
};

export const AppComponent = (props: AppComponentProps) => (
  <MachineAdapter<AppState, AppTemplate>
    machine={props.machine}
    views={{
      LoggedOut: (dispatch, model) => (
        <div>
          <h2>Logged Out</h2>
          <LoginForm
            validNames={['JavaScripter', 'Hero']}
            error={model.error}
            onLoginSuccess={name => {
              dispatch('LOGIN_SUCCESS', name);
            }}
            onLoginError={error => {
              dispatch('LOGIN_ERROR', error);
            }}
          />
        </div>
      ),
      LoggedIn: (dispatch, model) => (
        <div>
          <h2>Logged in</h2>
          <span>Hello {model.name} </span>
          <button
            onClick={() => {
              dispatch('NAME_TO_LOWERCASE');
            }}
          >
            To lowercase
          </button>
          {'  '}
          <button
            onClick={() => {
              dispatch('LOGOUT');
            }}
          >
            Logout
          </button>
        </div>
      ),
    }}
  />
);
