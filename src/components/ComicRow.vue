<template>
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 ">
        <comic v-for="comic in comics" :key="comic.id" :comic="comic"/>   
    </div>
</template>

<script>
import axios from 'axios'
import Comic from './Comic.vue'
import request from '../api/marvel'

export default {
    name: "ComicRow",

    components: {
        Comic
    },
    
    data() {
        return {
            comics: []
        }
    },

    props: {
        //Given a slice of 5 
        comicResources: Array
    },
    
    mounted(){
        //For each url, given get image and id
        let requests = this.comicResources.map((resource) => {

            let comicID = resource.resourceURI.substring(resource.resourceURI.lastIndexOf('/') + 1)

            console.log("Comic ID: " + comicID)

            return request(`comics/${comicID}`)            
        })

        axios.all(requests)
            .then(axios.spread((...responses) => {

                this.comics = responses.map((response) => {

                    console.log(response)

                    let comic = response.data.data.results[0]

                    let creators = comic.creators.items.slice(0, 2).map((creator) => {
                        return creator.name.substring(creator.name.lastIndexOf(" ") + 1)
                    })


                    return {
                        id: comic.id,
                        title: comic.title,
                        creators: creators.toString(),
                        imageURL: comic.thumbnail.path + "." + comic.thumbnail.extension
                    }

                })

            }))


    }
}
</script>