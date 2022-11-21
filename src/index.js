import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import makeURL from './pixabay';

const lightbox = new SimpleLightbox('.gallery a', {
  docClose: true,
  captionsData: 'alt',
  captionDelay: 250,
});

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const button = document.querySelector('.load-more');

let page;
let searchValue;
let totalShowed;

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  gallery.innerHTML = '';
  const [input] = event.target;

  page = 1;
  totalShowed = 0;
  searchValue = input.value;
  fetchByName(searchValue, 1);
});



gallery.addEventListener('click', event => event.preventDefault());

button.addEventListener('click', () => {
  fetchByName(searchValue, ++page);
});

async function fetchByName(name, page) {
  try{
    const response = await axios.get(makeURL(name, page));
    const result = await response.data;
    renderResult(result);
  } catch (error){
    renderError(error);
  }
}




function renderResult(result) {
  if (result.hits.length == 0) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }
  if (page == 1) {
    Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
    button.classList.remove('is-hidden');
  }
  totalShowed += result.hits.length;
  if (totalShowed >= result.totalHits) {
    Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
    button.classList.add('is-hidden');
  }
  gallery.innerHTML += result.hits.map(createResult).join('');
  

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  lightbox.refresh();
}

function createResult({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<a class='gallery__item' href="${largeImageURL}">
    <div class='photo-card'>
        <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
        <div class='info'>
            <p class="info-item"><b>Likes </b>${likes}</p>
            <p class="info-item"><b>Views </b>${views}</p>
            <p class="info-item"><b>Comments </b>${comments}</p>
            <p class="info-item"><b>Downloads </b>${downloads}</p>
        </div>
    </div>
    </a>`;
}

function renderError(result) {
  Notiflix.Notify.failure('Something goes wrong! ' + result.message);
}
