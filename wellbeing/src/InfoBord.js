export class InfoBord {
  constructor(datasetObj, locationObj) {
    this.dataset = datasetObj;
    this.location = locationObj;
    this.positiveTween = '';
    this.negativeTween = '';
    this.gdpTween = '';


    this.countryNameDisplayed = '';
    this._countryNameOnLand = '';
    this.isFirstDisplay = true;


    const t1 = this.createRankText('Ladder');
    const t2 = this.createRankText('Positive');
    const t3 = this.createRankText('Negative');
    const t4 = this.createRankText('GDP');

    const s1 = this.createScoreText('Ladder');
    const s2 = this.createScoreText('Positive');
    const s3 = this.createScoreText('Negative');
    const s4 = this.createScoreText('GDP');

    this.svgRankText = {t1, t2, t3, t4};
    this.svgScoreText = {s1, s2, s3, s4};


    this.w1000 = 1000;

    this.tweenWb1 = '';
    this.tweenWb2 = '';
    this.tweenP1 = '';
    this.tweenP2 = '';

    this.isPantheon = false;

    this.infoBtn = document.getElementsByClassName('infoType');
    this.setInfoBtn();

    this.timelineSVG = $('#infoBoardTimeline')[0].children[1];
    this.timelineDuration = 0.07;
    this.timelineOffset = 20;
    this.timelineYearList = [2005, 2006, 2007, 2008, 2009, 20010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
    this.timelineOffset = 20;

    this.timelineSetInterval = '';
  }

  setInfoBtn() {
    for (let i = 0, l = this.infoBtn.length; i < l; i++) {
      this.infoBtn[i].addEventListener('click', (e) => {
        $(".infoType").removeClass("selectedBtn");
        this.infoBtn[i].classList.add("selectedBtn");
        let infoType = e.target.id.slice(4,);
        if (infoType === 'Text') {
          console.log('text');
          this.setInfoTypeText();
        } else if (infoType === 'Piechart') {
          console.log('piechart');
          this.setInfoTypePiechart();
        } else if (infoType === 'Linechart') {
          console.log('linechart');
          this.setInfoTypeLinechart();
        } else {
          console.log('none');
          this.setInfoTypeNone();
        }
      })
    }
  }

  get windowWidth() {
    return window.innerWidth;
  }

  get width() {
    if (this.windowWidth < 680) {
      return 320;
    } else if (this.windowWidth >= 680 && this.windowWidth < 800) {
      return 480;
    } else if (this.windowWidth >= 800 && this.windowWidth < 1000) {
      return 600;
    } else {
      return 800;
    }
  }

  get height() {
    return this.windowWidth < 1000 ? 80 : 105;
  }

  get countryNameOnLand(){
    return this._countryNameOnLand;
  }

  set countryNameOnLand(name){
    this._countryNameOnLand = name;
  }

  radius() {
    return this.windowWidth < this.w1000 ? 40 : 48;
  }


  createRankText(type) {
    let px;
    if (this.windowWidth < this.w1000) {
      px = "22px";
    } else {
      px = "28px";
    }
    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttributeNS(null, "x", '50%');
    text.setAttributeNS(null, "y", '50%');
    text.setAttributeNS(null, 'text-anchor', 'middle');
    text.setAttributeNS(null, 'dominant-baseline', 'central');
    text.setAttributeNS(null, "fill", "#ffffff");
    text.setAttributeNS(null, "font-size", px);
    text.setAttributeNS(null, "class", "info" + type);
    text.setAttributeNS(null, "id", "info" + type);
    return text;
  }

  createScoreText(type) {
    let px;
    if (this.windowWidth < this.w1000) {
      px = "12px";
    } else {
      px = "16px";
    }
    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttributeNS(null, "x", '50%');
    text.setAttributeNS(null, "y", '70%');
    text.setAttributeNS(null, 'text-anchor', 'middle');
    text.setAttributeNS(null, 'dominant-baseline', 'central');
    text.setAttributeNS(null, "fill", "#eeeeee");
    text.setAttributeNS(null, "font-size", px);
    text.setAttributeNS(null, "class", "info" + type);
    return text;
  }

  displayInfo(countryName) {
    this.countryNameDisplayed = countryName;
    if (!this.isFirstDisplay) {
      TweenMax.killAll();
      this.positiveTween.cancel();
      this.negativeTween.cancel();
      this.gdpTween.cancel();
    }
    this.clearInfo();
    let res = this.calcWbInfo(countryName);
    $('#infoBoard').css({opacity: 0.8});
    $('#infoBoardTimeline').css({opacity: 0.8});
    $('#tooltip').css({opacity: 0.0});



    if (typeof res !== 'undefined') {
      this.displayVisualInfo(res, Object.keys(this.dataset.wbData).length);
      this.displayTextInfo(countryName, res);  // テキストでの結果表示

      if (!this.isPantheon) {
        if ($('.infoType.selectedBtn')[0].id.slice(4,) === 'Linechart') {
          let wellbeingType = $('.wbButton1.selectedBtn')[0].id.slice(0, -4);
          this.displayTimeline(wellbeingType, countryName, this.timelineSVG, this.timelineOffset);
        }
      }
    } else {
      this.displayVisulalNoInfo();
      this.displayTextNoInfo(countryName);
      if (!this.isPantheon) {
        if ($('.infoType.selectedBtn')[0].id.slice(4,) === 'Linechart') {
          this.displayTimelineNoInfo(countryName);
        }
      }
    }
    // display pantheon data / no data
    this.displayPantheon(countryName);

    // well-beingデータがあってもなくても移動(念の為、データの有無を確認)
    let locationResult = this.location.countrynameToLatlon(countryName);
    if (typeof locationResult.latitude !== 'undefined') {
      let latitude = locationResult.latitude;
      let longitude = locationResult.longitude;
      // Location.moveCamera(latitude, longitude);

       this.location.moveCamera(latitude, longitude);

      // $('#country').empty().append(countryName);
      // $('#country4').empty().append(countryName);
    }
  }


  /* ulility */
  calcWbInfo(countryName) {
    for (let i = 0, l = Object.keys(this.dataset.wbData).length; l > i; i++) {
      if (this.dataset.wbData[i].country === countryName) {
        return this.dataset.wbData[i];
      }
    }
  }

  attrTextFontsize() {
    const size = this.windowWidth < 1000 ? '22px' : '28px';
    this.svgRankText.t1.setAttributeNS(null, "font-size", size);
    this.svgRankText.t2.setAttributeNS(null, "font-size", size);
    this.svgRankText.t3.setAttributeNS(null, "font-size", size);
    this.svgRankText.t4.setAttributeNS(null, "font-size", size);
  }

  attrScoreFontsize() {
    const size = this.windowWidth < 1000 ? '12px' : '16px';
    this.svgScoreText.s1.setAttributeNS(null, "font-size", size);
    this.svgScoreText.s2.setAttributeNS(null, "font-size", size);
    this.svgScoreText.s3.setAttributeNS(null, "font-size", size);
    this.svgScoreText.s4.setAttributeNS(null, "font-size", size);
  }

  putRankOrdinal(rank) {
    let ordinal;
    let rankStr = rank.toString();
    rankStr = rankStr.substring(rankStr.length - 1, rankStr.length);
    if (rankStr === '1') {
      ordinal = 'st'
    } else if (rankStr === '2') {
      ordinal = 'nd'
    } else if (rankStr === '3') {
      ordinal = 'rd'
    } else {
      ordinal = 'th'
    }
    return ordinal;
  }


  clearInfo() {
    $($('#LadderRanking').children().children()[2]).attr('r', 0.0);
    $($('#PositiveRanking').children().children()[2]).attr('r', 0.0);
    $($('#NegativeRanking').children().children()[2]).attr('r', 0.0);
    $($('#GDPRanking').children().children()[2]).attr('r', 0.0);

    $('.infoLadder').attr('opacity', 0.0);
    $('.infoPositive').attr('opacity', 0.0);
    $('.infoNegative').attr('opacity', 0.0);
    $('.infoGDP').attr('opacity', 0.0);
  }


  /* visual */
  displayRanking(type, rank, num, duration, rankText, score, scoreText) {
    let id = '#' + type + 'Ranking';
    let svg = $(id).children().children()[2];
    let radius = (num - rank + 1) / num * this.radius(); // responsive
    let rankOrdinal;
    let scoreUnit = type === 'GDP' ? 'US$' : 'pt';
    rankOrdinal = this.putRankOrdinal(rank);

    TweenMax.fromTo(svg, duration,
        {attr: {r: 0}},
        {
          attr: {r: radius},
          ease: Power1.easeInOut,
          onComplete: function () {
            rankText.innerHTML = String(rank) + "<tspan font-size='12px'>" + rankOrdinal + "</tspan>";
            $(id).children()[0].appendChild(rankText);
            scoreText.textContent = '(' + String(score.toFixed(1)) + scoreUnit + ')';
            $(id).children()[0].appendChild(scoreText);

            $('.info' + type).attr('opacity', 1.0);
          }
        });
  }


  createPromise(type, rank, num, svgDuration, text, nextStartDuration, score, scoreText) {
    let promise;
    let timeout;
    promise = new Promise((resolve) => {
      timeout = setTimeout(() => {
        resolve(this.displayRanking(type, rank, num, svgDuration, text, score, scoreText));
      }, nextStartDuration)
    });
    return {
      promise: promise,
      cancel: function () {
        clearTimeout(timeout);
        // isClicked = false;
      }
    };
  }


  displayVisualInfo(countryWbData, wbLength) {
    this.attrTextFontsize();
    this.attrScoreFontsize();
    new Promise((resolve) => {
      resolve(this.displayRanking('Ladder', countryWbData['lRank'], wbLength, 1.0, this.svgRankText.t1, countryWbData['ladder'], this.svgScoreText.s1));
    }).then(() => {
      this.positiveTween = this.createPromise('Positive', countryWbData['pRank'], wbLength, 1.0, this.svgRankText.t2, 500, countryWbData['positive'], this.svgScoreText.s2);
      return this.positiveTween.promise;
    }).then(() => {
      this.negativeTween = this.createPromise('Negative', countryWbData['nRank'], wbLength, 1.0, this.svgRankText.t3, 500, countryWbData['negative'], this.svgScoreText.s3);
      return this.negativeTween.promise;
    }).then(() => {
      this.gdpTween = this.createPromise('GDP', countryWbData['gRank'], wbLength, 1.0, this.svgRankText.t4, 500, countryWbData['gdp'], this.svgScoreText.s4);
      this.isFirstDisplay = false;
      return this.gdpTween.promise;
    }).catch(() => {
      console.error('Something wrong!')
    });
  }

  displayVisulalNoInfo() {
    this.attrTextFontsize();
    this.attrScoreFontsize();
    setTimeout(() => {
      this.svgRankText.t1.textContent = 'No data';
      $('#LadderRanking').children()[0].appendChild(this.svgRankText.t1);
      this.svgRankText.t2.textContent = 'No data';
      $('#PositiveRanking').children()[0].appendChild(this.svgRankText.t2);
      this.svgRankText.t3.textContent = 'No data';
      $('#NegativeRanking').children()[0].appendChild(this.svgRankText.t3);
      this.svgRankText.t4.textContent = 'No data';
      $('#GDPRanking').children()[0].appendChild(this.svgRankText.t4);

      $('#infoLadder').attr('opacity', 1.0);
      $('#infoPositive').attr('opacity', 1.0);
      $('#infoNegative').attr('opacity', 1.0);
      $('#infoGDP').attr('opacity', 1.0);
    }, 500);
  }


  /* text */
  displayTextInfo(countryName, countryWbData) {
    let lRank = countryWbData['lRank'];
    let pRank = countryWbData['pRank'];
    let nRank = countryWbData['nRank'];
    let gRank = countryWbData['gRank'];

    this.fadeInfoBoardText();
    setTimeout(() => {
      this.tweenWb1 = TweenMax.to("#country2", 1.0, {
        opacity: 1.0,
        onComplete: () => {
          this.tweenWb2 = TweenMax.to(".infoBoardContent2", 1.0, {
            opacity: 1.0,
          });
        }
      })
    }, 1000);

    document.getElementById("country2").innerHTML = countryName;
    document.getElementById("Ladder2").innerHTML = '- L : ' + lRank + this.putRankOrdinal(lRank);
    document.getElementById("Positive2").innerHTML = '- P : ' + pRank + this.putRankOrdinal(pRank);
    document.getElementById("Negative2").innerHTML = '- N : ' + nRank + this.putRankOrdinal(nRank);
    document.getElementById("GDP2").innerHTML = '- G : ' + gRank + this.putRankOrdinal(gRank);

    // small text for pantheon
    document.getElementById("Ladder2s").innerHTML = '- L : ' + lRank + this.putRankOrdinal(lRank);
    document.getElementById("Positive2s").innerHTML = '- P : ' + pRank + this.putRankOrdinal(pRank);
    document.getElementById("Negative2s").innerHTML = '- N : ' + nRank + this.putRankOrdinal(nRank);
    document.getElementById("GDP2s").innerHTML = '- G : ' + gRank + this.putRankOrdinal(gRank);
  }

  displayTextNoInfo(countryName) {
    this.fadeInfoBoardText();
    setTimeout(() => {
      this.tweenWb1 = TweenMax.to("#country2", 1.0, {
        opacity: 1.0,
        onComplete: () => {
          this.tweenWb2 = TweenMax.to(".infoBoardContent2", 1.0, {
            opacity: 1.0,
          });
        }
      })
    }, 1000);

    document.getElementById("country2").innerHTML = countryName;
    document.getElementById("Ladder2").innerHTML = 'No data';
    document.getElementById("Positive2").innerHTML = '';
    document.getElementById("Negative2").innerHTML = '';
    document.getElementById("GDP2").innerHTML = '';

    // small text for pantheon
    document.getElementById("Ladder2s").innerHTML = 'No data';
    document.getElementById("Positive2s").innerHTML = '';
    document.getElementById("Negative2s").innerHTML = '';
    document.getElementById("GDP2s").innerHTML = '';
  }


  /* timeline */
  displayTimeline(type, countryName, svg, offset) {
    this.deleteTimeline();
    let data;
    for (let i = 0, l = Object.keys(this.dataset.timeline).length; i < l; i++) {
      if (this.dataset.timeline[i]['country'] === countryName) {
        data = this.dataset.timeline[i][type];
      }
    }
    let rank = this.searchTimelineRank(type, countryName);
    const spanSize = '<span style="font-size: 18px;">';
    const spanWeight = '<span style="font-weight: 200;">';
    document.getElementById("country4").innerHTML = countryName + spanWeight + ' ( ' + type.slice(0, 1).toUpperCase() + ':' + rank.rank + spanSize + rank.rankOrdinal + '</span>' + ' ) ' + '</span>';
    let max, min;
    if (type === 'ladder') {
      max = this.dataset.ladderMax;
      min = this.dataset.ladderMin;
    } else if (type === 'positive') {
      max = this.dataset.positiveMax;
      min = this.dataset.positiveMin;
    } else if (type === 'negative') {
      // negativeは順位が逆
      max = this.dataset.negativeMin;
      min = this.dataset.negativeMax;
    } else {
      max = this.dataset.gdpMax;
      min = this.dataset.gdpMin;
    }
    let timeLen = data.length;
    let w = (this.width - offset * 2) / (timeLen - 1);
    let startX, startY, endX, endY;

    max = max * 1.1;
    min = min * 0.5;


    let i = 0;
    let isPathFirst = true;
    this.timelineSetInterval = setInterval(() => {
      this.addTimelineScale(this.timelineYearList, this.timelineOffset, i);

      let h = (data[i] - min) / (max - min) * this.height;
      endX = w * i + offset;
      endY = this.height - h;

      // データが有るときのみ描画、無いときはスキップして次の点と結ぶ
      if (data[i] !== -999) {
        // 1回目は点のみ
        if (isPathFirst) {
          this.svgMarker(endX, endY, svg);
          startX = endX;
          startY = endY;
          isPathFirst = !isPathFirst;
        } else {
          this.drawTimelinePath(startX, startY, endX, endY, this.timelineSVG);
          startX = endX;
          startY = endY;
        }
      }
      i++;
      if (i > timeLen - 1) {

        clearInterval(this.timelineSetInterval);
      }
    }, this.timelineDuration * 1500);
  }


  drawTimelinePath(startX, startY, endX, endY, svg) {
    // create line
    let line = this.svgLine(startX, startY, endX, endY, svg);

    // line animation
    TweenMax.fromTo(line, this.timelineDuration,
        {attr: {x2: startX, y2: startY}},
        {
          attr: {x2: endX, y2: endY},
          ease: CustomEase.create("custom", "M0,0,C-0.024,0.402,0.456,0.48,0.5,0.5,0.622,0.556,0.978,0.616,1,1"),
          onComplete: () => {
            this.svgMarker(endX, endY, svg)
          }
        })
  }


  svgLine(startX, startY, endX, endY, svg) {
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', startX);
    line.setAttribute('y1', startY);
    line.setAttribute('x2', endX);
    line.setAttribute('y2', endY);
    line.setAttribute("stroke", "#ffffff");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
    return line;
  }


  svgMarker(x, y, svg) {
    let marker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    marker.setAttribute("cx", x);
    marker.setAttribute("cy", y);
    marker.setAttribute("r", '4px');
    marker.setAttribute("fill", "#ffffff");
    svg.appendChild(marker);
  }


  searchTimelineRank(type, countryName) {
    let res = this.calcWbInfo(countryName);
    let rankKey = type.slice(0, 1) + 'Rank';
    let rank = res[rankKey];
    let rankOrdinal = this.putRankOrdinal(rank);

    return {rank: rank, rankOrdinal: rankOrdinal};
  }


  addTimelineScale(yearList, offset, index) {
    let timelineScaleArea = document.getElementById('infoBoardTimelineScale');
    let width = (timelineScaleArea.width.baseVal.value - offset * 2) / (yearList.length - 1);
    let px = '10px';

    let textX = String(width * index + offset) + 'px';
    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttributeNS(null, "x", textX);
    text.setAttributeNS(null, "y", '50%');
    text.setAttributeNS(null, 'text-anchor', 'middle');
    text.setAttributeNS(null, 'dominant-baseline', 'central');
    text.setAttributeNS(null, "fill", "#ffffff");
    text.setAttributeNS(null, "font-size", px);
    text.textContent = String(yearList[index]);
    timelineScaleArea.appendChild(text);
  }


  deleteTimeline() {
    let d = $('#infoBoardTimelineSvg')[0].children;
    let l = d.length;
    for (let i = 0; i < l; i++) {
      d[0].remove();
    }

    d = $('#infoBoardTimelineScale')[0].children;
    l = d.length;
    for (let i = 0; i < l; i++) {
      d[0].remove();
    }
    clearInterval(this.timelineSetInterval);
  }


  displayTimelineNoInfo(countryName) {
    this.deleteTimeline();
    document.getElementById("country4").innerHTML = countryName;

    setTimeout(() => {
      let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttributeNS(null, "x", '50%');
      text.setAttributeNS(null, "y", '50%');
      text.setAttributeNS(null, 'text-anchor', 'middle');
      text.setAttributeNS(null, 'dominant-baseline', 'central');
      text.setAttributeNS(null, "fill", "#ffffff");
      text.setAttributeNS(null, "font-size", '25px');
      text.textContent = 'No data';
      document.getElementById('infoBoardTimelineSvg').appendChild(text);
    }, 500);
  }


  /* pantheon */
  displayPantheon(countryName) {
    let infoBoardContent3 = document.getElementsByClassName('infoBoardContent3');
    let pIndex = -1;
    let url;
    let name;
    let occupation;
    let year;
    const path1 = '<a href=http://pantheon.media.mit.edu/people/';
    const path2 = ' target="_blank"> - ';
    const path3 = '</a>';
    const born = '<span style="font-size: 12px;"> born in </span>';
    const space = '<span style="font-size: 12px;"> </span>';

    for (let i = 0, l = Object.keys(this.dataset.pantheonData).length; l > i; i++) {
      if (this.dataset.pantheonData[i]['country'] === countryName) {
        pIndex = i;
      }
    }
    document.getElementById("country3").innerHTML = countryName;
    let numPanheonPeople = 5;
    for (let i = 0; numPanheonPeople > i; i++) {
      infoBoardContent3[i].innerHTML = ''; // clear previous result
    }
    if (pIndex !== -1) {
      let d = this.dataset.pantheonData[pIndex];
      for (let i = 0; d['name'].length > i; i++) {
        url = d['url'][i];
        name = d['name'][i];
        occupation = d['occ'][i];
        year = d['year'][i];
        infoBoardContent3[i].innerHTML = path1 + url + path2 + name + ' <span style="color:#dae1f7; font-size: 16px;">(' + space + occupation + born + year + space + ')</span>' + path3;
      }
    } else {
      infoBoardContent3[0].innerHTML = 'No data';
    }

    this.fadeInfoBoardPantheon();
    setTimeout(() => {
      this.tweenP1 = TweenMax.to("#country3", 1.0, {
        opacity: 1.0,
        onComplete: () => {
          $('.infoBoardContent3').css("display", 'block');
          this.tweenP2 = TweenMax.to(".infoBoardContent3", 1.0, {
            opacity: 1.0,
          });
        }
      })
    }, 1000);
  }


  setInfoTypeText() {
    $('#infoBoard').css("display", 'none');
    $('#infoBoard2').css("display", 'block');
    $('#infoBoardTimeline').css("display", 'none');

    $('#infoBoard2s').css("display", 'none');

    $(".infoType").removeClass("selectedBtn");
    this.infoBtn[0].classList.add("selectedBtn");
  };

  setInfoTypePiechart() {
    $('#infoBoard').css("display", 'grid');
    $('#infoBoard2').css("display", 'none');
    $('#infoBoardTimeline').css("display", 'none');

    $('#infoBoard2s').css("display", 'none');

    $(".infoType").removeClass("selectedBtn");
    this.infoBtn[1].classList.add("selectedBtn");
  };

  setInfoTypeLinechart() {
    $('#infoBoard').css("display", 'none');
    $('#infoBoard2').css("display", 'none');
    $('#infoBoardTimeline').css("display", 'grid');

    $('#infoBoard2s').css("display", 'none');

    $(".infoType").removeClass("selectedBtn");
    this.infoBtn[2].classList.add("selectedBtn");
  };

  setInfoTypePantheon() {
    $('#infoBoard').css("display", 'none');
    $('#infoBoard2').css("display", 'none');
    $('#infoBoardTimeline').css("display", 'none');

    $('#infoBoard2s').css("display", 'block');

    $(".infoType").removeClass("selectedBtn");
  };


  fadeInfoBoardVisual() {
    $('#infoBoard').css({opacity: 0.0});
    this.fadeInfoBoardLinechart();
  };

  fadeInfoBoardText() {
    $('#country2').css({opacity: 0.0});
    $('.infoBoardContent2').css({opacity: 0.0});
    this.fadeInfoBoardPantheon();
  };

  fadeInfoBoardLinechart() {
    $('#infoBoardTimeline').css({opacity: 0.0});
  };

  fadeInfoBoardPantheon() {
    $('#country3').css({opacity: 0.0});
    $('.infoBoardContent3').css({opacity: 0.0}).css("display", 'none');
  };


}

