import { defineStore } from 'pinia'
import { ref, computed } from 'vue' 

export const useMovieStore = defineStore('movies', ()=>{
    const allGenres = ref([])
    const pickedGenres = ref([])

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
  return {
    allGenres,
    pickedGenres,
    pickGenre
  }
})