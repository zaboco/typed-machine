import Vue, { CreateElement, VNode } from 'vue';
import { currentView, GraphTemplate, Machine, View, Views } from '../../src/core/Machine';

type VueRenderFn = (h: CreateElement) => VNode;

export type VueViews<S extends string, GT extends GraphTemplate<S>> = Views<VueRenderFn, S, GT>;
export type VueView<S extends string, GT extends GraphTemplate<S>> = View<VueRenderFn, S, GT>;

type State<S extends string, GT extends GraphTemplate<S>> = {
  machine: Machine<S, GT>;
};

export const makeMachineVueAdapter = <S extends string, GT extends GraphTemplate<S>>(
  initialMachine: Machine<S, GT>,
  views: VueViews<S, GT>,
) =>
  Vue.extend<State<S, GT>, void, void, void>({
    data() {
      return {
        machine: initialMachine,
      };
    },

    render(h) {
      return currentView(this.machine, views, newMachine => {
        this.machine = newMachine;
      })(h);
    },
  });
