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
      <h1 class="title is-2">Comments <a
        href="/comment"
        class="button is-link is-middle"
        id="new_comment_btn" v-on:click.prevent="toNewComment">New Comment</a></h1>
    </div>
    <div class="block">
      <p id="nothing_found_msg">No comments found.</p>
    </div>

    <article class="message comment" v-for="comment in commentsData" v-bind:key="comment.id">
      <div class="message-body">
        <p><strong>{{ comment.email }}</strong> said:
        <span class="date_time">{{ comment.timestamp }}</span></p>
        {{ comment.comment }}
      </div>
    </article>

  </div>

</template>

<script>
import changeStarFunction from '../utils/changeStar';

const { backendUrlBase } = require('../config');

export default {
  data() {
    return {
      recipesData: '',
      commentsData: '',
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
        if (data.data.comments.length === 0) {
          document.querySelector('#nothing_found_msg').style.display = 'block';
        } else {
          const newCommData = [];
          data.data.comments.forEach((element) => {
            newCommData.push(element);
            newCommData[newCommData.length - 1].timestamp = newCommData[newCommData.length - 1].timestamp.replace('T', ' ');
            const pointIndex = newCommData[newCommData.length - 1].timestamp.indexOf('.');
            newCommData[newCommData.length - 1].timestamp = newCommData[newCommData.length - 1]
              .timestamp.substr(0, pointIndex);
          });
          this.commentsData = newCommData;
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
      changeStarFunction(event);
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
article.message.comment {
  display: block;
}
#new_comment_btn {
  display: inline-block;
  float: right;
  margin-top: 0.5rem;
}
span.date_time {
  display: inline-block;
  float: right;
}
</style>
