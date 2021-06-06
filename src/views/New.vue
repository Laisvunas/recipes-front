<template>
  <div class="container">
    <div class="block">
      <h1 class="title is-2">New recipe</h1>
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
    <form id="new_recipe_form" v-on:submit.prevent="newRecipe">
      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input class="input" type="text" placeholder="Title" v-model="title" required>
        </div>
      </div>
      <div class="field">
        <label class="label">Image URL</label>
        <div class="control">
          <input class="input" type="text" placeholder="Image URL" v-model="image" required>
        </div>
      </div>
      <div class="field">
        <label class="label">Description</label>
        <div class="control">
          <textarea class="textarea"
          placeholder="Description" v-model="description" required></textarea>
        </div>
      </div>
      <div class="control">
        <button type="submit" class="button is-primary">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
const { backendUrlBase } = require('../config');

export default {
  data() {
    return {
      title: '',
      image: '',
      description: '',
    };
  },
  methods: {
    newRecipe() {
      const url = `${backendUrlBase}/new`;
      document.querySelector('.message.is-danger').style.display = 'none';
      document.querySelector('.message.is-success').style.display = 'none';
      if (!this.title || !this.image || !this.description) {
        document.querySelector('.message.is-danger > div.message-body').innerText = 'You should submit title, image URL and description.';
        document.querySelector('.message.is-danger').style.display = 'block';
        return;
      }
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: this.title,
          image: this.image,
          description: this.description,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (typeof data.msg !== 'undefined') {
            const inputs = document.querySelectorAll('#new_recipe_form input, #new_recipe_form textarea');
            for (let i = 0; i < inputs.length; i += 1) {
              inputs[i].value = '';
            }
            document.querySelector('.message.is-success > div.message-body').innerText = data.msg;
            document.querySelector('.message.is-success').style.display = 'block';
          }
        })
        .catch((error) => {
          console.log(error);
          document.querySelector('.message.is-danger > div.message-body').innerText = 'Some error happened. Try again later.';
          document.querySelector('.message.is-danger').style.display = 'block';
        });
    },
    closeMsg(e) {
      e.target.parentNode.parentNode.style.display = 'none';
    },
  },
};
</script>

<style scoped>

</style>
