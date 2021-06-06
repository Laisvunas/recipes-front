<template>
  <div class="container">
    <div class="block">
      <div class="control">
        <form v-on:submit.prevent="search">
          <input class="input"
            type="text"
            placeholder="Recipe title" minlength="3" v-model="searchPhr" required />
          <button
            class="button search_button
            is-primary"
            type="submit">Search</button>
        </form>
        <router-link
          to="/new"
          class="button create_recipe_button is-link is-middle">New recipe</router-link>
        <router-link
          to="/favs"
          class="button my_favs_button is-link is-middle">My Favourites</router-link>
      </div>
    </div>
    <div class="block">
      <h1 class="title is-2">Our recipes collection</h1>
    </div>

    <div class="card-container">
      <div
      class="card"
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

  </div>
</template>

<script>
const { backendUrlBase } = require('../config');

export default {
  data() {
    return {
      recipesData: '',
      searchPhr: '',
    };
  },
  beforeMount() {
    const url = `${backendUrlBase}/all`;
    fetch(url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const newData = [];
        res.data.forEach((element) => {
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
          if (newData[newData.length - 1].title.length > 60) {
            newData[newData.length - 1].title = `${newData[newData.length - 1].title.substring(0, 60)}...`;
          }
          if (newData[newData.length - 1].description.length > 100) {
            newData[newData.length - 1].description = `${newData[newData.length - 1].description.substring(0, 100)}...`;
          }
        });
        console.log(newData);
        this.recipesData = newData;
      });
  },
  methods: {
    search() {
      console.log(this.searchPhr);
      const url = `${backendUrlBase}/search`;
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          searchPhr: this.searchPhr,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          const newData = [];
          res.data.forEach((element) => {
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
            if (newData[newData.length - 1].title.length > 60) {
              newData[newData.length - 1].title = `${newData[newData.length - 1].title.substring(0, 60)}...`;
            }
            if (newData[newData.length - 1].description.length > 100) {
              newData[newData.length - 1].description = `${newData[newData.length - 1].description.substring(0, 100)}...`;
            }
          });
          console.log(newData);
          this.recipesData = newData;
        });
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
.control .input {
  width: 30rem;
}
.search_button {
  margin-top: 0.25rem;
  margin-left: 0.5rem;
}
.create_recipe_button {
  margin-top: 0.25rem;
  display: inline-block;
  float: right;
}
.control form {
  display: inline-block;
}
</style>
