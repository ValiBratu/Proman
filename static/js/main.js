
// This function is to initialize the application
function init() {
    // init data
    loadBoards();
}


function getBoards() {
        // the boards are retrieved and then the callback function is called with the boards
    //         // Here we use an arrow function to keep the value of 'this' on dataHandler.
    //         //    if we would use function(){...} here, the value of 'this' would change.
            fetch('/get-boards')
                .then(data => data.json())
                .then(data => {
                    // let results = data.boards;
                    // console.log(data['board);
                    showBoards(data);
            })
            .catch(error => console.log(error));
    // let response = await fetch('/get-boards');
    // let data = await response.json();
    // showBoards(data);
    // for (let result of results) {
    //     list.innerHTML += populateCard(result);
    // }
    }

function showBoards(boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also;
        let boardsContainer = document.querySelector('#accordion');
        for(let i =0;i<boards.length;i++){
            let newboard = document.createElement('div');
            newboard.className = "card";
            newboard.classList.add("board")
            newboard.setAttribute('id',`${boards[i].id}`);
            // newboard.classList.add("board");
            // newboard.innerHTML = `${boards[i].title}`;
            newboard.innerHTML =`<div class="card-header" id="headingBoard${boards[i].id}" aria-expanded="false" >
                                <h5 class="mb-0"><input type="text" value="${boards[i].title}" onchange="editboartitle(${boards[i].id})" id="board${boards[i].id}-title"></h5>
        <button class="board-toggle" data-toggle="collapse" data-target="#board${boards[i].id}" aria-expanded="false" aria-controls="collapse${boards[i].id}" onclick="getCardsforBoard(${ boards[i].id })" style="background-color: #0062cc"><i class="fas fa-chevron-down">Show Details</i></button>
    </div>

    <div id="board${boards[i].id}" class="collapse" aria-labelledby="headingBoard${boards[i].id}" data-parent="#accordion">
      <div class="card-body board${boards[i].id}">
                <label for="new-card-board${boards[i].id}" >New card name: </label>
                <input type="text" maxlength="20" name="new-card-board${boards[i].id}" id="new-card-board${boards[i].id}">
                <button type="button" class="btn btn-success" onclick="addcard(${boards[i].id})">Add new card</button> <button type="button" class="btn btn-danger" onclick="removeboard(${boards[i].id})">Remove Board</button>
        <div class="board-columns">
                <div class="board-column">
                    <div class="board-column-title">New</div>
                    <div class="board${boards[i].id}-column-content-new board-column-content" status-id="1" style="min-height: 120px; border: solid grey 2px; border-radius: 5px">
                    </div>
                </div>
                <div class="board-column">
                    <div class="board-column-title">In Progress</div>
                    <div class="board${boards[i].id}-column-content-inprogress board-column-content"" status-id="2" style="min-height: 120px; border: solid grey 2px; border-radius: 5px">
                    </div>
                </div>
                <div class="board-column">
                    <div class="board-column-title">Testing</div>
                    <div class="board${boards[i].id}-column-content-testing board-column-content"" status-id="3" style="min-height: 120px; border: solid grey 2px; border-radius: 5px">
                    </div>
                </div>
                <div class="board-column">
                    <div class="board-column-title">Done</div>
                    <div class="board${boards[i].id}-column-content-done board-column-content"" status-id="4" style="min-height: 120px; border: solid grey 2px; border-radius: 5px">
                    </div>
                </div>
            </div>
      </div>
    </div>`
            boardsContainer.appendChild(newboard);
            let breakline = document.createElement('br');
            boardsContainer.appendChild(breakline);
        }
    }

function  loadBoards() {
        // retrieves boards and makes showBoards called
        getBoards();
    }

function getCardsforBoard(boardid){
    fetch(`/get-cards/${boardid}`)
                .then(data => data.json())
                .then(data => {
                    createCards(data, boardid);
            })
            .catch(error => console.log(error));
}

