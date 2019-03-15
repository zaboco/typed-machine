import { EditableItemCli } from './EditableItemCli';

const editableItem = EditableItemCli({
  defaultValue: 'Foo',
  onChange: _value => {
    // can't really do anything usefule here
  },
});

editableItem();
