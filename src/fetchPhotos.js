import axios from 'axios';
const BASE_LINK = 'https://pixabay.com/api/';
const key = '35161843-21529f4993e16b6a6e96a015e';
const options =
  '&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

export async function fetchPhotos(q, page) {
  return await axios.get(
    `${BASE_LINK}?key=${key}&q=${q}${options}&page=${page}`
  );
}
