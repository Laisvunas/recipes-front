<template>
  <div class="container">
    <div class="block">
      <h1 class="title is-2">Recipe</h1>
    </div>

    <div class="card-container">
      <div
      class="card single_card"
      v-for="recipe in recipesData"
      v-bind:key="recipe.id" :card_id="recipe.id">
        <div class="card-image">
          <figure class="image is-4by3">
            <router-link :to="'/recipes/' + recipe.id">
              <img :src="recipe.image" alt="Placeholder image">
            </router-link>
          </figure>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <div>
                <div class="comm">{{ recipe.comments_str }}</div>
                <div
                :class="'fav_button ' + recipe.fav"
                :recipe_id="recipe.id" v-on:click="changeStar"></div>
              </div>
              <div class="title is-6">{{ recipe.title }}</div>
            </div>
          </div>

          <div class="content">
            <p>{{ recipe.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="block">
      <h1 class="title is-2">Comments</h1>
    </div>
    <div class="block">
      <p id="nothing_found_msg">No comments found.</p>
    </div>
    <div class="block">
      <a
        href="/comment"
        class="button is-link is-middle" v-on:click.prevent="toNewComment">New Comment</a>
    </div>

  </div>

</template>

<script>
const { backendUrlBase } = require('../config');

export default {
  data() {
    return {
      recipesData: '',
    };
  },
  beforeMount() {
    const url = `${backendUrlBase}/recipes/${this.$route.params.id}`;
    fetch(url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const newData = [];
        data.data.recipe.forEach((element) => {
          newData.push(element);
          if (typeof newData[newData.length - 1].recipe_id !== 'undefined' && newData[newData.length - 1].recipe_id) {
            newData[newData.length - 1].fav = 'fav';
          } else {
            newData[newData.length - 1].fav = 'nonfav';
          }
          if (newData[newData.length - 1].comments_num === 1) {
            newData[newData.length - 1].comments_str = '1 comment';
          } else {
            newData[newData.length - 1].comments_str = `${newData[newData.length - 1].comments_num} comments`;
          }
        });
        console.log(newData);
        this.recipesData = newData;
        if (data.data.comments.length === 0) {
          document.querySelector('#nothing_found_msg').style.display = 'block';
        }
      });
  },
  methods: {
    toNewComment(event) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to be logged in.');
        return;
      }
      window.location.href = event.target.href;
    },
    changeStar(event) {
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
    },
  },
};
</script>

<style scoped>
.card-container {
  display: block;
}
.card {
  width: auto;
  height: auto;
  margin-bottom: 1.5rem;
}
#nothing_found_msg {
  display: none;
}
</style>
