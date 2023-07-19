import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"

import {useMemo} from "react"

import {Routes, Route, Navigate} from "react-router-dom"

import NewNotes from "./components/NewNotes/NewNotes"
import { useLocalStorage } from "./hooks/useLocalStorage/useLocalStorage"

import {v4 as uuidV4} from "uuid"
import NoteList from "./components/NoteList/NoteList"


export type RawNotes={
  id: string
} & RawNotesData

export type RawNotesData={
  title: string
  markdown: string
  tagIds: string[]
}

export type Note={
  id: string
} & NoteData

export type NoteData={
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag={
  id: string
  label: string
}


const App=()=>{

  const [notes,setNotes]=useLocalStorage<RawNotes[]>("NOTES",[])
  const [tags,setTags]=useLocalStorage<Tag[]>("TAGS",[])

  const notesWithTag=useMemo(()=>
    {
      return notes.map(notes=>{
        return {...notes, tags: tags.filter(tag=>notes.tagIds.includes(tag.id))}
      })
    }
  ,[notes, tags])

  const onCreateNotes=({tags ,...data}:NoteData)=>{
    setNotes(prevNotes=>{
      return [...prevNotes,{...data, id: uuidV4(), tagIds: tags.map(tag=>tag.id)}]
    })
  }

  const addTag=(tag: Tag)=>{
  setTags(prev=>[...prev,tag])
}

  return(
    <Container className="my-4">
      <Routes>
      <Route path="/" element={<NoteList notes={notesWithTag} availableTags={tags} />}></Route> 
      <Route path="/new" element={<NewNotes onSubmit={onCreateNotes} onAddTag={addTag} availableTags={tags} />}></Route>
      <Route path="/:id" >
        <Route index element={<h1>SHOW</h1>}></Route>
        <Route path="edit" element={<h1>Edit</h1>}></Route>
      </Route>
      <Route path="/*" element={<Navigate to="/new" />}></Route>
      </Routes>
  </Container>
  )
}

export default App;