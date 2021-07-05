<template>
    <div class="container mx-auto px-4 ">

        
        <div class="flex flex-col p-8  rounded-xl shadow-xl">
            <p class="title">Characters</p>
            
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

                <div v-else class="flex flex-col">
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
                        <character-card 
                            v-for="character in filteredCharacters" 
                            :key="character.id" 
                            :character="character"/>
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
import CharacterCard from '../components/CharacterCard.vue'
import request from '../api/marvel'
import Loader from '../components/Loader.vue'
import debounce from 'lodash/debounce'
import ErrorLayout from '../components/ErrorLayout.vue'

export default {

    name: "Characters",
    
    data(){
        return {
            //Retain the existing list
            characters: [],
            loading: true,
            error: false,

            //For Loading More
            total: 0,
            offset: 20,
            loadingMore: false,
            moreError: false,


            //Search
            query: "",
            filteredCharacters: [],


          
        }
    },

    components: {
        CharacterCard,
        Loader,
        ErrorLayout
    },

    methods: {

        load(){
            request("characters")
                .then((response) => {this.characters = response.data.data.results; this.filteredCharacters = response.data.data.results; this.total = response.data.data.total})
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

            request("characters", {offset: this.offset} )
            .then((response) => {

                //When loading more also append to master list
                this.characters = [...this.characters, ...response.data.data.results]
                this.filteredCharacters = [...this.filteredCharacters, ...response.data.data.results]; 
                
                this.offset += 20
                this.total -= 20

                
                })
            .catch(() => this.moreError = true)
            .finally(() => this.loadingMore = false)
        },

        search: debounce(function(){

            this.loading = true

            if (this.query){
                request("characters", {nameStartsWith: this.query})
                .then((response) => {this.filteredCharacters = response.data.data.results;})
                .catch(() => this.error = true)
                .finally(() => this.loading = false)
            }

            else {
                this.loading = false
                this.filteredCharacters = this.characters
            }
        }, 500),
    },

    mounted(){
        
        this.load()
        document.title = "Characters"

    },




}
</script>