import { Ranks, FilmsCountForRank } from '../consts';
import AbstractView from './abstract-view';

export const createRank = (filmsCount) => {
  let rank = '';

  if (filmsCount >= FilmsCountForRank.NOVICE && filmsCount < FilmsCountForRank.FAN) {
    rank = Ranks.NOVICE;

  } else if (filmsCount >= FilmsCountForRank.FAN && filmsCount < FilmsCountForRank.MOVIE_BUFF) {
    rank = Ranks.FAN;

  } else if (filmsCount >= FilmsCountForRank.MOVIE_BUFF) {
    rank = Ranks.MOVIE_BUFF;

  } else {
    rank = '';
  }

  return rank;
};

const createProfileRankAndAvatar = (filmsCount) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${createRank(filmsCount)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class ProfileRankAndAvatarView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createProfileRankAndAvatar(this.#films.length);
  }
}
