let downloadBtn = document.querySelector(".download") ;
let uploadBtn = document.querySelector(".upload") ;

// downloading data in JSON so that uploading also will be very easy -- shift + ALT + F -- for formatting
downloadBtn.addEventListener("click" , (e) => {
    // first index of downloaded data have sheetDB and second have graphComponentMatrix
    let jsonData = JSON.stringify([sheetDB , graphComponentMatrix]) ;
    let file = new Blob([jsonData] , {type: "application/json"}) ;
    
    let a = document.createElement("a") ; //anchor tag
    a.href = URL.createObjectURL(file) ;
    a.download = "SheetData.json" ; //downloaded file with this name
    a.click() ; // clicked on anchor tag to do the process 
})

// uploading Funtionality 
uploadBtn.addEventListener("click" , (e) => {
    // open file explorer
    let input = document.createElement("input") ;
    input.setAttribute("type" , "file") ;
    input.click() ; //explicitly clicking to open file

    // get file and convert it back to JSON format
    input.addEventListener("change" , (e) => {
        let fr = new FileReader() ;
        let files = input.files ;
        // first file have JSON data for particular file
        let fileObj = files[0] ;

        // Now Reading stringified data as text and will convert it into JSON
        fr.readAsText(fileObj) ;
        // once reading done fire up an event to read sheet data
        fr.addEventListener("load" , (e) => {
            let readSheetData = JSON.parse(fr.result) ;

            addSheetBtn.click() // will create new sheet with default values

            sheetDB = readSheetData[0] ;
            graphComponentMatrix = readSheetData[1] ;
            
            // at the end default sheet is formed with its default DB with is stored in this collectedSheetDB
            // inside collectedSheetDB replacing its value with JSON data
            // Database Changes
            collectedSheetDB[collectedSheetDB.length - 1] = sheetDB ;
            collectedGraphComponentMatrix[collectedGraphComponentMatrix.length - 1] = graphComponentMatrix ;

            // setting UI 
            handleSheetProps() ;
        })
    })
})