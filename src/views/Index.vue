<template>
    <div class="container mx-auto px-4 ">

        <div class="flex flex-col p-8 rounded-xl shadow-xl text-white">
            <p class="title">Marvel Comics</p>
            <p class="text-lg mb-8 font-medium">Explore Marvel Characters and Comics.</p>

            <error-layout v-if="error" :onClick="reload"/>
            
            <div v-else>
                <loader class="mx-auto" v-if="loading"/>

                <div v-else>
                    <p class="uppercase font-bold text-2xl sm:text-4xl tracking-widest mb-4">Featured Characters</p>

                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <character-card v-for="character in characters" :key="character.id" :character="character"/>
                    </div>

                    <p class="uppercase font-bold text-2xl sm:text-4xl tracking-widest mt-10 mb-6">Featured Comics</p>

                    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                        <router-link :to="{name: 'Comic', params: { id: comic.id }}" v-for="comic in comics" :key="comic.id">
                                <div class="transition transform hover:scale-105 hover:text-red-600 flex flex-col overflow-hidden items-center">
                                    <img 
                                        class="w-48 h-64 shadow-xl rounded object-cover  duration-300 ease-in-out "
                                        :src="comic.imageURL"/>

                                    <p class="break-words text-center text-xs mt-2 font-semibold">{{ comic.title.length > 35 ? comic.title.slice(0, 35) + "..." : comic.title }}</p>
                                    <p class="truncate text-center text-xs">{{ comic.creators }}</p>
                                </div>
                        </router-link>

                    </div>
                </div>

            </div>

        </div>

    </div>
</template>

<script>
import Loader from '../components/Loader.vue'
import CharacterCard from '../components/CharacterCard.vue'
import axios from 'axios'
import request from '../api/marvel'
import ErrorLayout from '../components/ErrorLayout.vue'

export default {
    name: "index",

    data(){
        return {
            characters: [],
            comics: [],
            loading: true,
            error: false
        }
    },

    components: {
        Loader,
        CharacterCard,
        ErrorLayout
    },

    methods: {

        load(){
            //Less 10 from totals to ensure you can retrieve 10 of each
            const randomComics = Math.floor(Math.random() * 1483)
            const randomCharacters = Math.floor(Math.random() * 49126)
            
            axios.all([request("comics", {limit: 10, offset: randomCharacters}), request("characters", {limit: 10, offset: randomComics})])
                .then(axios.spread((...responses) => {

                    //Comics
                    let comics = responses[0].data.data.results

                    comics = comics.map((comic) => {

                        let creators = comic.creators.items.slice(0, 2).map((creator) => {
                            return creator.name.substring(creator.name.lastIndexOf(" ") + 1)
                        })

                        let imageURL = comic.thumbnail.path.includes("image_not_available") ? "http://i.annihil.us/u/prod/marvel/i/mg/f/e0/5b51035252f36.jpg" : comic.thumbnail.path + '.' + comic.thumbnail.extension


                        return {
                            id: comic.id,
                            title: comic.title,
                            creators: creators.toString(),
                            imageURL: imageURL
                        }

                    })

                    //Characters
                    this.comics = comics.slice(0, 10)
                    this.characters = responses[1].data.data.results.slice(0, 10)
                    
                    

                }))
                .catch(() => this.error = true)
                .finally(() => this.loading = false)
        },

        reload(){
            this.error = false
            this.loading = true

            this.load()
        }

    },


    mounted(){
        this.load()
    }
}
</script>