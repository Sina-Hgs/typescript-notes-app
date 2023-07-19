import { NoteData, Tag } from "../../App"
import NoteForm from "../NoteForm/NoteForm"

type NewNotesProps={
  onSubmit: (data: NoteData)=>void
  onAddTag: (tag: Tag)=>void
  availableTags: Tag[]
}

const NewNotes = ({onSubmit, onAddTag, availableTags}: NewNotesProps) => {
  return (
    <>
    <h1 className="mb-4">NewNotes</h1>
    <NoteForm onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags} />
    </>
  )
}

export default NewNotes