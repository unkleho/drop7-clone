import create from 'zustand';
import xstate from 'zustand-middleware-xstate';
import { drop7Machine } from './machine';

// Using XState via Zustand helps keep state across fast refreshes
export const useStore = create(xstate(drop7Machine));
