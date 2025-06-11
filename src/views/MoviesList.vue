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
    <div class="flex flex-col gap-4  md:grid md:grid-cols-4 mt-5 space-y-4 sm:space-y-0 sm:p-5 xl:p-20">
        <div v-for="(movie, index) in filtered" :key="index" class="text-white  md:p-4 bg-linear-to-b from-slate-400 to-slate-600 rounded-lg ">
            <div class="flex sm:flex-row flex-col   sm:text-left overflow-hidden text-wrap md:gap-5  md:flex-col md:items-center ">

           <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" alt="" class="scale-90 md:w-64 rounded-lg">
           <div class="p-2 md:p-4">
            <h1 class="text-3xl md:text-4xl text-left  hover:text-blue-400 cursor-pointer">{{ movie.title }}</h1>
            <div class="border-b-2 py-4 "></div>
     
            
            
        <div class="text-left">
    <h1 class="text-lg uppercase mt-2 md:mt-10 md:text-xl mb-2" >Overview</h1>             
<p class="text-sm md:text-base" >{{ movie.overview }}</p> 
<div class="text-base">
<p class="mt-5 "><span class="uppercase bg-slate-400  p-2 rounded-md">Release date: {{ movie.release_date }} </span></p>
<p class="mt-5 mb-5 sm:mb-0"><span class="uppercase">Average Rating: </span>{{ (movie.vote_average).toFixed(1) }} ★</p></div>
                </div>
                </div>
             </div>
        </div>
    </div>
    </div>
   </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

const isError = ref(false)
const errorPoruka = ref('')

const allGenres = ref([])
const pickedGenres = ref([])



const matchingMovies = ref([])

const filtered = computed(()=>{
    return matchingMovies.value.sort((a, b) => b.vote_average - a.vote_average)})


function pickGenre(genre){
   if(!pickedGenres.value.includes(genre.name)) {
        if(pickedGenres.value.length < 4){
 pickedGenres.value.push(genre.name)
   } 

} else {   

    const index = pickedGenres.value.indexOf(genre.name)
   pickedGenres.value.splice(index, 1)
   }
    
   
    console.log(pickedGenres.value)
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
        console.log(data)
        allGenres.value = data.genres
    }  catch (e){
        console.log('Error', e)
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
    console.log(moviesData)
    matchingMovies.value = moviesData.results
    console.log(matchingMovies.value)
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
       console.log(genreIds)

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