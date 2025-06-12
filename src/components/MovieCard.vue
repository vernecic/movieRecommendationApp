<template>
    <div v-if="currentMovie" class="flex justify-center  mt-20 ">
       

          
          <div class=" py-5  max-w-[1072px] relative">
            <div class="flex">
            <div class="absolute top-1/2 left-2 text-white cursor-pointer" @click="prevMovie"><img src="../assets/left.svg" alt=""></div>
            <div class="px-20 flex gap-5 flex-col sm:flex-row items-center md:items-start">

           
        <img :src="`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`" alt="" class="w-64 sm:w-82 rounded-md">
        <div class="flex flex-col text-left">
                <h1 class="text-white text-3xl">{{ currentMovie.title }}</h1>
                <p class="mt-10 text-white">{{ currentMovie.overview }}</p>
                <div class="mt-10">
                    <p class="text-xl text-white"><span class="uppercase">Average rating: </span>{{ currentMovie.vote_average.toFixed(2) }}</p>
                   <div class="mt-10"> <span class="uppercase bg-slate-500 text-xl text-white p-2 rounded-md">Release Date: {{ currentMovie.release_date }}</span></div>
                </div></div>
                </div> <div class="absolute top-1/2 right-2 text-white cursor-pointer" @click="nextMovie"><img src="../assets/right.svg" alt=""></div> </div>
           </div>
    
    </div>
</template>

<script setup>
import { computed, ref} from 'vue'
import { watchEffect } from 'vue'

const props = defineProps({
    matchingMovies: Array
})
const filtered = computed(()=>{
    return props.matchingMovies.sort((a, b) => b.vote_average - a.vote_average)})

const currentIndex = ref(0)
const currentMovie = computed(()=>{

    return filtered.value[currentIndex.value]

})

// functions

function nextMovie(){
    if(currentIndex.value < filtered.value.length - 1 ){
 currentIndex.value++
    }  else {
        currentIndex.value = 0
    }
    
}

function prevMovie(){
    if(currentIndex.value > 0){
        currentIndex.value--
    }
}


watchEffect(()=>{
    console.log('Movie: ', currentMovie.value)
})


</script>