<template>
    <router-link
        class="text-white uppercase tracking-widest text-sm font-bold px-4 hover:text-red-500 transition duration-200 ease-in-out" 
        :to="url"
        v-slot="{ href, route }"
        >
        <a  :href="href">{{ route.name }}</a>
    </router-link>
</template>

<script>
export default {
    name: "Link",
    props: {
        url: String
    }
}
</script>