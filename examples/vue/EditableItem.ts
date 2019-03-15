import Vue, { CreateElement } from 'vue';
import { makeMachineVueAdapter, VueView } from '../../src/vue/VueMachineAdapter';
import { EditableTemplate, makeEditableMachine } from '../shared/EditableMachine';
import '../shared/EditableItem.css';

const readonlyView: VueView<'Readonly', EditableTemplate> = (dispatch, model) => h =>
  h(
    'div',
    {
      class: 'item',
    },
    [
      h('span', { class: 'readonly' }, model),
      Button(h, {
        label: 'Edit',
        onClick: () => {
          dispatch('START_EDITING');
        },
      }),
    ],
  );

const editingView: VueView<'Editing', EditableTemplate> = (dispatch, { draft }) => h => {
  return h('div', { class: 'item' }, [
    h('input', {
      domProps: {
        value: draft,
      },
      attrs: {
        type: 'text',
        autofocus: true,
      },
      on: {
        input: (event: any) => {
          dispatch('CHANGE_TEXT', event.target.value);
        },
      },
    }),
    Button(h, {
      label: 'Save',
      onClick: () => {
        dispatch('SAVE');
      },
    }),
    Button(h, {
      label: 'Cancel',
      onClick: () => {
        dispatch('DISCARD');
      },
    }),
  ]);
};

function Button(h: CreateElement, props: { onClick: () => void; label: string }) {
  return h(
    'button',
    {
      on: {
        click: props.onClick,
      },
    },
    props.label,
  );
}

export const EditableItem = Vue.extend({
  props: ['defaultValue', 'onChange'],

  render(h) {
    const editableMachine = makeMachineVueAdapter(
      makeEditableMachine({
        defaultValue: this.defaultValue,
        onChange: this.onChange,
      }),
      {
        Readonly: readonlyView,
        Editing: editingView,
      },
    );

    return h(editableMachine);
  },
});
