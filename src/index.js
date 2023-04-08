import Notiflix from 'notiflix';
import { fetchPhotos } from './fetchPhotos.js';

const refsForm = {
  form: document.querySelector('.search-form'),
  inputSearch: document.querySelector('input[name="searchQuery"]'),
  btnSubmitSearch: document.querySelector('button[type="submit"]'),
};
const gallery = document.querySelector('.gallery');

refsForm.form.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    if (refsForm.inputSearch.value.trim() === '') {
      return;
    }
    const response = await fetchPhotos(refsForm.inputSearch.value.trim());
    const result = await response.data;
    const data = await result.hits;

    console.log(data);
    if (data.length === 0) {
      clearGallery();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      clearGallery();
      renderPhotoCard(data);
    }
  } catch {}
});

function renderPhotoCard(data) {
  const markup = data
    .map(el => {
      return `<div class="photo-card">
  <div class="photo"><img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" data-source="${el.largeImageURL}/></div>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${el.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${el.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${el.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${el.downloads}
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
