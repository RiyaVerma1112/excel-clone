for(let i = 0 ; i < rows ; i ++) {
    for(let j = 0 ; j < column ; j ++) {
        let cell = document.querySelector(`.cells[rid = "${i}"][cid = "${j}"]`) ;
        cell.addEventListener("blur" , (e) => {
            // blur will active on the cell which we left last 
            let address = addressBar.value ;
            let[cell , cellprop] = activecell(address) ;
            let enteredval = cell.innerText ;

            if(enteredval === cellprop.value) return ;
            // case 2 : if value in cell is modified -- evaluate , store in UT , DB, remove P/C relnship , next process
            cellprop.value = enteredval ;
            removeChildFromParent(cellprop.formula) ;
            cellprop.formula = "" ;
            updateChildrenCells(address) ;

            // console.log(cellprop) ;
        })
    }
}

let formulabar = document.querySelector(".formula-bar") ;
formulabar.addEventListener("keydown" , async (e) => {
    let inputformula = formulabar.value ;
    if(e.key === "Enter" && inputformula) {
        let address = addressBar.value ;
        let [cell , cellprop] = activecell(address) ;
        //case 1 : if formula changes : if formula entered is new to what stored previously delete prev one -- break parent child relation , evaluate and set new rlnship and update ui and db
        if(inputformula != cellprop.formula) {
            removeChildFromParent(cellprop.formula) ;
        }

        addChildToGraphComponent(inputformula , address) ;
        // if graph is cyclic , we return an alert and remove the child otherwise we evaluate the expression 
        let isCyclic = isGraphCyclic(graphComponentMatrix) ;
        if(isCyclic) {
            // alert("Your formula has cyclic dependencies.") ;
            let response = confirm("Your Path has Cyclic Dependencies. Do you wish to trace the Path?") ;
            while(response === true) {
                // keep on tracking the cycle 
                await isGraphCyclicTracePath(graphComponentMatrix , isCyclic) ;
                response = confirm("Your Path has Cyclic Dependencies. Do you wish to trace the Path?") ;
            }
            removeChildFromGraphComponent(inputformula , address) ;
            return ;
        }

        let evaluatedval = evaluateformula(inputformula) ;
        setuivalAndcellprop(evaluatedval , inputformula , address) ;

        // keeping track of child dependent on parent 
        addChildToParent(inputformula) ;
        updateChildrenCells(address) ;
        // console.log(sheetDB) ;
    }
})

function removeChildFromGraphComponent(formula , childAddress) {
    // decode child details 
    let [crid , ccid] = decoderidcid(childAddress) ;

    // decode parent details , go through formula 
    let encodedformula = formula.split(" ") ;
    for(let i = 0 ; i < encodedformula.length ; i ++) {
        let ascii = encodedformula[i].charCodeAt(0) ;
        if(ascii >= 65 && ascii <= 90) {
            let [prid, pcid] = decoderidcid(encodedformula[i]) ;
            // pop last child which we just added  
            graphComponentMatrix[prid , pcid].pop() ;
        }
    }
}

function addChildToGraphComponent(formula , childAddress) {
    // decode child details 
    let [crid , ccid] = decoderidcid(childAddress) ;

    // decode parent details , go through formula 
    let encodedformula = formula.split(" ") ;
    for(let i = 0 ; i < encodedformula.length ; i ++) {
        let ascii = encodedformula[i].charCodeAt(0) ;
        if(ascii >= 65 && ascii <= 90) {
            let [prid, pcid] = decoderidcid(encodedformula[i]) ;
            // insert child in graph matrix 
            graphComponentMatrix[prid][pcid].push([crid, ccid]) ;
        }
    }
}

function updateChildrenCells(parentAddress) {
    let [parentCell , parentCellProp] = activecell(parentAddress) ;
    let children = parentCellProp.children ;

    for(let i = 0 ; i < children.length ; i ++) {
        let childAddress = children[i] ;
        let [childCell , childCellProp] = activecell(childAddress) ;
        let childFormula = childCellProp.formula ;
        let evaluatedval = evaluateformula(childFormula) ;
        setuivalAndcellprop(evaluatedval , childFormula , childAddress) ;
        updateChildrenCells(childAddress) ; //each children have to update like recursion
    }
}

function addChildToParent(formula) {
    let childAddress = addressBar.value ;
    let encodedformula = formula.split(" ") ;
    for(let i = 0 ; i < encodedformula.length ; i ++) {
        let ascii = encodedformula[i].charCodeAt(0) ;
        if(ascii >= 65 && ascii <= 90) {
            // it is a dependency child A1 , 10 is not dependency 
            let[parentCell,parentCellProp] = activecell(encodedformula[i]) ;
            parentCellProp.children.push(childAddress) ;
        }
    }
}

function removeChildFromParent(formula) {
    let childAddress = addressBar.value ;
    let encodedformula = formula.split(" ") ;
    for(let i = 0 ; i < encodedformula.length ; i ++) {
        let ascii = encodedformula[i].charCodeAt(0) ;
        if(ascii >= 65 && ascii <= 90) {
            // it is a dependency child A1 , 10 is not dependency 
            let[parentCell,parentCellProp] = activecell(encodedformula[i]) ;
            let idx = parentCellProp.children.indexOf(childAddress) ;
            parentCellProp.children.splice(idx , 1) ;
        }
    }
}

function evaluateformula(formula) {
    // A1+B1 OR A1+10 type dependency operation
    let encodedformula = formula.split(" ") ;
    for(let i = 0 ; i < encodedformula.length ; i ++) {
        let ascii = encodedformula[i].charCodeAt(0) ;
        if(ascii >= 65 && ascii <= 90) {
            // not a number its an address so get its value 
            let[cell,cellprop] = activecell(encodedformula[i]) ;
            encodedformula[i] = cellprop.value ;
        }
    }
    // encode formula = A1 + 10 , decoded formula = 20 + 10 (20 is A1's value) and must be in string
    let decodedformula = encodedformula.join(" ") ;
    return eval(decodedformula) ; 
}

function setuivalAndcellprop(evaluatedval , inputformula , address) {
    // let address = addressBar.value ;
    let[cell , cellprop] = activecell(address) ;
    // updating UI part 
    cell.innerText = evaluatedval ;
    // updating storage part -- value and formula 
    cellprop.value = evaluatedval ;
    cellprop.formula = inputformula ;
}