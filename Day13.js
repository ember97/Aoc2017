const testInstructions = ['Alice would gain 54 happiness units by sitting next to Bob.', 'Alice would lose 79 happiness units by sitting next to Carol.',
      'Bob would lose 63 happiness units by sitting next to David.',
      'Bob would gain 83 happiness units by sitting next to Alice.', 
      'Carol would gain 55 happiness units by sitting next to David.',
      'David would gain 46 happiness units by sitting next to Alice.'];


class Pair{

    // Alice would gain 54 happiness units by sitting next to Bob.
    // -> new Pair('Alice', 'Bob', 54)
    constructor(g1,g2,happiness){
        this.guest1 = g1;
        this.guest2 = g2;
        this.happiness = happiness;
    }

}



// Alice would gain 54 happiness units by sitting next to Bob.
// -> return new Pair('Alice', 'Bob', 54)
function createPair(str){
    const arr = str.split(' ');
    const guest1 = arr[0];
    var guest2 = arr[arr.length-1];

    // Extract the happiness units
    const happiness = arr[2] == 'gain' ? parseInt(arr[3]) : ( - parseInt((arr[3])));

    return new Pair(guest1, guest2, happiness);
}


// Turn instructions into a list of pairs
function parseInput(){
    const instructions = readFileLines('Day13.txt');
    return instructions.map(createPair);
}

const fs = require('fs');
const path = require('path');

// Function to read a file and return an array of strings, each representing a line in the file
function readFileLines(filePath) {
    // Read the file synchronously
    const data = fs.readFileSync(filePath, 'utf8');
    // Split the file content by newline to get an array of lines
    const lines = data.split('\n');
    return lines.map(trimString); // Remove new line character
}



function trimString(str){
    const tmp = str.trimEnd(); // Remove newlines
    // Regular expression to match trailing punctuation marks
    const punctuationRegex = /[.]$/;
    // Remove the trailing punctuation mark if it exists
    return punctuationRegex.test(tmp.charAt(tmp.length - 1)) ? tmp.slice(0, -1) : tmp;
}




// Return the specified pair from a list of pairs
function findPair(g1, g2, list){
    console.log("Trying to find a pair");
    console.log("g1: " + g1);
    console.log("g2: " + g2)
    return list.filter((p) => (p.guest1 == g1 && p.guest2 == g2))[0];
}

//console.log(findTwinPair(new Pair('Alice', 'Bob', 54), parseInput(testInstructions)));


// Returns a list of truples where the total happiness is calculated between each pair of people
function calcTotalPairSums(instructions){
    const guests = Array.from(getAllGuests(instructions));
    const pairs = parseInput(instructions);
    const totalSums = [];

    // For each person, check the total happiness with the other guests
    for(var i=0; i < guests.length-1; i++){
        const person = guests[i];

        console.log("person: " + person);
        
        for(var j=i+1; j < guests.length; j++){
            const otherPerson = guests[j];

            console.log("other person: " + otherPerson);

            const h1 = findPair(person, otherPerson, pairs).happiness; // Happiness Alice -> Bob
            const h2 = findPair(otherPerson, person, pairs).happiness; // Happiness Bob -> Alice

            totalSums.push([person, otherPerson, h1+h2]);
        }
    }
    console.log(totalSums);

    return totalSums;
}

//calcTotalPairSums(parseInput());


// Get all people to be seated
function getAllGuests(instructions){
    return new Set([...instructions].map(p => p.guest1));
}

// The main function, using a greedy search
function iter(instructions){
    const guests = getAllGuests(instructions);
    const nOfGuests = guests.length;
    const totalSums = calcTotalPairSums(parseInput(instructions));
    const happiestCouple = [...totalSums].sort[0];
    var totalHappiness = 0;
    totalHappiness+=happiestCouple.happiness;

    // A circular array to seat guests at table
    const seatedGuests = [];
    seatedGuests.push(happiestCouple.g1);
    seatedGuests.push(happiestCouple.g2);


    while(seatedGuests.length < nOfGuests){
        // The guests seated at the table that only have one neighbor
        const guestL = seatedGuests[0];
        const guestR = seatedGuests[seatedGuests.length-1];

        // Place the next person at the table that optimizes the total happiness 
        // without changing any placements of the people already seated at the table
       

    }


}


function findOptimalPartner(guest, totalSums){
    console.log("Total sums: " + totalSums);
    const highestSum = totalSums.filter(p => p.g1 == guest || p.g2 == guest).sort(sum => sum[2]); // ['Alice', 'Bob', 137]
    console.log(highestSum);
    return highestSum[0] == guest ? highestSum[1] : highestSum[0];
}

findOptimalPartner('Alice', calcTotalPairSums(parseInput()));


