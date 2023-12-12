import EventEmitter from 'eventemitter3';
import immutable from 'immutable';

export default class State extends EventEmitter {

  constructor(state, reviver: ?Function) {
    super();
    this._state = null;
    this._reviver = reviver;
    this.load(state || {});
  }

  load(state: Object) {
    const revivedState = immutable.Map.isMap(state)
      ? state
      : this._reviver
        ? immutable.fromJS(state, this.revive_(state, this._reviver))
        : immutable.fromJS(state);
    this.set(revivedState);
  }

  revive_(state, reviver) {
    return function(key, value) {
      if (this === state) {
        const revived = reviver(key, value);
        if (revived) {
          return revived;
        }
      }

      return immutable.Iterable.isIndexed(value)
        ? value.toList()
        : value.toMap();
    };
  }

  set(state, path?) {
    if (this._state === state) {
      return;
    }
    const previousState = this._state;
    this._state = state;
    this.emit('change', this._state, previousState, path);
  }

  get() {
    return this._state;
  }

  save(): Object {
    return this._state.toJS();
  }

  toConsole() {
    console.log(JSON.stringify(this.save())); // eslint-disable-line no-console
  }

  cursor(path: Array<string>) {
    return (arg) => {
      if (!arg) {
        return this._state.getIn(path);
      }
      if (Array.isArray(arg)) {
        return this._state.getIn(path.concat(arg));
      }
      this.set(this._state.updateIn(path, arg), path);
    };
  }

}
