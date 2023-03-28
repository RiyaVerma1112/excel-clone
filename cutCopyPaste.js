let ctrlKey ; //store whether cltrl key is pressed or not
let copyBtn = document.querySelector(".copy") ;
let cutBtn = document.querySelector(".cut") ;
let pasteBtn = document.querySelector(".paste") ;


// check if key is pressed
document.addEventListener("keydown" , (e) => {
    // checking for everytime when we write something whether cltrl key is pressed on not
    ctrlKey = e.ctrlKey ; //will give boolean value
})
// or not
document.addEventListener("keyup" , (e) => {
    ctrlKey = e.ctrlKey ;
})

// add a listener to all the cell to check whether they are selected or not
for(let i = 0 ; i < rows ; i ++) {
    for(let j = 0 ; j < column ; j ++) {
        let cell = document.querySelector(`.cells[rid = "${i}"][cid = "${j}"]`) ;
        handleSelectedCells(cell) ;
    }
}

// this rangeStorage will contain two small arrays 
// 1st array is left-top = rmin , cmin and 2nd array is right-bottom = rmax , cmax
// in select or copy or paste we will consider a rectange of cells selected forming sides (rmax - rmin) and (cmax - cmin)
// if we select clrl + click it will be selected then second clrl + click will choose 2nd coordinate
// then coordinate 1 and 2 rectangles element will be selected 
// selecting third coordinate with clrl + enter will delete 2nd coordinate 
// if in between press any cell without ctrl , last selected cell will be erased
let rangeStorage = [] ;
let rowDiff = 0 ;
let colDiff = 0 ;

function handleSelectedCells(cell) {
    cell.addEventListener("click" , (e) => {
        if(!ctrlKey) {
            // if pressed key is not a cltrl key we need to erase previous memory of selected key
            for(let i = rangeStorage.length - 1 ; i >= 0 ; i --) {
                let prevCell = document.querySelector(`.cells[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`) ;
                prevCell.style.border = "1px solid #dfe4ea" ;
                rangeStorage.pop() ;
            }
            return ;
        }
        if(rangeStorage.length == 2) {
            // we have removed previous cell selection 
            let prevCell = document.querySelector(`.cells[rid="${rangeStorage[1][0]}"][cid="${rangeStorage[1][1]}"]`) ;
            prevCell.style.border = "1px solid #dfe4ea" ;

            rangeStorage.pop() ;

            cell.style.border = "3px solid #218c74"
            let rid = Number(cell.getAttribute("rid")) ;
            let cid = Number(cell.getAttribute("cid")) ;
            // in a rangeStorage pushing small arrays 
            rangeStorage.push([rid,cid]) ;
            // console.log(rangeStorage[0] , rangeStorage[1]) ;
            if(rangeStorage.length == 2) {
                rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]) ;
                colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]) ;
            }
            return ;
        }

        //UI -- highlighting selected cells
        cell.style.border = "3px solid #218c74" ;

        let rid = Number(cell.getAttribute("rid")) ;
        let cid = Number(cell.getAttribute("cid")) ;
        // in a rangeStorage pushing small arrays 
        rangeStorage.push([rid,cid]) ;
        // console.log(rangeStorage[0] , rangeStorage[1]) ;

        if(rangeStorage.length == 2) {
            rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]) ;
            colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]) ;
        }
    })
}

// copying functionality
// to store data , we will use an array 
let clipboard = [] ;
copyBtn.addEventListener("click" , (e) => {
    let srow = rangeStorage[0][0] ;
    let erow = rangeStorage[1][0] ;
    let scol = rangeStorage[0][1] ;
    let ecol = rangeStorage[1][1] ;

    for(let i = Math.min(srow , erow) ; i <= Math.max(srow , erow)  ; i ++) {
        let copyRow = [] ;
        for(let j = Math.min(scol , ecol) ; j <= Math.max(scol , ecol) ; j ++) {
            let cellProp = sheetDB[i][j] ; //got cell attribute object
            // storing data row wise in clipboard
            copyRow.push(cellProp) ;
        }
        clipboard.push(copyRow) ;
    }

    // Now removing highlighting after copying 
    for(let i = rangeStorage.length - 1 ; i >= 0 ; i --) {
        let prevCell = document.querySelector(`.cells[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`) ;
        prevCell.style.border = "1px solid #dfe4ea" ;
    }

    console.log(clipboard) ;
})

// pasting functionality 
// use of variables rowDiff and colDiff 
// let isOutOfRange = false ;
pasteBtn.addEventListener("click" , (e) => {
    // address of cells from where pasting starts in rectangle 
    let pivot = addressBar.value ;
    let [tarStartRow , tarStartCol] = decoderidcid(pivot) ;
    for(let i = tarStartRow , clipRow = 0 ; i <= tarStartRow + rowDiff ; i ++ , clipRow++) {
        for(let j = tarStartCol , clipCol = 0 ; j <= tarStartCol + colDiff ; j ++ , clipCol++) {
            let cell = document.querySelector(`.cells[rid="${i}"][cid="${j}"]`) ;

            //checking if cell to paste on does exist?? (must not exceed grid range)
            if(!cell) {
                alert("Cell out of range.") ;
                // isOutOfRange = true ;
                continue ;
            } 
            // getting copied data and property object
            let copiedCellProp = clipboard[clipRow][clipCol] ;
            let cellProp = sheetDB[i][j] ;

            // updating DB changing old value to copied value
            cellProp.bold = copiedCellProp.bold ;
            cellProp.italic = copiedCellProp.italic ;
            cellProp.underline = copiedCellProp.underline ;
            cellProp.alignment = copiedCellProp.alignment ;
            cellProp.fontColor = copiedCellProp.fontColor ;
            cellProp.BGColor = copiedCellProp.BGColor ;
            cellProp.fontFamily = copiedCellProp.fontFamily ;
            cellProp.fontSize = copiedCellProp.fontSize ;
            cellProp.value = copiedCellProp.value ;

            // updating UI
            cell.click() ;
        }
    }
})

// delete Functionality 
cutBtn.addEventListener("click" , (e) => {
    let srow = rangeStorage[0][0] ;
    let erow = rangeStorage[1][0] ;
    let scol = rangeStorage[0][1] ;
    let ecol = rangeStorage[1][1] ;

    for(let i = Math.min(srow , erow) ; i <= Math.max(srow , erow)  ; i ++) {
        for(let j = Math.min(scol , ecol) ; j <= Math.max(scol , ecol) ; j ++) {
            let cellProp = sheetDB[i][j] ; 

            let cell = document.querySelector(`.cells[rid = "${i}"][cid = "${j}"]`)

            // database is set to natural state 
            cellProp.bold = false ;
            cellProp.italic = false ;
            cellProp.underline = false ;
            cellProp.alignment = "left" ;
            cellProp.fontColor = "a000000" ;
            cellProp.BGColor =  "a000000" ;
            cellProp.fontFamily =  "monospace" ;
            cellProp.fontSize = "14" ;
            cellProp.value = "";

            // UI updation 
            cell.click() ;
        }
    }

    // dehighlighting
    for(let i = rangeStorage.length - 1 ; i >= 0 ; i --) {
        let prevCell = document.querySelector(`.cells[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`) ;
        prevCell.style.border = "1px solid #dfe4ea" ;
    }
})





