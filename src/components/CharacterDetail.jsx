import { ArrowUpCircleIcon } from "@heroicons/react/24/outline"

import { useEffect, useState , } from "react"
import axios from "axios"
import Loader from "./Loader";
import toast from "react-hot-toast";

function CharacterDetail({selectedId ,onAddFavourite ,isAddToFav}) {
const[character,setCharacter]=useState(null);
const[isLoading,setIsLoading]=useState(false);
const[episodes,setEpisodes]=useState([]);

  useEffect(()=>{
    async function fetchData(){
     try {
      setIsLoading(true)
       const {data}=await axios.get(`https://rickandmortyapi.com/api/character/${selectedId}`);
       setCharacter(data);

      const episodesId= data.episode.map((e)=> e.split("/").at(-1));
      const{data: episodeData}=await axios.get(`https://rickandmortyapi.com/api/episode/${episodesId}`)
      //console.log(episodeData)
      setEpisodes([episodeData].flat().slice(0,5));
     } catch (error) {
      toast.error(error.response.data.error)
     }
     finally{
      setIsLoading(false);
     }
    }
   if(selectedId) fetchData();
  },[selectedId])

  if(isLoading)return <div><Loader/></div>
  if(!character || !selectedId)return <div  style={{flex:1,color:"white"}}>please select a character.</div>



  return (
    <div style={{flex:1}}>
    <CharacterSubInfo character={character} onAddFavourite={onAddFavourite} isAddToFav={isAddToFav}/>
   <EpisodeList episodes={episodes}/>
    </div>
  )
}

export default CharacterDetail;

function CharacterSubInfo({character,onAddFavourite ,isAddToFav}){
  return(
<div className="character-detail">
    <img src={character.image} alt={character.name} className="character-detail__img" />
    <div className="character-detail__info">
      <h3 className="name">
        <span>{character.gender === "Male" ? "👨🏻" : "👩🏻"}</span>
        <span className=""> {character.name}</span>
      </h3>
      <div className="info">
        <span className={`status ${character.status === "Dead" ? "red" :""}`}></span>
        <span> {character.status}</span>
        <span> - {character.species}</span>
      </div>
      <div className="location">
        <p>last known location :</p>
        <p>{character.location.name}</p>
      </div>
      <div className="actions">
       {
        isAddToFav ? <p>Added to your Favourite ✅</p> :  <button className="btn btn--primary" onClick={()=>onAddFavourite(character)}>
        Add to Favorite
      </button>
       }
      </div>
    </div>
    </div>
  )
}

function EpisodeList({episodes}){

const[sortBy,setSortBy]=useState(true);
//true =>earliest=>asc
let sortedEpisodes;
if(sortBy){
  sortedEpisodes=[...episodes].sort((a,b)=>new Date(a.created) - new Date(b.created))
}else{
  sortedEpisodes=[...episodes].sort((a,b)=>new Date(b.created) - new Date(a.created))
}

return(
  <div className="character-episodes">
  <div className="title">
    <h2>List of episodes :</h2>
    <button>
      <ArrowUpCircleIcon 
      className="icon" 
      onClick={()=>setSortBy(is=>!is)}
      style={{rotate:sortBy ? "0deg" : "180deg"}}/>
    </button>
  </div>
  <ul>
    {sortedEpisodes.map((item,index) =>(
    <li key={item.id} >
    <div>
     {String(index+1).padStart(2,"0")} - {item.episode} : <strong>{item.name}</strong></div>
    <div className="badge badge--secondary">{item.air_date}</div>
    </li>))}
  </ul>
</div>
)
}