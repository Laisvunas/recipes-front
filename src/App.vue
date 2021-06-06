<template>
  <nav class="navbar has-background-grey-darker" role="navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">
        <h1 class="has-text-primary-light">Recipes</h1>
      </router-link>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-end">
        <form v-on:submit.prevent="login">
          <div class="navbar-item">
              <input class="input"
              type="text"
              placeholder="Email"
              v-model="email" required /><input
              class="input"
              type="password"
              placeholder="Password"
              v-model="pass" required /><button
              class="button login_button
              is-primary is-middle"
              type="submit">Login</button>
              <div id="greeting"></div>
          </div>
        </form>
        <div class="navbar-item">
          <div class="buttons">
            <router-link to="/register" class="button register_button is-link is-middle">
              Register
            </router-link>
            <a class="button logout_button is-primary is-middle" v-on:click="logout">
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <router-view/>

</template>

<script>
const { backendUrlBase } = require('./config');

export default {
  data() {
    return {
      email: '',
      pass: '',
    };
  },
  beforeMount() {
    const url = `${backendUrlBase}/content`;
    fetch(url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (typeof data.msg !== 'undefined' && data.msg === 'logged-in') {
          const inputs = document.querySelectorAll('.navbar-item .input, .login_button, .register_button');
          for (let i = 0; i < inputs.length; i += 1) {
            if (inputs[i].tagName.toLowerCase() === 'input') {
              inputs[i].value = '';
            }
            inputs[i].style.display = 'none';
          }
          const greeting = document.querySelector('#greeting');
          greeting.innerText = `Logged in as ${data.email}`;
          const logoutButton = document.querySelector('.logout_button');
          logoutButton.style.display = 'inline';
        }
      });
  },
  methods: {
    login() {
      const url = `${backendUrlBase}/auth/login`;
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
          if (data.token) {
            localStorage.setItem('token', data.token);
            const inputs = document.querySelectorAll('.navbar-item .input, .login_button, .register_button');
            for (let i = 0; i < inputs.length; i += 1) {
              if (inputs[i].tagName.toLowerCase() === 'input') {
                inputs[i].value = '';
              }
              inputs[i].style.display = 'none';
            }
            const greeting = document.querySelector('#greeting');
            greeting.innerText = `Logged in as ${this.email}`;
            const logoutButton = document.querySelector('.logout_button');
            logoutButton.style.display = 'inline';
          }
          if (data.favs) {
            data.favs.forEach((item) => {
              const favButton = document.querySelector(`div[card_id="${item.recipe_id}"] div.fav_button`);
              favButton.classList.remove('nonfav');
              favButton.classList.add('fav');
            });
          }
          if (data.error) {
            alert(data.error);
          }
        });
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/');
      const inputs = document.querySelectorAll('.navbar-item .input, .login_button, .register_button');
      for (let i = 0; i < inputs.length; i += 1) {
        inputs[i].style.display = 'inline';
      }
      const greeting = document.querySelector('#greeting');
      greeting.innerText = '';
      const logoutButton = document.querySelector('.logout_button');
      logoutButton.style.display = 'none';
      const favButtons = document.querySelectorAll('div.card div.fav_button');
      favButtons.forEach((button) => {
        button.classList.remove('fav');
        button.classList.add('nonfav');
      });
    },
  },
};
</script>

<style>
.container {
  border: solid 1px cyan;
  padding: 1.5rem 0 1.5rem 0;
  max-width: 960px!important;
}
.navbar-item h1 {
  font-size: 32px;
}

.navbar-item h1:hover {
  color: hsl(0, 0%, 86%)!important;
}

.buttons .button {
  margin-left: 1rem;
}

.buttons a.logout_button {
  display: none;
}
.login_button {
  margin-left: 0.5rem;
  margin-top: 0.25rem;
}
.input {
  margin-top: 0.25rem;
}
.input:nth-child(2) {
  margin-left: 0.5rem;
}
#greeting {
  color: white;
  margin-top: 0.5rem;
}
article.message {
  display: none;
}
.card-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
}
.card-container > * {
  flex: 0 0 32%;
  margin: 1% 0;
}

.card-container > :nth-child(3n-1) {
  margin-left: 2%;
  margin-right: 2%;
}
.my_favs_button {
  margin-top: 0.25rem;
  display: inline-block;
  float: right;
  margin-right: 0.5rem;
}
.card {
  width: 24%;
  height: 31rem;
  margin-bottom: 0.7rem;
}
.comm {
  float: left;
}
.card-content div.title {
  width: 100%;
  clear: both;
  padding-top: 1rem;
}
.card-content .media-content {
  width: 100%;
}
.fav_button {
  width: 24px;
  height: 24px;
  float: right;
}
.fav {
  background-image: url("/fav.png");
}
.nonfav {
  background-image: url("/nonfav.png");
}
</style>
