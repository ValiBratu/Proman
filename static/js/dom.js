// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let boardsContainer = document.querySelector('#boards');
        for(let board of boards){
            let newboard = document.createElement('div');
            newboard.className = "col-sm";
            newboard.classList.add("board")
            newboard.innerHTML = `${board.title}`;
            newboard.setAttribute("onclick", `${dom.loadCards(board.id)}`)
            boardsContainer.appendChild(newboard);
        }

    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getBoard(boardId, function(cards){
            dom.showCards(cards);
        });
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        console.log(cards);

    },
    // here comes more features
};
