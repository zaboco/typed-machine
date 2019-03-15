import Koa, { Middleware, ParameterizedContext } from 'koa';
// @ts-ignore
import cors from '@koa/cors';
import Router, { IRouterParamContext } from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { currentView, Machine, Model, View } from '../../src/core/Machine';
import { EditableMachine, EditableTemplate, makeEditableMachine } from './SimpleEditableMachine';

const app = new Koa();

type RoutesMiddleware = Middleware<{}, IRouterParamContext>;

const readonlyView: View<RoutesMiddleware, 'Readonly', EditableTemplate> = (dispatch, model) => {
  return new Router()
    .get('/', ctx => {
      ctx.body = {
        state: 'Readonly',
        model,
        links: [
          {
            rel: 'START_EDITING',
            href: '/edit',
          },
        ],
      };
    })
    .post('/edit', ctx => {
      dispatch('START_EDITING');
      ctx.redirect('/');
    })
    .all('/:transition', ctx => {
      ctx.body = {
        error: `Illegal transition ${ctx.params.transition}`,
        links: [
          {
            rel: 'START_EDITING',
            href: '/edit',
          },
        ],
      };
    })
    .routes();
};

const editingView: View<RoutesMiddleware, 'Editing', EditableTemplate> = (dispatch, model) => {
  return new Router()
    .get('/', ctx => {
      ctx.body = {
        state: 'Editing',
        model,
        links: [
          {
            rel: 'SAVE',
            href: '/save',
          },
          {
            rel: 'DISCARD',
            href: '/discard',
          },
        ],
      };
    })
    .post('/save', ctx => {
      console.log(ctx.request.body, `${ctx.request.body}`);
      dispatch('SAVE', ctx.request.body.value);
      ctx.redirect('/');
    })
    .post('/discard', ctx => {
      dispatch('DISCARD');
      ctx.redirect('/');
    })
    .all('/:transition', ctx => {
      ctx.body = {
        error: `Illegal transition ${ctx.params.transition}.`,
        links: [
          {
            rel: 'SAVE',
            href: '/save',
          },
          {
            rel: 'DISCARD',
            href: '/discard',
          },
        ],
      };
    })
    .routes();
};

let initialMachine = makeEditableMachine({
  defaultValue: 'foo',
  onChange: newValue => {
    console.log('got', newValue);
  },
});

let routes: RoutesMiddleware;

function mountRoutes(machine: EditableMachine) {
  routes = currentView(
    machine,
    {
      Readonly: readonlyView,
      Editing: editingView,
    },
    newMachine => {
      mountRoutes(newMachine);
    },
  );
}

mountRoutes(initialMachine);

app
  .use(cors())
  .use(bodyParser())
  .use((ctx: ParameterizedContext<{}, IRouterParamContext>, next) => {
    routes(ctx, next);
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});