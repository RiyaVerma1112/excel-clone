// storage -> 2D matrix (basic requirement) , but it will become a 3D matrix on putting a child cell's details 

let collectedGraphComponentMatrix = [] ;
let graphComponentMatrix = [] ;

// for(let i = 0 ; i < rows ; i ++) {
//     let row = [] ;
//     for(let j = 0 ; j < column ; j ++) {
//         // here we will put array instead of object 
//         // pushing an array here because "can we have more than 1 parent child relation in a graph"
//         row.push([]) ;
//     }
//     graphComponentMatrix.push(row) ;
// }

function isGraphCyclic(graphComponentMatrix) {
    let visited = [] ;
    let dfsVisited = [] ;

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

    // loop over all the components of the graph 
    for(let i = 0 ; i < rows ; i ++) {
        for(let j = 0 ; j < column ; j ++) {
            if(visited[i][j] === false) {
                let res = dfsCycleDetection(graphComponentMatrix , i , j , visited , dfsVisited) ;
                if(res === true) {
                    // return true
                    // returning i and j to get starting point of cycle formation
                    return [i,j]  ;//cycle found
                }
            }
        }
    }
    // return false ;
    return null ;
}

// actual dfs implemented 
// start : mark visited[node] (node is a 2D matrix) -> true 
// mark dfsVisited[node] -> true 
// ending : dfsVisited[node] -> false
function dfsCycleDetection(graphComponentMatrix , sr , sc , visited , dfsVisited) {
    // sr - source row , sc - source column 
    visited[sr][sc] = true ;
    dfsVisited[sr][sc] = true ;

    // traverse through all the children and apply DFS 
    for(let childIdx = 0 ; childIdx < graphComponentMatrix[sr][sc].length ; childIdx ++) {
        let [nr , nc] = graphComponentMatrix[sr][sc][childIdx] ;
        if(visited[nr][nc] === false) {
            let res = dfsCycleDetection(graphComponentMatrix , nr , nc , visited , dfsVisited) ;
            if(res === true) { 
                return true ;
            }
        }
        else if(visited[nr][nc] === true && dfsVisited[nr][nc] === true) {
            return true ; // found cycle 
        }
    } 

    dfsVisited[sr][sc] = false ;
    return false ;
}