const readonlyResponse = {
  state: 'Readonly',
  model: 'foo-1',
  links: [
    {
      rel: 'START_EDITING',
      link: '/edit/1',
    },
  ],
};

const editingResponse = {
  state: 'Editing',
  model: 'foo-1',
  links: [
    {
      rel: 'SAVE',
      link: '/save/1',
    },
    {
      rel: 'DISCARD',
      link: '/discard/1',
    },
  ],
};
