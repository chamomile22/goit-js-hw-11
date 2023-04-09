import Notiflix from 'notiflix';
import { fetchPhotos } from './fetchPhotos.js';

const refsForm = {
  form: document.querySelector('.search-form'),
  inputSearch: document.querySelector('input[name="searchQuery"]'),
  btnSubmitSearch: document.querySelector('button[type="submit"]'),
};
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
let page = 1;

refsForm.form.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    if (refsForm.inputSearch.value.trim() === '') {
      clearGallery();
      btnLoadMore.classList.add('is-hidden');
      return;
    }
    page = 1;
    const response = await fetchPhotos(refsForm.inputSearch.value.trim(), page);
    const result = await response.data;
    const data = await result.hits;
    btnLoadMore.classList.remove('is-hidden');

    console.log(result);
    console.log(data);
    if (data.length === 0) {
      clearGallery();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      btnLoadMore.classList.add('is-hidden');
      return;
    } else {
      clearGallery();
      renderPhotoCard(data);
    }
    if (result.totalHits <= page * data.length) {
      btnLoadMore.classList.add('is-hidden');
      Notiflix.Notify.info("We're sorry, but it's all from search results.");
      return;
    }

    btnLoadMore.addEventListener('click', async () => {
      page += 1;
      const response = await fetchPhotos(
        refsForm.inputSearch.value.trim(),
        page
      );
      const result = await response.data;
      const data = await result.hits;
      renderPhotoCard(data);
      if (result.totalHits <= page * data.length) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        btnLoadMore.classList.add('is-hidden');
        return;
      }
    });
  } catch {}
});

function renderPhotoCard(data) {
  const markup = data
    .map(el => {
      return `<div class="photo-card">
  <div class="photo"><img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" data-source="${el.largeImageURL}"/></div>
  <div class="info">
    <p class="info-item">
      <span class="info-content--bold">Likes</span>
      <span class="info-content">${el.likes}</span>
    </p>
    <p class="info-item">
      <span class="info-content--bold">Views</span>
      <span class="info-content">${el.views}</span>
    </p>
    <p class="info-item">
      <span class="info-content--bold">Comments</span>
      <span class="info-content">${el.comments}</span>
    </p>
    <p class="info-item">
      <span class="info-content--bold">Downloads</span>
      <span class="info-content">${el.downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  gallery.innerHTML = '';
}
