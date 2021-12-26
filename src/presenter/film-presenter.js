import { MODE } from '../consts';
import FilmCardView from '../view/film-card-view';
import FilmPopupView from '../view/film-popup-view';
import { render, RenderPosition, appendChild, remove, replace } from '../utils/render';

export default class FilmPresenter {
  #filmContainer = null;
  #changeData = null;
  #changeMode = null;

  #filmComponent = null;
  #filmPopupComponent = null;

  #film = null;
  #mode = MODE.DEFAULT;

  #body = document.querySelector('body');


  constructor(filmContainer, changeData, changeMode) {
    this.#filmContainer = filmContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#filmPopupComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#filmPopupComponent = new FilmPopupView(film);

    this.#filmComponent.setFilmCardClickHandler(() => {
      appendChild(this.#body, this.#filmPopupComponent);
      this.#body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#escKeyDownHandler);
      // this.#filmPopupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
      // this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
      // this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
      this.#filmPopupComponent.setClosePopupClickHandler(this.#closePopupClickHandler);
      this.#changeMode();
      this.#mode = MODE.POPUP;
    });


    // this.#filmComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    // this.#filmComponent.setWatchedClickHandler(this.#handleWatchedClick);
    // this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmComponent === null) {
      render(this.#filmContainer, this.#filmComponent, RenderPosition.BEFORE_END);
    }

    if (this.#mode === MODE.DEFAULT && prevFilmComponent !== null) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#mode === MODE.POPUP && prevPopupComponent !== null) {
      replace(this.#filmPopupComponent, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  closePopup = () => {
    // Проблема:
    // если в разных секциях отрисована одна и та же карточка фильма,
    // то попап этого фильма не скрывается при клике на другую карточку
    // и дублируется при клике на такую же карточку
    if (this.#mode !== MODE.DEFAULT) {
      remove(this.#filmPopupComponent);
      this.#mode = MODE.DEFAULT;
    }
  }

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmPopupComponent);
  }


  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#body.classList.remove('hide-overflow');
      remove(this.#filmPopupComponent);
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#mode = MODE.DEFAULT;
    }
  };

  #closePopupClickHandler = () => {
    this.#body.classList.remove('hide-overflow');
    remove(this.#filmPopupComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = MODE.DEFAULT;
  };

  // #handleWatchlistClick = () => {
  //   this.#changeData({...this.#film, isOnWatchlist: !this.#film.isOnWatchlist});
  // }

  // #handleWatchedClick = () => {
  //   this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
  // }

  // #handleFavoriteClick = () => {
  //   this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
  //}
}