function createCards(cards, boardid){
    let newcolumn = document.querySelector(`.board${boardid}-column-content-new`);
    let inprogresscol = document.querySelector(`.board${boardid}-column-content-inprogress`);
    let testingcol = document.querySelector(`.board${boardid}-column-content-testing`);
    let donecol = document.querySelector(`.board${boardid}-column-content-done`);
    if (newcolumn.hasChildNodes()){
        while (newcolumn.lastElementChild){
            newcolumn.removeChild(newcolumn.lastElementChild);
        }
    }
    if (inprogresscol.hasChildNodes()){
        while (inprogresscol.lastElementChild){
            inprogresscol.removeChild(inprogresscol.lastElementChild);
        }
    }
    if (testingcol.hasChildNodes()){
        while (testingcol.lastElementChild){
            testingcol.removeChild(testingcol.lastElementChild);
        }
    }
    if (donecol.hasChildNodes()){
        while (donecol.lastElementChild){
            donecol.removeChild(donecol.lastElementChild);
        }
    }

    for (let card of cards){
        if (card.status_id == 1){
            let newcard = document.createElement('div');
            newcard.classList.add("card");
            newcard.setAttribute('card-order',`${card.card_order}`);
            newcard.setAttribute('card-id',`${card.id}`);
            newcard.setAttribute('draggable','true');
            newcard.addEventListener('dragstart', function(){
                eventlistener();
            });

            newcard.innerHTML = `<div class="card-remove"><img src="https://freepngimg.com/thumb/trash_can/1-2-trash-can-transparent-thumb.png"  onclick="delete_card(${card.id})" ></div>
                            <div class="card-title"><input type="text" value="${card.title}" onchange="editcard(${card.id})" id="card${card.id}-title"></div>`;
            newcolumn.appendChild(newcard);


        } else if (card.status_id == 2){
            let newcard = document.createElement('div');
            newcard.classList.add("card");
            newcard.setAttribute('card-order',`${card.card_order}`);
            newcard.setAttribute('card-id',`${card.id}`);
            newcard.setAttribute('draggable','true');
            newcard.addEventListener('dragstart', function(){
                eventlistener(card.id);
            });
            newcard.innerHTML = `<div class="card-remove"><img src="https://freepngimg.com/thumb/trash_can/1-2-trash-can-transparent-thumb.png" onclick="delete_card(${card.id})" ></div>
                            <div class="card-title"><input type="text" value="${card.title}" onchange="editcard(${card.id})" id="card${card.id}-title"></div>`;
            inprogresscol.appendChild(newcard);
        } else if (card.status_id == 3){
            let newcard = document.createElement('div');
            newcard.classList.add("card");
            newcard.setAttribute('card-order',`${card.card_order}`);
            newcard.setAttribute('card-id',`${card.id}`);
            newcard.setAttribute('draggable','true');
            newcard.addEventListener('dragstart', function(){
                eventlistener(card.id);
            });
            newcard.innerHTML = `<div class="card-remove"><img src="https://freepngimg.com/thumb/trash_can/1-2-trash-can-transparent-thumb.png" onclick="delete_card(${card.id})"></div>
                            <div class="card-title"><input type="text" value="${card.title}" onchange="editcard(${card.id})" id="card${card.id}-title"></div>`;
            testingcol.appendChild(newcard);
        } else {
            let newcard = document.createElement('div');
            newcard.classList.add("card");
            newcard.setAttribute('card-order',`${card.card_order}`);
            newcard.setAttribute('card-id',`${card.id}`);
            newcard.setAttribute('draggable','true');
            newcard.addEventListener('dragstart', function(){
                eventlistener(card.id);
            });
            newcard.innerHTML = `<div class="card-remove"><img src="https://freepngimg.com/thumb/trash_can/1-2-trash-can-transparent-thumb.png" onclick="delete_card(${card.id})" ></div>
                            <div class="card-title"><input type="text" value="${card.title}" onchange="editcard(${card.id})" id="card${card.id}-title"></div>`;
            donecol.appendChild(newcard);
        }
    }
}

