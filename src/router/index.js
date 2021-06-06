import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/new',
    name: 'New',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/New.vue'),
    meta: {
      requiresAuth: true,
      title: 'New Recipe',
    },
  },
  {
    path: '/favs',
    name: 'Favourites',
    component: () => import(/* webpackChunkName: "about" */ '../views/Favs.vue'),
    meta: {
      requiresAuth: true,
      title: 'Favourites',
    },
  },
  {
    path: '/recipes/:id',
    name: 'Recipes',
    component: () => import(/* webpackChunkName: "recipes" */ '../views/Recipes.vue'),
    meta: {
      title: 'Recipe',
    },
  },
  {
    path: '/comment',
    name: 'New Comment',
    component: () => import(/* webpackChunkName: "recipes" */ '../views/Comment.vue'),
    meta: {
      requiresAuth: true,
      title: 'New Comment',
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue'),
    meta: {
      title: 'Register',
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  window.document.title = to.meta && to.meta.title ? to.meta.title : 'Recipes';
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      next();
    } else {
      alert('You need to be logged in.');
      router.replace('/');
    }
  } else {
    next();
  }
});

export default router;
