const { backendUrlBase } = require('../config');

export default function (event) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You need to be logged in.');
    return;
  }
  const recipeId = event.target.getAttribute('recipe_id');
  const stared = event.target.classList.contains('fav');
  let url = '';
  if (stared) {
    event.target.classList.remove('fav');
    event.target.classList.add('nonfav');
    url = `${backendUrlBase}/stars/delete/${recipeId}`;
  } else {
    event.target.classList.remove('nonfav');
    event.target.classList.add('fav');
    url = `${backendUrlBase}/stars/add/${recipeId}`;
  }
  fetch(url, {
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}
