let rows = 100 ;
let column = 26 ;

let addressColCont = document.querySelector(".address-col-cont") ;
let addressRowCont = document.querySelector(".address-row-cont") ;
let cellscont = document.querySelector(".cells-cont") ;
let addressBar = document.querySelector(".address-bar") ;

for(let i = 0 ; i < rows ; i ++) {
    let addressCol = document.createElement("div") ;
    addressCol.innerText = i+1 ;
    addressCol.setAttribute("class" , "address-col") ;
    addressColCont.appendChild(addressCol) ; 
}

for(let i = 0 ; i < column ; i ++){
    let addressRow = document.createElement("div") ;
    addressRow.innerHTML = String.fromCharCode(65+i) ;
    addressRow.setAttribute("class" , "address-row") ;
    addressRowCont.appendChild(addressRow) ;
}

for(let i = 0 ; i < rows ; i ++) {
    let rowaddress = document.createElement("div") ;
    rowaddress.setAttribute("class" , "row-address") ;
    for(let j = 0 ; j < column ; j ++){
        let cell = document.createElement("div") ;
        cell.setAttribute("class" , "cells") ;
        cell.setAttribute("contenteditable" , "true") ;

        //setting attributes for recognition of storage and active cell

        cell.setAttribute("rid", i) ;
        cell.setAttribute("cid", j) ;
        cell.setAttribute("spellcheck" , "false") ;
        addressbarvalue(cell , i , j) ;
        rowaddress.appendChild(cell) ;
    }
    cellscont.appendChild(rowaddress) ;
}

function addressbarvalue(cell , i , j) {
    cell.addEventListener("click" , (e) =>{
        let rowid = i + 1 ;
        let colid = String.fromCharCode(65+j) ;
        addressBar.value = `${colid}${rowid}` ;
    })
}

 