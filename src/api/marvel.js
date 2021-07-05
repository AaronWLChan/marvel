import axios from 'axios'

const BASE_URL = "https://gateway.marvel.com:443/v1/public"

function queryString(obj){
    return Object.entries(obj)
        .map(([index, val]) => `${index}=${val}`)
        .join('&')
}

export default async function request(url, params = {}){

    params = {
        apikey: process.env.VUE_APP_PUBLIC_KEY,
        ...params
    }

    let query = `${BASE_URL}/${url}?${queryString(params)}`

    return await axios.get(query).catch((error) => {

        if (error.response){
            console.log(error.response.data)
            console.log(error.response.status);
            console.log(error.response.headers);
        }

        else if (error.request){
            //Request made but no response
            console.log(error.request)
        }

        else {
            //Non API-related error
            console.log(error.message)
        }

    }) 

}

