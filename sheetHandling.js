// to handle multiple sheets
// clicking on sheet add icon adds sheet 
let addSheetBtn = document.querySelector(".sheet-add-icon") ;
let sheetFolderContainer = document.querySelector(".sheet-folder-cont") ;
let activeSheetColor = "#ced6e0" ;

addSheetBtn.addEventListener("click" , (e) => {
    // console.log("clicked") ;
    let sheet = document.createElement("div") ;
    sheet.setAttribute("class" , "sheet-folder") 

    let allSheetFolders = document.querySelectorAll(".sheet-folder")

    sheet.setAttribute("id" , allSheetFolders.length) ;
    sheet.innerHTML = `
        <div class="sheet-content">
            Sheet ${allSheetFolders.length + 1}
        </div>
    ` 
    sheetFolderContainer.appendChild(sheet) ;

    // make scroller shift aurtomatically whever added sheet
    sheet.scrollIntoView() ;

    createSheetDB() ;
    createGraphComponentsMatrix() ; //for a sheet creating graph component matrix to detect cycle
    // bringing data from the DB and showing it on UI
    handleActiveSheet(sheet) ; // display content and change UI according to the sheet Number which is active
    // as we clicked on add sheet btn we will be transferred to that sheet
    handleSheetRemoval(sheet) ;
    sheet.click() ;
})

function handleSheetRemoval(sheet) {
    // implementing : first we will right click on sheet then it will ask do we
    // want to delete it if yes then delete
    // mousedown could be rightclick or leftclick or scroll
    sheet.addEventListener("mousedown" , (e) => {
        // right click checking
        // in mouse left click score is 0 , scroll score is 1 , right click score is 2
        if(e.button !== 2) return ;
        let allSheetFolders = document.querySelectorAll(".sheet-folder") ;
        if(allSheetFolders.length === 1) {
            alert("You need to have atleast one sheet!!.") ;
            return ;
        }

        let response = confirm("This action cannot be undone. Your sheet will be removed permanently. Are you sure?") ;
        if(response === false) {
            return ;
        }

        let sheetIdx = Number(sheet.getAttribute("id")) ;
        // removing database 
        collectedSheetDB.splice(sheetIdx , 1) ;
        collectedGraphComponentMatrix.splice(sheetIdx , 1) ;

        // removing UI
        handleSheetUIRemoval(sheet) ;

        // passing control to default(first sheet) and setting its UI
        sheetDB = collectedSheetDB[0] ;
        graphComponentMatrix = collectedGraphComponentMatrix[0] ;
        handleSheetProps() ;
    })
}

function handleSheetUIRemoval(sheet) {
    sheet.remove() ;
    let allSheetFolders = document.querySelectorAll(".sheet-folder") ;
    // resest the ids of sheet so there is no missing sheet number 
    for(let i = 0 ; i < allSheetFolders.length ; i ++) {
        // re-setting all the id's 
        allSheetFolders[i].setAttribute("id", i) ;
        // altering html 
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content") ;
        // making all sheets color transparent
        sheetContent.innerText = `Sheet ${i+1}` ;
        allSheetFolders[i].style.backgroundColor = "transparent" ;
    }
    allSheetFolders[0].style.backgroundColor = activeSheetColor ;
    // as control is passed to sheet 1 , making only its color as active
}

// sheet container is a mega sheet , inside it having details of n sheets , each sheet have details of rows and each row have attributes of a cell 
function createSheetDB() {
    sheetDB = [] ;
    for(let i = 0 ; i < rows ; i ++) {
        let sheetRow = [] ;
        for(let j = 0 ; j < column ; j ++) {
            let cellProp = {
                bold : false ,
                italic : false ,
                underline : false ,
                alignment : "left" ,
                fontFamily : "monospace" ,
                fontSize : "14" ,
                fontColor : "a000000" ,
                BGColor : "a000000" ,
                value : "" , //for formula bar
                formula : "" , // for formula bar
                children : []  // to store children indexes corresponding to all indexes
            }
            sheetRow.push(cellProp) ;
        }
        sheetDB.push(sheetRow) ;
    }

    collectedSheetDB.push(sheetDB) ;
}

function handleSheetDB(sheetIdx) {
    sheetDB = collectedSheetDB[sheetIdx] ;
    graphComponentMatrix = collectedGraphComponentMatrix[sheetIdx] ;
}

function handleSheetProps() {
    for(let i = 0 ; i < rows ; i ++) {
        for(let j = 0 ; j < column ; j ++) {
            let cell = document.querySelector(`.cells[rid = "${i}"][cid = "${j}"]`) ;
            cell.click() ;
        } 
    }
    // already A1 is selected in grid 
    let firstcell = document.querySelector(".cells") ;
    firstcell.click() ;
}

function handleSheetUI(sheet) {
    let allSheetFolders = document.querySelectorAll(".sheet-folder") ;
    for(let i = 0 ; i < allSheetFolders.length ; i ++) {
        allSheetFolders[i].style.backgroundColor = "transparent" ; 
    }
    // highlighting tab of sheet we are on
    sheet.style.backgroundColor = activeSheetColor ;
}


function handleActiveSheet(sheet) {
    sheet.addEventListener("click" , (e) => {
        let sheetIdx = Number(sheet.getAttribute("id")) ;
        handleSheetDB(sheetIdx) ; //retrieve attributes from collectedSheetDB
        handleSheetProps() ; //getting a sheet handling default values first
        handleSheetUI(sheet) ; //rendering data , handling retrieved data on UI
    })
}

function createGraphComponentsMatrix(){
    graphComponentMatrix = [] ;
    for(let i = 0 ; i < rows ; i ++) {
        let row = [] ;
        for(let j = 0 ; j < column ; j ++) {
            // here we will put array instead of object 
            // pushing an array here because "can we have more than 1 parent child relation in a graph"
            row.push([]) ;
        }
        graphComponentMatrix.push(row) ;
    }

    collectedGraphComponentMatrix.push(graphComponentMatrix) ;
}