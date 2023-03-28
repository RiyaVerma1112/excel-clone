let collectedSheetDB = [] ; //mass data 3d matrix 
let sheetDB = [] ; //2d matrix

// making an automatic click on sheet button so that in the start we find a sheet (not empty container)
{
    let addSheetBtn = document.querySelector(".sheet-add-icon") ;
    addSheetBtn.click() ;
}

// for(let i = 0 ; i < rows ; i ++) {
//     let sheetRow = [] ;
//     for(let j = 0 ; j < column ; j ++) {
//         let cellProp = {
//             bold : false ,
//             italic : false ,
//             underline : false ,
//             alignment : "left" ,
//             fontColor : "a000000" ,
//             BGColor : "a000000" ,
//             fontFamily : "monospace" ,
//             fontSize : "14" ,
//             value : "" , //for formula bar
//             formula : "" , // for formula bar
//             children : []  // to store children indexes corresponding to all indexes
//         }
//         sheetRow.push(cellProp) ;
//     }
//     sheetDB.push(sheetRow) ;
// }

// get the reference of properties 
let bold = document.querySelector(".bold") ;
let italic = document.querySelector(".italic") ;
let underline = document.querySelector(".underline") ;
let fontSize = document.querySelector(".font-size-prop") ;
let fontFamily = document.querySelector(".font-family-prop") ;
let fontColor = document.querySelector(".font-color-prop") ;
let BGColor = document.querySelector(".BGcolor-prop") ;
let alignment = document.querySelectorAll(".alignment") ;
let leftAlign = alignment[0] ;
let centerAlign = alignment[1] ;
let rightAlign = alignment[2] ;

let activecolorprop = "#d1d8e0" ;
let inactivecolorprop = "#ecf0f1" ;

// attach event listener to it 
bold.addEventListener("click" ,(e) =>{
    let address = addressBar.value  ;
    let[cell,cellprop] = activecell(address) ;
    // modification 
    cellprop.bold = !cellprop.bold ; //in storage
    cell.style.fontWeight = cellprop ? "bold" : "normal" ; //in UI
    bold.style.backgroundColor = cellprop? activecolorprop : inactivecolorprop ; //background colour of b is changed
})
italic.addEventListener("click" ,(e) =>{
    let address = addressBar.value  ;
    let[cell,cellprop] = activecell(address) ;
    // modification 
    cellprop.italic = !cellprop.italic ; //in storage
    cell.style.fontStyle = cellprop ? "italic" : "normal" ; //in UI
    italic.style.backgroundColor = cellprop? activecolorprop : inactivecolorprop ; //background colour of b is changed
})
underline.addEventListener("click" ,(e) =>{
    let address = addressBar.value  ;
    let[cell,cellprop] = activecell(address) ;
    // modification 
    cellprop.underline = !cellprop.underline ; //in storage
    cell.style.textDecoration = cellprop ? "underline" : "none" ; //in UI
    underline.style.backgroundColor = cellprop? activecolorprop : inactivecolorprop ; //background colour of b is changed
})

fontSize.addEventListener("change", (e) => {
    let address = addressBar.value ;
    let [cell,cellprop] = activecell(address) ;
    cellprop.fontSize = fontSize.value ;
    cell.style.fontSize = cellprop.fontSize + "px"; 
    fontSize.style.value = cellprop.fontSize ;
})

fontFamily.addEventListener("change", (e) => {
    let address = addressBar.value ;
    let [cell,cellprop] = activecell(address) ;
    cellprop.fontFamily = fontFamily.value ;
    cell.style.fontFamily = cellprop.fontFamily ; 
    fontFamily.value = cellprop.fontFamily ;
})

fontColor.addEventListener("change", (e) => {
    let address = addressBar.value ;
    let [cell,cellprop] = activecell(address) ;
    cellprop.fontColor = fontColor.value ;
    cell.style.color = cellprop.fontColor ; 
    fontColor.value = cellprop.fontColor ;
})

BGColor.addEventListener("change", (e) => {
    let address = addressBar.value ;
    let [cell,cellprop] = activecell(address) ;
    cellprop.BGColor = BGColor.value ;
    cell.style.backgroundColor = cellprop.BGColor ; 
    BGColor.value = cellprop.BGColor ;
})

