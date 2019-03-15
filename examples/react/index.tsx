import * as React from 'react';
import * as ReactDom from 'react-dom';
import { EditableItem } from './EditableItem';

import '../shared/index.css';
import { DeletableItem } from './list/DeletableItem';

type AppState = {
  items: string[];
};

class App extends React.Component<{}, AppState> {
  state: AppState = {
    items: ['foo', 'bar', 'baz'],
  };

  render() {
    return (
      <div className="app">
        <h1 className="title">Editable Item</h1>
        <EditableItem
          defaultValue="Foo"
          onChange={value => {
            console.log('Value has changed:', value);
          }}
        />
        {this.renderDeletableItems()}
      </div>
    );
  }

  private renderDeletableItems() {
    const { items } = this.state;
    return (
      <>
        <h1 className="title">Deletable Items</h1>
        <button
          onClick={() => {
            this.setState({ items: ['new', ...this.state.items] });
          }}
        >
          Add item
        </button>
        <div>
          {items.map((item, index) => {
            return (
              <DeletableItem
                key={`${item}-${index}-${Date.now()}`}
                defaultValue={item}
                onChange={value => {
                  console.log(`Value ${index} has changed:`, value);
                }}
                onDelete={() => {
                  console.log('Deleted', index);
                  setTimeout(() => {
                    items.splice(index, 1);
                    this.setState({ items });
                  }, 1000);
                }}
              />
            );
          })}
        </div>
      </>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
