import * as React from 'react';
import { useRef } from 'react';

export type LoginFormProps = {
  validNames: string[];
  error?: string;
  onLoginSuccess: (v: string) => void;
  onLoginError: (e: string) => void;
};

export function LoginForm(props: LoginFormProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const onClick = () => {
    if (inputRef.current) {
      const name = inputRef.current.value;
      if (props.validNames.includes(name)) {
        props.onLoginSuccess(name);
      } else {
        props.onLoginError(`Unknown user ${name}`);
      }
    }
  };

  return (
    <div>
      <div className="item">
        <span>Name: </span>
        <input type="text" ref={inputRef} />
        {'  '}
        <button onClick={onClick}>Login</button>
        <br />
      </div>
      <br />
      {props.error && <div style={{ color: 'red' }}>{props.error}</div>}
    </div>
  );
}