alignment.forEach((alignElem) => {
    alignElem.addEventListener("click" , (e) =>{
        let address = addressBar.value ;
        let [cell , cellprop] = activecell(address) ;

        let alignvalue = e.target.classList[0] ;
        cellprop.alignment = alignvalue ; // change in storage 

        cell.style.textAlign = cellprop.alignment ; // change in UI 
        // alignemnt is dependent on other values means if left alignment is done right must vanish that why using switch case 
        switch(alignvalue) {
            case "left" : 
                leftAlign.style.backgroundColor = activecolorprop ;
                rightAlign.style.backgroundColor = inactivecolorprop ;
                centerAlign.style.backgroundColor = inactivecolorprop ;
                break ;
            case "right" :
                leftAlign.style.backgroundColor = inactivecolorprop ;
                rightAlign.style.backgroundColor = activecolorprop ;
                centerAlign.style.backgroundColor = inactivecolorprop ;
                break ;
            case "center" :
                leftAlign.style.backgroundColor = inactivecolorprop ;
                rightAlign.style.backgroundColor = inactivecolorprop ;
                centerAlign.style.backgroundColor = activecolorprop ;
                break ;
        }
    })
})

// adding event listener to all the storage cells by doing so we are maving sure that UI changes according to the cell on which we click 
let allcells = document.querySelectorAll(".cells") ;
for(let i = 0 ; i < allcells.length ; i ++) {
    addingEventListener(allcells[i]) ;
}
function addingEventListener(cell) {
    cell.addEventListener("click", (e) => {
        // whenever a cell is clicked we are setting its data as default or as memory
        // task area 
        let address = addressBar.value ;
        let [rid,cid] = decoderidcid(address) ;
        let cellprop = sheetDB[rid][cid] ;
        // TASK AT CELL UI
        cell.style.fontWeight = cellprop.bold ? "bold" : "normal" ;
        cell.style.fontStyle = cellprop.italic ? "italic" : "normal" ;
        cell.style.textDecoration = cellprop.underline ? "underline" : "none" ;
        cell.style.fontSize = cellprop.fontSize + "px"; 
        cell.style.fontFamily = cellprop.fontFamily ; 
        cell.style.color = cellprop.fontColor ;
        cell.style.backgroundColor = cellprop.BGColor === "#000000" ? "transparent" : cellprop.BGColor ; 
        cell.style.textAlign = cellprop.alignment ;
        // TASK AT PROPERTY BAR
        bold.style.backgroundColor = cellprop.bold? activecolorprop : inactivecolorprop ; 
        italic.style.backgroundColor = cellprop.italics? activecolorprop : inactivecolorprop ;
        underline.style.backgroundColor = cellprop.underline? activecolorprop : inactivecolorprop ; 
        fontColor.value = cellprop.fontColor ;
        BGColor.value = cellprop.BGColor ;
        fontSize.value = cellprop.fontSize ;
        fontFamily.value = cellprop.fontFamily ;

        switch(cellprop.alignment) {
            case "left" : 
                leftAlign.style.backgroundColor = activecolorprop ;
                rightAlign.style.backgroundColor = inactivecolorprop ;
                centerAlign.style.backgroundColor = inactivecolorprop ;
                break ;
            case "right" :
                leftAlign.style.backgroundColor = inactivecolorprop ;
                rightAlign.style.backgroundColor = activecolorprop ;
                centerAlign.style.backgroundColor = inactivecolorprop ;
                break ;
            case "center" :
                leftAlign.style.backgroundColor = inactivecolorprop ;
                rightAlign.style.backgroundColor = inactivecolorprop ;
                centerAlign.style.backgroundColor = activecolorprop ;
                break ;
        }

        let formulaBar = document.querySelector(".formula-bar") ;
        formulaBar.value = cellprop.formula ;
        // cell.value = cellprop.value ;
        cell.innerText = cellprop.value ; //because we are using div to switch between sheets  
    })
}

// function will give both storage as well as UI
function activecell(address) {
    let[rid,cid] = decoderidcid(address) ;
    let cell = document.querySelector(`.cells[rid = "${rid}"][cid = "${cid}"]`) ;
    let cellprop = sheetDB[rid][cid] ;
    return [cell,cellprop] ;
}

// function for decoding
function decoderidcid(address) { //A1  
    let rid = Number(address.slice(1)) - 1;  
    let cid = Number(address.charCodeAt(0)) - 65;
    return [rid,cid] ;
}