import Vue from 'vue';
import { EditableItem } from './EditableItem';
import '../shared/index.css';

new Vue({
  render: h =>
    h('div', { class: 'app' }, [
      h('h1', { class: 'title' }, 'Editable Item'),
      h(EditableItem, {
        props: {
          defaultValue: 'Foo',
          onChange: (value: string) => {
            console.log('Value has changed:', value);
          },
        },
      }),
    ]),
}).$mount('#root');
