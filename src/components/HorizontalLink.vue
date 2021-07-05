<template>
    <router-link
        class="text-white uppercase tracking-widest text-sm font-bold p-2 hover:text-red-500 transition duration-200 ease-in-out"
        :to="url"
        v-slot="{ href, route }"
        >
        <a class="" :href="href">{{ route.name }}</a>
    </router-link>
</template>

<script>
export default {
    name: "HorizontalLink",
    props: {
        url: String
    }
}
</script>