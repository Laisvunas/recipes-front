<template>
    <div class="container">
        <div class="block">
            <h1 class="title is-2">Register</h1>
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
        <form id="register_form" v-on:submit.prevent="register">
            <div class="field">
                <label class="label">Email</label>
                <div class="control">
                <input class="input" type="text" placeholder="Email" v-model="email" required>
                </div>
            </div>
            <div class="field">
                <label class="label">Password</label>
                <div class="control">
                <input class="input"
                type="password" minlength="6" placeholder="Password" v-model="pass" required>
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
      email: '',
      pass: '',
    };
  },
  methods: {
    register() {
      const url = `${backendUrlBase}/auth/register`;
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.email,
          password: this.pass,
        }),
      }).then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (typeof data.msg !== 'undefined') {
            const inputs = document.querySelectorAll('#register_form input');
            for (let i = 0; i < inputs.length; i += 1) {
              inputs[i].value = '';
            }
            document.querySelector('.message.is-success > div.message-body').innerText = data.msg;
            document.querySelector('.message.is-success').style.display = 'block';
          } else if (typeof data.error !== 'undefined') {
            console.log(data.error);
            document.querySelector('.message.is-danger > div.message-body').innerText = 'Some error happened. Try again later.';
            document.querySelector('.message.is-danger').style.display = 'block';
          }
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
