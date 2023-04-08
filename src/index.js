import Notiflix from 'notiflix';
import { fetchPhotos } from './fetchPhotos.js';

const refsForm = {
  form: document.querySelector('.search-form'),
  inputSearch: document.querySelector('input[name="searchQuery"]'),
  btnSubmitSearch: document.querySelector('button[type="submit"]'),
};
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

refsForm.form.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    if (refsForm.inputSearch.value.trim() === '') {
      clearGallery();
      btnLoadMore.classList.add('is-hidden');
      return;
    }
    let page = 1;
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

    btnLoadMore.addEventListener('click', async () => {
      page += 1;
      const response = await fetchPhotos(
        refsForm.inputSearch.value.trim(),
        page
      );
      const result = await response.data;
      const data = await result.hits;
      renderPhotoCard(data);
    });
  } catch {
    btnLoadMore.classList.add('is-hidden');
  }
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
