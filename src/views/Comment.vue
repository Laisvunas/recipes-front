<template>
    <div class="container">

        <div class="block">
            <h1 class="title is-2">New Comment</h1>
        </div>

        <article class="message is-success">
            <div class="message-header">
                <p>Success</p>
                <button class="delete" aria-label="delete" v-on:click="closeMsg"></button>
            </div>
            <div class="message-body">
            </div>
        </article>
        <article class="message is-danger">
            <div class="message-header">
                <p>Error</p>
                <button class="delete" aria-label="delete" v-on:click="closeMsg"></button>
            </div>
            <div class="message-body">
            </div>
        </article>

        <div class="block">
            <form id="comment_form" v-on:submit.prevent="newComment">
                <div class="field">
                    <div class="control">
                    <textarea class="textarea"
                    placeholder="Your comment"
                    v-model="comment" required></textarea>
                    </div>
                </div>
                <div class="control">
                    <button type="submit" class="button is-primary">Submit</button>
                </div>
            </form>
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

    </div>

</template>

<script>
import changeStarFunction from '../utils/changeStar';

const { backendUrlBase } = require('../config');

export default {
  data() {
    return {
      recipesData: '',
      comment: '',
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
        this.recipesData = newData;
      });
  },
  methods: {
    newComment() {
      const url = `${backendUrlBase}/comments`;
      fetch(url, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: this.comment,
          recipeId: this.$route.params.id,
        }),
      }).then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (typeof data.msg !== 'undefined') {
            const textarea = document.querySelector('#comment_form textarea');
            textarea.value = '';
            document.querySelector('.message.is-success > div.message-body').innerText = data.msg;
            document.querySelector('.message.is-success').style.display = 'block';
          } else if (typeof data.error !== 'undefined') {
            document.querySelector('.message.is-danger > div.message-body').innerText = 'Some error happened. Try again later.';
            document.querySelector('.message.is-danger').style.display = 'block';
          }
        });
    },
    changeStar(event) {
      changeStarFunction(event);
    },
    closeMsg(e) {
      e.target.parentNode.parentNode.style.display = 'none';
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
</style>
