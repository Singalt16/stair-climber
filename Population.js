class Population {

    constructor(size) {
        this.generation = 1;
        this.size = size;
        this.druids = [];
        this.scores = [];
        for (let i = 0; i < size; i++) {
            this.druids.push(new Druid());
            this.scores.push(0);
        }
    }

    updateScores() {
        for (let i = 0; i < this.size; i++) {
            let currScore = this.druids[i].getScore();
            if (currScore > this.scores[i]) this.scores[i] = currScore;
        }
    }

    repopulate() {
        let pool = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.scores[i]; j++) {
                pool.push(this.druids[i]);
            }
        }

        let nextGen = [];
        let nextScores = [];
        for (let i = 0; i < this.size; i++) {
            nextGen.push(Druid.breed(randSelect(pool), randSelect(pool)));
            nextScores.push(0);
        }
        this.druids = nextGen;
        this.scores = nextScores;
        this.generation++;
    }
}