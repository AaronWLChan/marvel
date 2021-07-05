import { createWebHistory, createRouter } from "vue-router"
import Index from '../views/Index.vue'
import Characters from '../views/Characters.vue'
import Character from '../views/Character.vue'
import NotFound from '../views/NotFound.vue'
import Comics from '../views/Comics.vue'
import Comic from '../views/Comic.vue'

const routes = [
    {
        path: "/",
        name: "Home",
        component: Index
    },

    {
        path: "/characters",
        name: "Characters",
        component: Characters
    },

    {
        path: "/characters/:id",
        name: "Character",
        component: Character
    },

    {
        path: "/comics",
        name: "Comics",
        component: Comics
    },

    {
        path: "/comics/:id",
        name: "Comic",
        component: Comic
    },

    {
        path: "/:catchAll(.*)",
        component: NotFound
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router