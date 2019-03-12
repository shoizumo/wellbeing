export class Dataset {
  constructor(wbData, pantheon, timeline) {
    this.wbData = wbData;
    this.pantheonData = pantheon;
    this.timeline = timeline;

    this.LadderArray = [];
    this.PositiveArray = [];
    this.NegativeArray = [];
    this.GDPArray = [];
    this.PantheonArray = [];


    this.LadderScoreArray = [];
    this.PositiveScoreArray = [];
    this.NegativeScoreArray = [];
    this.GDPScoreArray = [];
    this.PantheonScoreArray = [];

    this.makeWellbeingDataset();
    this.makePantheonDataset();
    this.sortDataset();
  }

  /* data */
  get ladder() {
    return this.LadderArray;
  }

  get positive() {
    return this.PositiveArray;
  }

  get negative() {
    return this.NegativeArray;
  }

  get gdp() {
    return this.GDPArray;
  }

  get pantheon() {
    return this.PantheonArray;
  }


  /* score */
  get ladderScore() {
    return this.LadderScoreArray;
  }

  get positiveScore() {
    return this.PositiveScoreArray;
  }

  get negativeScore() {
    return this.NegativeScoreArray;
  }

  get gdpScore() {
    return this.GDPScoreArray;
  }

  get pantheonScore() {
    return this.PantheonScoreArray;
  }


  /* max */
  get ladderMax() {
    return this.LadderScoreArray[0].score;
  }

  get positiveMax() {
    return this.PositiveScoreArray[0].score;
  }

  get negativeMax() {
    return this.NegativeScoreArray[0].score;
  }

  get gdpMax() {
    return this.GDPScoreArray[0].score;
  }

  // get pantheonrMax() {
  //   return this.PantheonScoreArray[0].score;
  // }


  /* min */
  get ladderMin() {
    return this.LadderScoreArray[this.LadderScoreArray.length - 1].score;
  }

  get positiveMin() {
    return this.PositiveScoreArray[this.PositiveScoreArray.length - 1].score;
  }

  get negativeMin() {
    return this.NegativeScoreArray[this.NegativeScoreArray.length - 1].score;
  }

  get gdpMin() {
    return this.GDPScoreArray[this.GDPScoreArray.length - 1].score;
  }

  // get pantheonrMin() {
  //   return this.PantheonScoreArray[this.PantheonScoreArray.length - 1].score;
  // }


  makeWellbeingDataset() {
    for (let i = 0, l = Object.keys(this.wbData).length; l > i; i++) {
      let wb = this.wbData[i];
      let ladder = {country: wb.country, rank: wb.lRank, score: wb.ladder};
      let positive = {country: wb.country, rank: wb.pRank, score: wb.positive};
      let negative = {country: wb.country, rank: wb.nRank, score: wb.negative};
      let logGdp = {country: wb.country, rank: wb.gRank, score: wb.logGdp};

      this.LadderArray.push(ladder);
      this.PositiveArray.push(positive);
      this.NegativeArray.push(negative);
      this.GDPArray.push(logGdp);

      this.LadderScoreArray.push(ladder);
      this.PositiveScoreArray.push(positive);
      this.NegativeScoreArray.push(negative);
      this.GDPScoreArray.push(logGdp);
    }
  }

  makePantheonDataset() {
    for (let i = 0, l = Object.keys(this.pantheonData).length; l > i; i++) {
      let P = this.pantheonData[i];
      let p = {country: P.country, rank: P.rank, score: P.nPeople};

      this.PantheonArray.push(p);
      this.PantheonScoreArray.push(p);
    }
  }

  sortDataset() {
    this.sortDesc(this.LadderArray, 'country');
    this.sortDesc(this.PositiveArray, 'country');
    this.sortDesc(this.NegativeArray, 'country');
    this.sortDesc(this.GDPArray, 'country');
    this.sortDesc(this.PantheonArray, 'country');

    this.sortDesc(this.LadderScoreArray, 'rank');
    this.sortDesc(this.PositiveScoreArray, 'rank');
    this.sortDesc(this.NegativeScoreArray, 'rank');
    this.sortDesc(this.GDPScoreArray, 'rank');
    this.sortDesc(this.PantheonScoreArray, 'rank');
  }


  sortDesc(array, type) {
    array.sort(function sortRank(a, b) {
      if (a[type] < b[type]) {
        return -1;
      }
      else if (a[type] > b[type]) {
        return 1;
      }
      return 0;
    });
  }
}

