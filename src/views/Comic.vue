<template>
     <div class="container mx-auto">            
            <error-layout v-if="error" :onClick="reload"/>

            <div v-else>

                 <div v-if="loading" class="flex justify-center">
                    <loader/>
                </div>

                <div v-else class="">

                    <div class="flex-col lg:flex-row flex gap-8 px-8">

                        <p class="text-3xl sm:hidden text-center font-black uppercase tracking-widest mb-2 text-white">{{ comic.title }}</p>
                        
                        <img class="w-72 sm:w-96 h-auto transition duration-500 ease-in-out transform hover:scale-105 shadow-xl rounded-xl object-cover mx-auto" :src="getImage" />

                        <div class="flex flex-col rounded-xl shadow-xl p-8 w-full text-white">
                            <p class="hidden sm:block text-6xl text-center lg:text-left font-black uppercase tracking-widest mb-8">{{ comic.title }}</p>

                            <p class="uppercase tracking-widest font-bold mb-2">Published</p>
                            <p class="mb-4 font-medium">{{ formattedDate }}</p>

                            <p class="mb-4 font-medium">{{ comic.description }}</p>

                            <p class="uppercase tracking-widest font-bold mb-2">Creators</p>

                            <div class="grid grid-cols-2 sm:grid-cols-4 mb-4 gap-y-4">
                                <div v-if="comic.creators.items.some((c) => c.role === 'writer')">
                                    <p class="uppercase tracking-widest font-bold text-sm text-gray-300">Writers</p>
                                    <p class="text-sm font-medium" v-for="creator in comic.creators.items.filter((c) => c.role === 'writer')" :key="creator.name">{{creator.name}}</p>
                                </div>

                                 <div v-if="comic.creators.items.some((c) => c.role === 'colorist')">
                                    <p class="uppercase tracking-widest font-bold text-sm text-gray-300">Colorists</p>
                                    <p class="text-sm font-medium" v-for="creator in comic.creators.items.filter((c) => c.role === 'colorist')" :key="creator.name">{{creator.name}}</p>
                                </div>

                                 <div v-if="comic.creators.items.some((c) => c.role.includes('penciller'))">
                                    <p class="uppercase tracking-widest font-bold text-sm text-gray-300">Pencillers</p>
                                    <p class="text-sm font-medium" v-for="creator in comic.creators.items.filter((c) => c.role.includes('penciller'))" :key="creator.name">{{creator.name}}</p>
                                </div>

                                 <div v-if="comic.creators.items.some((c) => c.role === 'inker')">
                                    <p class="uppercase tracking-widest font-bold text-sm text-gray-300">Inkers</p>
                                    <p class="text-sm font-medium" v-for="creator in comic.creators.items.filter((c) => c.role === 'inker')" :key="creator.name">{{creator.name}}</p>
                                </div>

                            </div>

                            <p class="uppercase tracking-widest font-bold mb-2">Characters</p>

                            <div class="flex flex-col">
                                <router-link 
                                    class="mr-auto" 
                                    v-for="character in comic.characters.items" 
                                    :key="character.name" 
                                    :to="{name: 'Character', params: {id: character.resourceURI.substring(character.resourceURI.lastIndexOf('/') + 1) }}">
                                    <p class="text-sm mb-1 font-medium transition ease-in-out duration-300 hover:text-red-600 underline" >{{ character.name }}</p>
                                </router-link>
                            </div>

                        </div>

                    </div>

                </div>


            </div>

        
    </div>

</template>

<script>
import request from '../api/marvel'
import Loader from '../components/Loader.vue'
import ErrorLayout from '../components/ErrorLayout.vue'

export default {
    name: "Comic",

    components: {
        Loader,
        ErrorLayout
    },
    
    data(){
        return {
            comic: null,
            loading: true,
            error: false
        }
    },

    methods: {
        async load(){
            await request(`comics/${this.$route.params.id}`)
                        .then((response) => this.comic = response.data.data.results[0])
                        .catch(() => this.error = true)
                        .finally(() => this.loading = false)

            document.title = this.comic.title

        },

        reload(){
            this.error = false
            this.loading = true

            this.load()
        }
    },

    mounted(){
        this.load()
    },

    computed: {
        //Computed Date
        formattedDate: function () {
            let date = new Date(this.comic.dates[0].date)

            return date.toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric'
                })
        },
        
        getImage: function(){
            return this.comic.thumbnail.path.includes("image_not_available") ? "http://i.annihil.us/u/prod/marvel/i/mg/f/e0/5b51035252f36.jpg" : this.comic.thumbnail.path + '.' + this.comic.thumbnail.extension
        }
        


    }
}
</script>