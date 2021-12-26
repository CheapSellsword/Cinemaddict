import { FILMS_COUNT_PER_STEP/*, SortTypes */} from '../consts';
import { render, RenderPosition, remove } from '../utils/render';
import { createTopRatedFilmList, createMostCommentedFilmList } from '../mock/extra-films';
import SortView from '../view/sort-view';
import FilmSectionView from '../view/film-section-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import NoFilmView from '../view/no-film-view';
import FilmPresenter from './film-presenter';
import { updateItem } from '../utils/common';
//import { sortByDate, sortByRating, compareByField } from '../utils/film-sort';

export default class CollectionPresenter {
  #collectionContainer = null;

  #sortComponent = new SortView();
  #filmSectionComponent = new FilmSectionView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #noFilmComponent = new NoFilmView();

  #collectionFilms = [];
  #filmPresenter = new Map();
  //#currentSortType = SortTypes.DEFAULT;
  //#sourcedCollectionFilms = [];

  #renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
  #filmContainer = this.#filmSectionComponent.filmContainer;
  #topRatedSection = this.#filmSectionComponent.topRatedSection;
  #topRatedFilmContainer = this.#filmSectionComponent.topRatedFilmContainer;
  #mostCommentedSection = this.#filmSectionComponent.mostCommentedSection;
  #mostCommentedFilmContainer = this.#filmSectionComponent.mostCommentedFilmContainer;

  constructor(collectionContainer) {
    this.#collectionContainer = collectionContainer;
  }

  init = (collectionFilms) => {
    this.#collectionFilms = [...collectionFilms];
    //this.#sourcedCollectionFilms = [...collectionFilms];
    this.#renderCollection(this.#collectionFilms);
    //console.log(this.#collectionFilms);
  }

  #handleFilmChange = (updatedFilm) => {
    this.#collectionFilms = updateItem(this.#collectionFilms, updatedFilm);
    //this.#sourcedCollectionFilms = updateItem(this.#sourcedCollectionFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  }

  #renderFilm = (filmContainer, film) => {
    const filmPresenter = new FilmPresenter(filmContainer, this.#handleFilmChange, this.#handleModeChange);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilms = (from, to) => {
    this.#collectionFilms
      .slice(from, to)
      .forEach((film) => this.#renderFilm(this.#filmContainer, film));
  }

  #renderFilmList = () => {
    this.#renderFilms(0, Math.min(this.#collectionFilms.length, this.#renderedFilmCardsCount));
    if (this.#collectionFilms.length > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  // #sortFilms = (sortType) => {
  //   switch (sortType) {
  //     case SortTypes.DATE:
  //       this.#collectionFilms.sort(compareByField('releaseYear'));
  //       break;
  //     case SortTypes.RATING:
  //       this.#collectionFilms.sort(compareByField('rating'));
  //       break;
  //     default:
  //       this.#collectionFilms = [...this.#sourcedCollectionFilms];
  //   }

  //   this.#currentSortType = sortType;
  // }

  // #handleSortTypeChange = (sortType) => {
  //   if (this.#currentSortType === sortType) {
  //     return;
  //   }

  //   this.#sortFilms(sortType);
  //   this.#clearFilmSection();
  //   this.#renderFilmSection();
  // }

  #renderSort = () => {
    render(this.#collectionContainer, this.#sortComponent, RenderPosition.BEFORE_END);
  // this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderFilmSection = () => {
    render(this.#collectionContainer, this.#filmSectionComponent, RenderPosition.BEFORE_END);
  }

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCardsCount, this.#renderedFilmCardsCount + FILMS_COUNT_PER_STEP);
    this.#renderedFilmCardsCount += FILMS_COUNT_PER_STEP;
    if (this.#renderedFilmCardsCount >= this.#collectionFilms.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    render(this.#filmContainer, this.#showMoreButtonComponent, RenderPosition.AFTER_END);
    this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderExtraFilms = (extraContainer, extraFilms, extraSection) => {
    if (extraFilms) {
      extraFilms.forEach((film) => this.#renderFilm(extraContainer, film));
    } else {
      extraSection.remove();
    }
  }

  #renderNoFilm = () => {
    render(this.#collectionContainer, this.#noFilmComponent);
  }

  #clearFilmSection = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }

  #clearFilmCollection = () => {
    remove(this.#sortComponent);
    remove(this.#filmSectionComponent);
    remove(this.#showMoreButtonComponent);
    this.#renderedFilmCardsCount = 0;
  }

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.closePopup());
  }

  #renderCollection = (collectionFilms) => {
    if (collectionFilms.length) {
      this.#renderSort();
      this.#renderFilmSection();
      this.#renderFilmList();
      this.#renderExtraFilms(this.#topRatedFilmContainer, createTopRatedFilmList(collectionFilms), this.#topRatedSection);
      this.#renderExtraFilms(this.#mostCommentedFilmContainer, createMostCommentedFilmList(collectionFilms), this.#mostCommentedSection);
    } else {
      this.#renderNoFilm();
    }
  }
}
