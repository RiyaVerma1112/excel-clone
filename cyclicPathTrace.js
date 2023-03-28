// TRACE THE PATH FIND THE PROBLEMATIC POINT AND TRACE THE PATH BACK 
// detect path of cycle and intersecting point (where cycle is started)
// we have to add delay in displaying color and wait to watch again
// in js we use setTimeOut(async function) for delay 
// use promises / async await to add wait

async function isGraphCyclicTracePath(graphComponentMatrix , cycleResponse) {
    let visited = [] ;
    let dfsVisited = [] ;

    let [sr,sc] = cycleResponse ;

    for(let i = 0 ; i < rows ; i ++) {
        let visitedRow = [] ;
        let dfsVisitedRow = [] ;

        for(let j = 0 ; j < column ; j ++) {
            visitedRow.push(false) ;
            dfsVisitedRow.push(false) ;
        }
        visited.push(visitedRow) ;
        dfsVisited.push(dfsVisitedRow) ;
    }  

    // because dfsCycleDetectionTracePath is an async function we have to use await and because of using await make it async also
    let response = await dfsCycleDetectionTracePath(graphComponentMatrix , sr , sc , visited , dfsVisited) ;
    // this response could be sync , but we want it to resolve after entire tracing is done 
    if(response === true) {
        // return true ;
        // return true only after job is done
        return Promise.resolve(true) ;
    }
    // return false ;
    return Promise.resolve(false) ;
}

function colorPromise() {
    // make a async fun sync , so making setTimeOut sync
    return new Promise((resolve , reject) => {
        setTimeout(() => {
            resolve() ;
        }, 1000) ;
    })
}

// coloring of cells inside the cycle 
async function dfsCycleDetectionTracePath(graphComponentMatrix , sr , sc , visited , dfsVisited) {
    // sr - source row , sc - source column 
    visited[sr][sc] = true ;
    dfsVisited[sr][sc] = true ;

    let cell = document.querySelector(`.cells[rid = "${sr}"][cid = "${sc}"]`) ;
    // starting point with color lightblue
    cell.style.backgroundColor = "lightblue" ;
    await colorPromise() ;

    // traverse through all the children and apply DFS 
    for(let childIdx = 0 ; childIdx < graphComponentMatrix[sr][sc].length ; childIdx ++) {
        let [nr , nc] = graphComponentMatrix[sr][sc][childIdx] ;
        if(visited[nr][nc] === false) {
            let res = await dfsCycleDetectionTracePath(graphComponentMatrix , nr , nc , visited , dfsVisited) ;
            if(res === true) { 
                // undo changes of intersecting point 
                // setTimeout(() => {
                //     cell.style.backgroundColor = "transparent" ;
                // }, 1000) ;
                cell.style.backgroundColor = "transparent" ;
                await colorPromise() ;
                return Promise.resolve(true) ;
            }
        }
        else if(visited[nr][nc] === true && dfsVisited[nr][nc] === true) {
            let cyclicCell = document.querySelector(`.cells[rid = "${nr}"][cid = "${nc}"]`) ;
            // setTimeout(() => {
            //     cyclicCell.style.backgroundColor = "lightsalmon" ;
            // }, 1000) ;
            cyclicCell.style.backgroundColor = "lightsalmon" ;
            await colorPromise() ;

            // undo the changes 
            // setTimeout(() => {
            //     cyclicCell.style.backgroundColor = "transparent" ;
            // }, 1000);
            cyclicCell.style.backgroundColor = "transparent" ;
            await colorPromise() ;

            cell.style.backgroundColor = "transparent" ;
            await colorPromise() ;
            
            // return true ; // found cycle 
            return Promise.resolve(true) ;
        }
        cell.style.backgroundColor = "transparent" ;
        await colorPromise() ;
    } 

    dfsVisited[sr][sc] = false ;
    return Promise.resolve(false) ;
}