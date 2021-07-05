<template>
    <div class="container mx-auto ">

            <error-layout v-if="error" :onClick="reload"/>

            <div v-else>

                 <div v-if="loading" class="flex justify-center">
                    <loader/>
                </div>

                <div v-else>

                    <div class="flex flex-col xl:flex-row gap-8 px-8"  >

                        <p class="sm:hidden text-3xl text-center font-black uppercase tracking-widest mb-2 text-white">{{ character.name }}</p>

                        <img class="w-72 sm:w-96 h-auto shadow-xl transition duration-500 ease-in-out transform hover:scale-105 rounded-xl object-cover mx-auto" :src="getImage" />

                        <div class="rounded-xl shadow-xl p-8 w-full text-white">
                            <p class="hidden sm:block sm:text-4xl text-center xl:text-left xl:text-7xl font-black uppercase tracking-widest mb-8">{{ character.name }}</p>
                            
                            <div class="flex flex-row mb-4 items-center xl:justify-start justify-center">
                                <a class="uppercase underline tracking-widest font-bold mr-4 hover:text-red-500 transition duration-200 ease-in-out" 
                                    :href="url.url"
                                    v-for="url in character.urls" 
                                    :key="url.type">
                                    {{ url.type }}
                                </a>
                            </div>
                            
                            <p class="mb-8 font-medium">{{ character.description }}</p>

                            <p class="uppercase tracking-widest font-bold text-2xl mb-4">Comic Appearances</p>

                            <comic-row :comicResources="character.comics.items.slice(0, 5)"/>

                        </div>

                    </div>

                </div>


            </div>

        
    </div>


</template>



<script>
import request from '../api/marvel'
import ComicRow from '../components/ComicRow.vue'
import Loader from '../components/Loader.vue'
import ErrorLayout from '../components/ErrorLayout.vue'

export default {
    name: "Character",

    data(){
        return {
            character: null,
            loading: true,
            error: false
        }
    },

    components: {
        ComicRow, 
        Loader,
        ErrorLayout
    },

    methods: {

        async load(){
            await request(`characters/${this.$route.params.id}`)
                .then((response) => {this.character = response.data.data.results[0]})
                .catch(() => this.error = true)
                .finally(() => this.loading = false)    

            document.title = this.character.name

        },

        reload(){
            this.error = false
            this.loading = true

            this.load()
            
        }

    },

     computed: {
        getImage(){

            if (this.character.thumbnail.path.includes("image_not_available")){
                return "https://i.pinimg.com/originals/e4/bf/e1/e4bfe10e6603a3321104a18bd3170c06.jpg"
            }

            else {
                return this.character.thumbnail.path + '.' + this.character.thumbnail.extension
            }

        }
    },
   

    mounted(){
        this.load()

    }


}
</script>