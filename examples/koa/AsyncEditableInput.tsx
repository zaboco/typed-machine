import * as React from 'react';
import { Msg } from '../shared/EditableMachine';
import '../shared/EditableItem.css';
import { EditableMachine, EditableMachineOptions, EditableState } from './SimpleEditableMachine';
import { Model, Transitions } from '../../src/core/Machine';

const API_BASE_URL = 'http://localhost:3000';

type Link = {
  rel: string;
  href: string;
};

type ItemDocument<S extends EditableState> = {
  state: S;
  model: Model<EditableMachine, S>;
  links: Link[];
};

export type AsyncEditableInputProps = {};
export type AsyncEditableInputState = {
  item: ItemDocument<'Editing'> | ItemDocument<'Readonly'> | null;
};

export class AsyncEditableInput extends React.Component<
  AsyncEditableInputProps,
  AsyncEditableInputState
> {
  state: AsyncEditableInputState = {
    item: null,
  };
  private inputElement: HTMLInputElement | null = null;

  async componentDidMount(): Promise<void> {
    const item = await (await fetch(API_BASE_URL)).json();
    this.setState({ item });
  }

  render() {
    const { item } = this.state;

    if (item === null) {
      return <div>Loading...</div>;
    }

    return item.state === 'Readonly' ? this.renderReadonly(item) : this.renderEditing(item);
  }

  private renderReadonly(item: ItemDocument<'Readonly'>) {
    return (
      <div className="item">
        <span data-testid="readonly" className="readonly">
          {item.model.value}
        </span>
        <button
          onClick={() => {
            this.triggerTransition<'Readonly'>(item.links, 'START_EDITING');
          }}
        >
          Edit
        </button>
      </div>
    );
  }

  private renderEditing(item: ItemDocument<'Editing'>) {
    return (
      <div className="item">
        <input
          data-testid="draft-input"
          type="text"
          defaultValue={item.model.original}
          autoFocus={true}
          ref={inputElement => {
            this.inputElement = inputElement;
          }}
        />
        <button
          onClick={() =>
            this.triggerTransition<'Editing'>(item.links, 'SAVE', {
              value: this.inputElement ? this.inputElement.value : '',
            })
          }
        >
          Save
        </button>
        <button onClick={() => this.triggerTransition<'Editing'>(item.links, 'DISCARD')}>
          Cancel
        </button>
      </div>
    );
  }

  private async triggerTransition<S extends EditableState>(
    links: Link[],
    transition: keyof Transitions<EditableMachine, S>,
    payload = {},
  ) {
    const response = await fetch(`${API_BASE_URL}${getLinkHref(links, transition)}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    this.setState({ item: await response.json() });
  }
}

function getLinkHref(links: Link[], rel: string) {
  let wantedLink = links.find(link => link.rel === rel);
  return wantedLink ? wantedLink.href : '';
}
