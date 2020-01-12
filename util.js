function randRange(low, high) {
    return (Math.random() * (high-low)) + low;
}

function randInt(low, high) {
    return Math.floor((Math.random() * (high-low + 1)) + low);
}

function randSelect(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function probability(prob) {
    return Math.random() < prob;
}

function selectRandomN(arr, n) {
    let selections = [];
    for (let i = 0; i < n; i++) {
        let index = randInt(0, arr.length - 1);
        if (selections.indexOf(index) < 0) {
            selections.push(index);
        } else i--;
    }
    return arr.filter((s, i) => selections.indexOf(i) >= 0);
}

function average(arr) {
    return arr.reduce((s, v) => s + v, 0) / arr.length;
}

let size = {w: 1200, h: 700};