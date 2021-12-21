import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import noteContext from '../context/notes/noteContext'
import AddNote from './AddNote'
import Noteitem from './Noteitem'

const Notes = ({ showAlert }) => {
    const context = useContext(noteContext)
    let history = useHistory()
    const { notes, getNotes, editNote } = context
    const [note, setNote] = useState({ etitle: "", edescription: "", etag: "" })
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes()
        } else {
            history.push('/login')
        }
        // eslint-disable-next-line 
    }, [])

    const ref = useRef(null)
    const refClose = useRef(null)

    const updateNote = (currentNote) => {
        ref.current.click()
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag })
    }


    const handleClick = (e) => {
        console.log("Updating the note", note)
        editNote(note.id, note.etitle, note.edescription, note.etag)
        refClose.current.click()
        showAlert("Updated Successfully", "success")

    }
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <>
            <AddNote showAlert={showAlert} />
            <button type="button" className='d-none' data-bs-toggle="modal" data-bs-target="#exampleModal" ref={ref}>
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" value={note.etitle} aria-describedby="emailHelp" name='etitle' onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name='edescription' value={note.edescription} onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" value={note.etag} id="etag" name='etag' onChange={onChange} />
                                </div>
                            </form>

                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" disabled={note.etitle.length < 5 || note.edescription.length < 5} type="submit" onClick={handleClick}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row my-3'>
                <h1>Your Notes</h1>
                <div className='container mx-2'>
                    {notes.length === 0 && 'No Notes '}
                </div>
                {notes.map((note) => {
                    return <Noteitem updateNote={updateNote} showAlert={showAlert} key={note._id} note={note} />
                })}
            </div>
        </>
    )
}

export default Notes
