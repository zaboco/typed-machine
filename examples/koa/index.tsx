import * as React from 'react';
import * as ReactDom from 'react-dom';
import { AsyncEditableInput } from './AsyncEditableInput';

import '../shared/index.css';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <h1 className="title">Editable Item</h1>
        <AsyncEditableInput />
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
