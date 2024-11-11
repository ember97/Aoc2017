import fs from 'fs';
import readline from 'readline';


// Day7 Advent of code 2017
// https://adventofcode.com/2017/day/7 


const discs = new Map(); // [name, [children]]
const weights = new Map(); // [name, weight]


const allEqual = arr => arr.every(val => val === arr[0]);

await part1();
await part2();


async function part1(){
    await initDiscs();
    const result = getRoot();
    console.log("Result part 1: ", result);
}

async function part2() {
    await initDiscs();
    const result = iter();
    console.log("Result part 2: ", result);
}



// Assumes only one disc (root) has no parent
function getRoot() {
    const children = getChildren();
    const allDiscs = new Set(discs.keys());
    const root = Array.from(allDiscs.difference(children))[0];
    return root;
}


// Iteration for part 2
function iter() {
    const root = getRoot();
    return findUnBalancedDisc(root, calcTotalWeight(root)); // Ghost sibling
}


function findUnBalancedDisc(root, balance) {
    // Get children of current root and calculate their total weight
    const children = discs.get(root);
    const childrenTotalWeights = new Map();
    children.forEach(c => childrenTotalWeights.set(c, calcTotalWeight(c)));

    const childrenAreUnbalanced = !allEqual(childrenTotalWeights.values().toArray());

    // If children are unbalanced, we need to check further down the sub-tree
    if (childrenAreUnbalanced) {
        const unBalancedChild = getUnbalancedChild(childrenTotalWeights);
        const otherChildrenWeight = findNonUnique(childrenTotalWeights.values().toArray());
       return findUnBalancedDisc(unBalancedChild, otherChildrenWeight);
    }

    // If all children are balanced or we have no children, we need to adjust our weight to be the same as the balance (our siblings weight)
    const totalWeight = calcTotalWeight(root);
    const newWeight = balance - totalWeight + weights.get(root);

    //console.log("Found unbalanced disc " + root + ", new weight: ", newWeight);
    return [root, newWeight];
}



// ----------------- METHODS -----------------


// Assume exactly one child has different weight than the others
function getUnbalancedChild(map){
    const uniqueWeight = findUnique(map.values().toArray());
    const children = map.keys();
    var uniqueChild = undefined;

    // Check for the child that has a unique weight
    children.forEach(child => {
        const weight = map.get(child);
        if (weight == uniqueWeight){
            //console.log("Found unique child: ", child);
            uniqueChild = child;
        }  
    }
    )

    return uniqueChild;
}


// Returns the discs that have a parent
function getChildren() {
    const children = new Set(discs.values().toArray().flat());
    return children;
}


// Returns the unique value of array (undefined if all same or more than one unique)
// If only two values in array, pick biggest one 
function findUnique(arr){
    // Base case
    if(arr.length == 1) return arr[0];

    // Check if more than two unique values
    const uniqueValues = new Set(arr);
    if(uniqueValues.size !== 2) return undefined;


    // Unique value will be at the end or beginning of sorted copy
    const copy = [...arr];
    copy.sort();

    // Return biggest value
    if(copy.length == 2) return copy[1]; 
    if(copy[0] == copy[1]){ 
        return copy.slice(-1)[0];
    }

    return copy[0];

}

// Assume array contains unique values except one
// Returns the non unique value
function findNonUnique(arr) {
    if (arr.length <= 2) return undefined;
    if (new Set(arr).size == arr.length) return undefined; // arr contains only unique values

    // Find non unique value
    const unique = findUnique(arr);
    var nonUnique = undefined;

    arr.forEach(e => { if (e !== unique) nonUnique = e; })
    return nonUnique;
}


// Includes the weight of the disc itself
function calcTotalWeight(disc) {
    const children = discs.get(disc);
    const weight = weights.get(disc);

    if (children == []) {
        return weight;
    }

    var totalWeight = weight;

    children.forEach(child => {
        totalWeight += calcTotalWeight(child);
    });

    return totalWeight;
}

// Parse input, save input as at ./Day7.txt
async function initDiscs() {
    const filePath = "./Day7.txt";
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        output: process.stdout,
        terminal: false,
    });


    // fwft (72) -> ktlj, cntj, xhth
    for await (const line of rl) {
        const parts = line.replace(/\s/g, "").split("->");

        // Extract name and weight
        const leftInfo = parts[0].split("(");
        //console.log(leftInfo);
        const name = leftInfo[0];
        const weight = parseInt(leftInfo[1].slice(0, -1));

        // Has children
        if (parts.length > 1) {
            const children = parts[1].split(",");
            discs.set(name, children);
        }
        // No children
        else {
            discs.set(name, []);
        }

        // Save weight
        weights.set(name, weight);
    }
}
