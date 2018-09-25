document.addEventListener("DOMContentLoaded",()=>{
   const notesContainer=document.getElementById('notes-container')
   const noteBody=document.getElementById('note-body')
   const createNote=document.getElementById('create-note')
   const noteForm=document.getElementById('note-form')
   const createNoteButton=document.getElementById('create-note-button')
   let currentUserId;
     fetch("http://localhost:3000/api/v1/users")
     .then(response=>response.json())
     .then(data=>{
       currentUserId=data[0].id
       notesContainer.innerHTML=data[0].notes.map(note=>{
         return `<h1 id=${note.id}>${note.title}</h1>`
       }).join("")
     })

     notesContainer.addEventListener("click",e=>{
       e.preventDefault()
       const id=e.target.id
       if (!isNaN(id)) {
         fetch(`http://localhost:3000/api/v1/notes/${id}`)
         .then(response=>response.json())
         .then(data=>{
           noteBody.innerHTML=`<h1>${data.title}</h1><p>${data.body}</p>
            <button class="edit" id="edit-note-${data.id}" type="button" name="button">edit note</button>
            <button class="delete" id="delete-note-${data.id}" type="button" name="button">delete note</button>`
         })
       }
     })

     console.log(noteForm);
     createNoteButton.addEventListener("click",e=>{
       e.preventDefault()
       console.log(e);
       const title=document.getElementById('title').value
       const body=document.getElementById('body').value
       fetch("http://localhost:3000/api/v1/notes",{
         method:"POST",
         headers:{
           "Accept":"application/json",
           "Content-Type":"application/json"
         },
         body:JSON.stringify({title:title,body:body})
       }).then(response=>response.json())
       .then(data=>{
         notesContainer.style.display="block"
         notesContainer.innerHTML+=`<h1 id=${data.id}>${data.title}</h1>`
         noteForm.style.display="none"
       })
     })

     createNote.addEventListener("click",e=>{
       e.preventDefault()
       notesContainer.style.display="none"
       noteForm.style.display="block"

     })//end of create note

     noteBody.addEventListener("click",e=>{
       e.preventDefault()
       const noteId=e.target.id.split("-")[2]
       if (e.target.className==="edit") {
         const noteTitleContent=noteBody.querySelector("h1").innerText
         const noteBodyContent=noteBody.querySelector("p").innerText
         notesContainer.style.display="none"
         noteBody.innerHTML=`<form id="edit-note-form"  class="" action="index.html" method="post">
           <input type="text" id="title" value="${noteTitleContent}">
           <textarea  id="body" value="">${noteBodyContent}</textarea>
           <input type="submit" id="edit-note" name="" value="submit">
         </form>`
         const noteForm=document.getElementById('edit-note-form')
         const editForm=document.getElementById('edit-note')
         editForm.addEventListener("click",e=>{
           e.preventDefault()
           console.log(e);
           const noteTitleContent=noteForm.querySelector("#title").value
           const noteBodyContent=noteForm.querySelector("#body").value
           fetch(`http://localhost:3000/api/v1/notes/${noteId}`,{
             method:"PATCH",
             headers:{
               "Accept":"application/json",
               "Content-Type":"application/json"
             },
             body:JSON.stringify({title:noteTitleContent,body:noteBodyContent})
           }).then(response=>response.json())
             .then(data=>{
               notesContainer.style.display="block"
               notesContainer.getElementsByTagName('h1')[data.id-1].innerText=data.title
               noteForm.style.display="none"
           })
         })


       }//end of edit
       else if (e.target.className=="delete") {
         const noteH1=document.getElementById(noteId)
         fetch(`http://localhost:3000/api/v1/notes/${noteId}`,{
             method:"DELETE"}).then(res=>res.json())
             .then(data=>{
               noteBody.innerHTML=""
                notesContainer.removeChild(noteH1)})
       }
     })//end of edit or delete


})
