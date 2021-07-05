<template>

    <router-link :to="{ name: 'Character', params: {id: character.id} }" v-slot="{ href, navigate }">
        <a class="flex flex-col overflow-hidden rounded-b shadow-xl transition duration-300 ease-in-out transform hover:scale-105" :href="href" @click="navigate">
            <img class="h-64 object-cover border-b-4 border-red-600" :src="getImage"/>

            <div class="bg-black">
                <p class="text-white truncate uppercase text-sm text-center tracking-widest font-semibold pt-4 p-4">{{ character.name }}</p>
            </div>
        </a>
    </router-link>
</template>

<script>

export default {
    name:"CharacterCard",
    props:{
        character: Object
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
    }
   

}
</script>