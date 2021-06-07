<template>
    <div class="container">
        <div class="block">
            <h1 class="title is-2">My Favourite Recipes</h1>
        </div>
        <p id="nothing_found_msg">No favourite recipes found.</p>
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
import changeStarFunction from '../utils/changeStar';

const { backendUrlBase } = require('../config');

export default {
  data() {
    return {
      recipesData: '',
    };
  },
  beforeMount() {
    const url = `${backendUrlBase}/favs`;
    fetch(url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data.length === 0) {
          document.querySelector('#nothing_found_msg').style.display = 'block';
        }
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
        // console.log(newData);
        this.recipesData = newData;
      });
  },
  methods: {
    changeStar(event) {
      changeStarFunction(event);
    },
  },
};
</script>

<style scoped>
#nothing_found_msg {
    display: none;
}
</style>
