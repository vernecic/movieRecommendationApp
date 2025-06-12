<template>
     <div >
        <div class="text-center sm:atext-left ">
        <div class="font-semibold mb-5 bg-slate-500 py-6 px-4 rounded-md flex flex-col justify-center items-center ">
            

          
        <h1 class="text-2xl md:text-3xl lg:text-4xl 2 mb-3 font-bold uppercase text-white ">Movie recommender</h1>
 
        <p class="text-white text-sm"> </p>    </div>
            <div>
<div class="flex items-center justify-center flex-col ">
   
                      
                        <h1 class=" text-lg  font-semibold text-white  mb-5">Select 1-4 categories</h1>
                 

    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-2 sm:p-0 " >
    <div v-for="genre in allGenres" :key="genre.id" class="text-white font-semibold  py-4 px-8 text-base uppercase  rounded-md text-center truncate shadow-lg cursor-pointer " @click="pickGenre(genre)" :class="pickedGenres?.includes(genre.name) ? 'bg-emerald-900' : 'bg-slate-500'">
        {{ genre.name }}
           
    </div>
    
</div>

        </div>
    </div>
     <div class="mt-10 sm:flex items-center  sm:justify-center">
        <button class="bg-emerald-800 text-white p-4 rounded-xl uppercase font-semibold cursor-pointer" @click="getMovie">Get movies</button>
    </div>
    <div v-if="isError" class="mt-10 text-red-500 uppercase text-base ">
{{ errorPoruka }}
    </div>
     <div>
        <MovieCard :matchingMovies="matchingMovies"></MovieCard>
     </div>
 
    </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MovieCard from '@/components/MovieCard.vue';

const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

const isError = ref(false)
const errorPoruka = ref('')

const allGenres = ref([])
const pickedGenres = ref([])



const matchingMovies = ref([])




function pickGenre(genre){
   if(!pickedGenres.value.includes(genre.name)) {
        if(pickedGenres.value.length < 4){
 pickedGenres.value.push(genre.name)
   } 

} else {   

    const index = pickedGenres.value.indexOf(genre.name)
   pickedGenres.value.splice(index, 1)
   }
    
   

}



const getGenres = async () =>{
    try {
        const res = await fetch('https://api.themoviedb.org/3/genre/movie/list',{
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        })
        if(!res.ok){
            throw new Error(`HTTP Error: ${res.status}`)
        }
        const data = await res.json()
        
        allGenres.value = data.genres
    }  catch (e){
        console.error('Error', e)
    }
}
const findMovies = async (genreIds) =>{
    try{

   
    const genreIdsString = genreIds.join(',')
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreIdsString}`, {
    method: 'GET',
    headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
    }
})  
    if(!res.ok){
    throw new Error(`HTTP Error: ${res.status}`)
    }
    const moviesData = await res.json()
   /*  console.log(moviesData) */
    matchingMovies.value = moviesData.results
    /* console.log(matchingMovies.value) */
}   catch(e){
    console.error(e)

}
 }

function getMovie(){
    if(pickedGenres.value.length === 0){
        isError.value = true;
        errorPoruka.value = 'No categories selected'
        return
    } else {
        isError.value = false
        
        const genreIds = pickedGenres.value.map(genreName =>{
        const matchingGenre = allGenres.value.find(genre => genre.name === genreName)
        return matchingGenre.id 
        })
       /* console.log(genreIds) */

      // call
      try{
        findMovies(genreIds)

      } catch(e){
        console.error(e)
    } 
    }
}

onMounted(()=>{
    getGenres()
})
</script>