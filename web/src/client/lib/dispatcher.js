import {Dispatcher} from 'flux';
import {pendingActionsCursor} from '../state';

const dispatcher = new Dispatcher;

export function register(callback: Function): string {
  return dispatcher.register(callback);
}

export function dispatch(action: Function, data: ?Object) {
  dispatcher.dispatch({action, data});
}

export function dispatchAsync(action: Function, promise: Object, options: ?Object) {
  if (typeof promise === 'undefined')
    return null;

  const actionName = action.toString();
  if (!action.hasOwnProperty('pending')) {
    Object.defineProperty(action, 'pending', {
      get: () => isPending(actionName)
    });
  }

  setPending(actionName, true);
  return promise.then(
    (data) => {
      setPending(actionName, false);
      return data;
    },
    (reason) => {
      setPending(actionName, false);
      throw reason;
    }
  );
}

export function isPending(actionName) {
  return pendingActionsCursor().has(actionName);
}

function setPending(actionName: string, pending: boolean) {
  pendingActionsCursor(pendingActions => pending
    ? pendingActions.set(actionName, true)
    : pendingActions.delete(actionName)
  );
}
