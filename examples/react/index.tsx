import * as React from 'react';
import * as ReactDom from 'react-dom';

import './index.css';

type AppState = {
  items: string[];
};

class App extends React.Component<{}, AppState> {
  render() {
    return (
      <div className="app">
        <h1 className="title">Demo</h1>
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
