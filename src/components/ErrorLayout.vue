<template>
    <div>
        <p class="font-bold text-2xl mb-4 text-white">Encountered an error. Please try again...</p>
        <button 
        @click="onClick"
        class="text-white mr-auto px-4 py-2 mb-4 bg-red-600 font-bold shadow-lg rounded transition ease-in-out duration-300 hover:opacity-70 tracking-widest">TRY AGAIN</button>
    </div>
</template>


<script>
export default {
    name: "ErrorLayout",
    props: {
        onClick: Function
    }
}
</script>