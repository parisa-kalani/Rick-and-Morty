
import {  useState } from "react";
import { allCharacters } from "../data/data";
import "./App.css";
import CharacterDetail from "./components/CharacterDetail";
import CharacterList from "./Components/CharacterList";
import Navbar, { Favourites, Search, SearchResult } from "./Components/Navbar";
import { useEffect } from "react";
import  { Toaster } from "react-hot-toast";

import Modal from "./components/Modal";
import useCharacters from "./hooks/useCharacters";
import useLocalStorage from "./hooks/useLocalStorage";



function App(){


const[query,setQuery]=useState("");
const{isLoading,characters}=useCharacters(query);
const[selectedId,setSelectedId]=useState(null);
const[favourites,setFavourites]=useLocalStorage("FAVOURITES",[])






const handleSelectCharacter=(id)=>{
setSelectedId(prevId => prevId===id ? null : id);
}

const handleFavourite= (char)=>{
setFavourites((prevFav)=>[...prevFav,char]);
}

const isAddToFav=favourites.map(fav=>fav.id).includes(selectedId);


const handleDeleteFavourites=(id)=>{
  setFavourites(favourites.filter(fav => fav.id !== id ))
}

return <div className="app">
    <Toaster/>
    <Modal/>
    <Navbar >
    <Search query={query} setQuery={setQuery}/>
    <SearchResult numOfResult={characters.length}/> 
    <Favourites favourites={favourites}  onDeleteFavourites={handleDeleteFavourites} />
    </Navbar>
    <Main>
         <CharacterList 
         selectedId={selectedId}
         characters={characters} 
         isLoading={isLoading}
         onSelectCharacter={handleSelectCharacter}/>
         <CharacterDetail 
         selectedId={selectedId} 
         onAddFavourite={handleFavourite}
         isAddToFav={isAddToFav}/>
    </Main>
</div>
}
export default App;


function Main({children}){
    return(
<div className="main">
   {children}
</div>
    )
}