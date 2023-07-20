import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";

import { useMemo } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import { useLocalStorage } from "./hooks/useLocalStorage/useLocalStorage";

import { v4 as uuidV4 } from "uuid";
import NoteList from "./components/NoteList/NoteList";
import NotesLayout from "./components/NotesLayeout/NotesLayout";
import Note from "./components/Note/Note";
import NewNote from "./components/NewNote/NewNote";
import EditNote from "./components/EditNote/EditNote";

export type RawNotes = {
  id: string;
} & RawNotesData;

export type RawNotesData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type Note = {
  id: string;
} & NoteData;

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

const App = () => {
  const [notes, setNotes] = useLocalStorage<RawNotes[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTag = useMemo(() => {
    return notes.map((notes) => {
      return {
        ...notes,
        tags: tags.filter((tag) => notes.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  const onCreateNote = ({ tags, ...data }: NoteData) => {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  };

  const onUpdateNote = (id: string, { tags, ...data }: NoteData) => {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            ...data,
            tagIds: tags.map((tag) => tag.id),
          };
        } else {
          return note;
        }
      });
    });
  };

  const onDeleteNote = (id: string) => {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  };

  const addTag = (tag: Tag) => {
    setTags((prev) => [...prev, tag]);
  };

  const updateTag = (id: string, label: string) => {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  };

  const deleteTag = (id: string) => {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  };

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={notesWithTag}
              availableTags={tags}
              onDeleteTag={deleteTag}
              onUpdateTag={updateTag}
            />
          }
        ></Route>
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        ></Route>
        <Route path="/:id" element={<NotesLayout notes={notesWithTag} />}>
          <Route index element={<Note onDelete={onDeleteNote} />}></Route>
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          ></Route>
        </Route>
        <Route path="/*" element={<Navigate to="/new" />}></Route>
      </Routes>
    </Container>
  );
};

export default App;
