import AbstractObservable from '../utils/abstract-observable';
import { FilterType } from '../consts';

export default class FilterModel extends AbstractObservable {
    #filter = FilterType.ALL;

    get filter() {
      return this.#filter;
    }

    setFilter = (updateType, filter) => {
      this.#filter = filter;
      this._notify(updateType);
    }

    showStats = (updateType) => {
      this._notify(updateType);
    }
}
