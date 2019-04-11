import * as React from 'react';
import * as ReactDom from 'react-dom';
import { initAppMachine } from './simple-app/App';
import { AppComponent } from './simple-app/AppComponent';
import './index.css';

type AppState = {
  items: string[];
};

class App extends React.Component<{}, AppState> {
  render() {
    const appMachine = initAppMachine('LoggedOut', {});
    return (
      <div className="app">
        <h1 className="title">Demo</h1>
        <AppComponent machine={appMachine} />
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
