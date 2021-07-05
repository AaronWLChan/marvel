<template>
    <router-link :to="{ name: 'Comic', params: {id: comic.id} }" >

        <div class="flex flex-col overflow-hidden items-center transition duration-300 ease-in-out transform hover:-translate-y-1 hover:text-red-600">   
            <img 
                class="w-48 h-48 sm:h-auto shadow-xl rounded object-cover duration-300 ease-in-out "
                :src="getImage"/>

            <p class="break-words text-center text-xs mt-2 font-semibold">{{ comic.title.length > 35 ? comic.title.slice(0, 35) + "..." : comic.title }}</p>
            <p class="truncate text-center text-xs">{{ comic.creators }}</p>

        </div>

    </router-link>
</template>

<script>
export default {
    name: "Comic",
    
    props: {
        comic: Object
    },
    
    computed: {
        getImage: function(){
            return this.comic.imageURL.includes("image_not_available") ? "http://i.annihil.us/u/prod/marvel/i/mg/f/e0/5b51035252f36.jpg" : this.comic.imageURL
        }
    }
}
</script>