function addcard(boardId) {
    let cardname = document.getElementById(`new-card-board${boardId}`);
    let testdata = {
        title: cardname.value,
        board_id: boardId,
        status_id: 1
    }
    fetch('/add-card',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify( testdata )
    })
        .then( data=>data.json() )
        .then( data=>{
            let newcolumn = document.querySelector(`.board${data.board_id}-column-content-new`);
            let newcard = document.createElement('div');
            newcard.classList.add("card");
            newcard.setAttribute('card-order',`${data.card_order}`);
            newcard.setAttribute('card-id',`${data.id}`);
            newcard.setAttribute('draggable','true');
            newcard.addEventListener('dragstart', function(){
                eventlistener(data.id);
            });
            newcard.innerHTML = `<div class="card-remove"><img src="https://freepngimg.com/thumb/trash_can/1-2-trash-can-transparent-thumb.png"  onclick="delete_card(${data.id})" ></div>
                            <div class="card-title"><input type="text" value="${data.title}" onchange="editcard(${data.id})" id="card${data.id}-title"></div></div>`;
            newcolumn.appendChild(newcard);
            cardname.value = "";
           })
    }

    function editboartitle(boardid) {
    let boardname = document.getElementById(`board${boardid}-title`);
    let sentdata = {
        boardid: boardid,
        boardname: boardname.value
    };
    fetch('/edit-board-title',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify( sentdata )
    })
        .then( data=>data.json() )
        .then( data=>{ console.log (data);
           })
    }


    function delete_card(id){

    let sent_card_data={
        id:id
    };
    // console.log(del_card);
    // console.log(del_card.id);
    fetch('/delete-card',{
        method:'POST',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(sent_card_data)
    })
        .then(data=>data.json())
        .then(data=>{
         let del=document.querySelector(`[ card-id="${data.id}" ]`);
         del.remove();

        })

    }

    function eventlistener(cardID){
     let draggedElement;
        document.addEventListener("dragstart", e => {
            draggedElement = event.target;
        });
        document.addEventListener("dragover", e => {
            e.preventDefault();
        });
        document.addEventListener("drop", e => {
            if (e.target.classList.contains("board-column-content")) {
                draggedElement.parentElement.removeChild(draggedElement);
                let cardid = draggedElement.getAttribute('card-id');
                let newstatusid = e.target.getAttribute('status-id');
                let new_card_data = {
                    card_id: cardid,
                    status_id: newstatusid
                };
                e.target.appendChild(draggedElement);
                fetch('/move-card',{
                method:'POST',
                headers:{
                "Content-Type": "application/json"
                },
                body: JSON.stringify(new_card_data)
                })
                    .then(data=>data.json())
                    .then(data=>{
                    });
                draggedElement = null;
            } else if (e.target.classList.contains("card")){
                let parrent = e.target.parentElement;
                let newstatusid = parrent.getAttribute('status-id');
                let cards_order = {
                    to_replace_id: e.target.getAttribute('card-id'),
                    to_replace: e.target.getAttribute('card-order'),
                    dragged: draggedElement.getAttribute('card-order'),
                    dragged_new_status: newstatusid,
                    dragged_id: draggedElement.getAttribute('card-id')
                };
                fetch('/change-card-order',{
                method:'POST',
                headers:{
                "Content-Type": "application/json"
                },
                body: JSON.stringify(cards_order)
                })
                    .then(data=>data.json())
                    .then(data=>{
                        draggedElement.setAttribute('card-order',`${data.dragged_order}`);
                        e.target.setAttribute('card-order',`${data.to_replace_card_order}`);
                        parrent.insertBefore(draggedElement, e.target);
                    });
            }
        });
    }

function editcard(cardid){
    let cardtoedit = document.getElementById(`card${cardid}-title`);
    let datatosend = {
        card_id: cardid,
        card_title: cardtoedit.value
    };
    fetch('/edit-card-title',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify( datatosend )
    })
        .then( data=>data.json() )
        .then( data=>{ console.log (data);
           })
    console.log(cardid);
}


function register(){
    let username=document.getElementById('usernameR');
    let password= document.getElementById('passwordR');

    let sent_data={
        username: username.value,

        password : password.value
    }
    console.log(username);
    fetch('/register',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify( sent_data )
    })
        .then(data=>data.json())
        .then(data=> {
            console.log(data)
            if (data['ok']=='not'){
                let formR=document.getElementById('register-form');
                let check=formR.lastElementChild;
                if(check.classList.contains('login-message')){
                    formR.removeChild(check);
                }
                let message=document.createElement('p');
                message.classList.add('login-message');
                message.innerHTML=`Username already exists!`;
                formR.appendChild(message);
                username.value="";
                password.value="";

            }else{

                let formR=document.getElementById('register-form');
                let check=formR.lastElementChild;
                if(check.classList.contains('login-message')){
                    formR.removeChild(check);
                }
                let message=document.createElement('p');
                message.classList.add('login-message');
                message.innerHTML=`Register succesful! Login to access your Private Board!`;
                formR.appendChild(message);
                username.value="";
                password.value="";
            }

        })
        .catch(err=>console.log(err))
}


function login(){
    let username=document.getElementById('username');
    let password= document.getElementById('password');

    let sent_data={
        username: username.value,

        password : password.value
    }
    console.log(username);
    fetch('/login',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify( sent_data )
    })
        .then(data=>data.json())
        .then(data=> {
            console.log(data)
            if (data['ok']=='not'){
                let formR=document.getElementById('login-form');
                let check=formR.lastElementChild;
                if(check.classList.contains('login-message')){
                    formR.removeChild(check);
                }
                let message=document.createElement('p');
                message.classList.add('login-message');
                message.innerHTML=`Username or password incorrect!!`;
                formR.appendChild(message);
                username.value="";
                password.value="";

            }else{

                let formR=document.getElementById('login-form');
                let check=formR.lastElementChild;
                if(check.classList.contains('login-message')){
                    formR.removeChild(check);
                }
                location.reload();
            }

        })
        .catch(err=>console.log(err))
}

function removeboard(boardid){
    let board = document.getElementById(`${boardid}`);
    let parrent = document.getElementById('accordion');
    parrent.removeChild(board);
    let datatosend = {board_id: boardid};
    fetch('/remove-board',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify( datatosend )
    })
        .then( data=>data.json() )
        .then( data=>{})
}

init();


