const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes');
const router = express.Router()

// ROUTE 1:  Getting all notes data
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Notes.find({user: req.user.id})
        res.json(notes)
        
    }catch(error){
        console.log(error.message)
        res.status(500).send("Some Error occures")
      }
})

// ROUTE 2:  Creating a Note
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({min: 4}),
    body('description', 'description must be atleast 5 characters').isLength({min: 5}),
] ,async (req, res) => {

    try {
        
    

    const { title, description, tag} = req.body
    // If there are errors, return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note = new Notes({
        title, description, tag, user: req.user.id
    })
    const savedNote = await note.save()
    res.json(savedNote)
    }catch(error){
        console.log(error.message)
        res.status(500).send("Some Error occures")
      }
})

// ROUTE 3:  Updating a Note
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    const {title, description, tag} = req.body
    try {
    // Create a newNote object
    const newNote = {}
    if(title){newNote.title = title}
    if(description){newNote.description = description}
    if(tag){newNote.tag = tag }

    // Find the note to be updated and update it
    let note = await Notes.findById(req.params.id)
    console.log(note)
    if(!note){return res.status(404).send("Note Found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Note Allowed")
    }

    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
    res.json({note})
} catch(error){
    console.log(error.message)
    res.status(500).send("Some Error occures")
  }

})

// ROUTE 4: Deleting a note
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    
    try {
    // Find the note to be delete and delete it
    let note = await Notes.findById(req.params.id)
    if(!note){return res.status(404).send("Note Found")}

    // Allow deletion only if user owns this Note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Note Allowed")
    }
    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"Success": "Note has been deleted", note: note})
} catch(error){
    console.log(error.message)
    res.status(500).send("Some Error occures")
  }

})
module.exports = router