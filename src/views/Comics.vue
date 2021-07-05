<template>
    <div class="container mx-auto px-4">

        <div class="flex flex-col p-8 rounded-xl shadow-xl">
            <p class="title">Comics</p>
            
            <input 
                v-model="query"
                @input="search"
                class="font-bold bg-black text-white text-lg tracking-wide w-full rounded-full py-4 px-8 border border-gray-800 placeholder-gray-200 mb-8 focus:outline-none focus:border-red-600" 
                placeholder="SEARCH..."/>

            <error-layout v-if="error" :onClick="reload"/>

            <div v-else>

                <div v-if="loading" class="flex justify-center">
                        <loader/>
                    </div>

                
                <div v-else class="flex flex-col space-y-8">

                    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6"> 
                    
                    <router-link :to="{name: 'Comic', params: { id: comic.id }}" v-for="comic in filteredComics" :key="comic.id">
                        <div class="text-white transition transform hover:scale-105 hover:text-red-600 flex flex-col overflow-hidden items-center">
                            <img 
                                class="w-48 h-64 shadow-xl rounded object-cover  duration-300 ease-in-out "
                                :src="comic.imageURL"/>

                            <p class="break-words text-center text-xs mt-2 font-semibold">{{ comic.title.length > 35 ? comic.title.slice(0, 35) + "..." : comic.title }}</p>
                            <p class="truncate text-center text-xs">{{ comic.creators }}</p>
                        </div>
                    </router-link>

                    </div>

                    <div v-if="moreError" class="flex flex-col justify-center items-center">
                        <p class="font-bold text-2xl mb-4">Encountered an error. Please try again...</p>
                        <button 
                        @click="loadMore"
                        class="bg-red-600 px-4 py-2 text-white tracking-widest font-semibold shadow-lg rounded transition ease-in-out duration-300 hover:opacity-70">TRY AGAIN</button>
                    </div>

                
                    <div class="flex flex-col justify-center items-center" v-else>
                        <loader class="mx-auto" v-if="loadingMore"/>

                        <!-- Show load more if: has more items, not loading, and no query-->
                        <button
                        v-else-if="total > 0 && !loadingMore && !query"
                        @click="loadMore" 
                        class="bg-red-600 w-max mx-auto px-4 py-2 text-white tracking-widest font-semibold shadow-lg rounded transition ease-in-out duration-300 hover:opacity-70">
                        LOAD MORE</button>

                    </div>
                
                </div>

            </div>

         </div>

    </div>
</template>

<script>
import request from '../api/marvel'
import Loader from '../components/Loader.vue'
import debounce from 'lodash/debounce'
import ErrorLayout from '../components/ErrorLayout.vue'

export default {
    name: "Comics",

    components: {
        Loader,
        ErrorLayout
    },

    data(){
          return {
            comics: [],
            loading: true,
            error: false,

             //For Loading More
            total: 0,
            offset: 20,
            loadingMore: false,
            moreError: false,

            query: "",
            filteredComics: []
        }
    },

    methods: {

        load(){
            request("comics")
                .then((response) => {
                    
                    let comics = response.data.data.results
                    comics = this.extractDetails(comics)
                    
                    this.comics = comics
                    this.filteredComics = comics               

                    this.total = response.data.data.total

                    })
                    .catch(() => this.error = true)
                    .finally(() => this.loading = false)
        },

        reload(){
            this.error = false
            this.loading = true

            this.load()
        },

        loadMore(){
            this.loadingMore = true
            this.moreError = false

            request("comics", {offset: this.offset} )
            .then((response) => {
                let newComics = response.data.data.results
                
                newComics = this.extractDetails(newComics)

                this.comics = [...this.comics, ...newComics]
                this.filteredComics = [...this.filteredComics, ...newComics]
                
                this.offset += 20
                this.total -= 20

                
                })
            .catch(() => this.moreError = true)
            .finally(() => this.loadingMore = false)
        },

        search: debounce(function(){
            this.loading = true

            if (this.query){
                request("comics", {titleStartsWith: this.query})
                .then((response) => {this.filteredComics = this.extractDetails(response.data.data.results);})
                .catch(() => this.error = true)
                .finally(() => this.loading = false)
            }

            else {
                this.loading = false
                this.filteredComics = this.comics
            }
        }, 500),

        extractDetails(comics){
            return comics.map((comic) => {

                    //Get the first two creators
                    let creators = comic.creators.items.slice(0, 2).map((creator) => {
                        return creator.name.substring(creator.name.lastIndexOf(" ") + 1)
                    })

                    return {
                        id: comic.id,
                        title: comic.title,
                        creators: creators.toString(),
                        imageURL: comic.thumbnail.path.includes("image_not_available") ? "http://i.annihil.us/u/prod/marvel/i/mg/f/e0/5b51035252f36.jpg" : comic.thumbnail.path + "." + comic.thumbnail.extension
                    }
                })
        }

    },

    mounted(){
        this.load()
        document.title = "Comics"

    }
}
</script>