


let selectedType = returnSelectedWBtype();
console.log(selectedType);
dataList[selectedType].drawHist(2000, 'new');


        const wbType = {'ladderData': 0, 'positiveData': 1, 'negativeData': 2, 'gdpData': 3};
        const type = e.target.id.slice(0, -4) + 'Data';
        const index = wbType[type];
        setSelectedWBButton(index);
        dataList[type].drawHist(2000, 'new');



        this.context.globalAlpha


this.canvas.setAlpha(0.5);


this.svgRankText.t4, 500, countryWbData['gdp'], this.svgScoreText.s4);


if (canvasWidth < w1000) {
  // svgRadius = 40;
  t1.setAttributeNS(null, "font-size", "22px");
  t2.setAttributeNS(null, "font-size", "22px");
  t3.setAttributeNS(null, "font-size", "22px");
  t4.setAttributeNS(null, "font-size", "22px");
  s1.setAttributeNS(null, "font-size", "12px");
  s2.setAttributeNS(null, "font-size", "12px");
  s3.setAttributeNS(null, "font-size", "12px");
  s4.setAttributeNS(null, "font-size", "12px");

} else {
  // svgRadius = 48;
  t1.setAttributeNS(null, "font-size", "28px");
  t2.setAttributeNS(null, "font-size", "28px");
  t3.setAttributeNS(null, "font-size", "28px");
  t4.setAttributeNS(null, "font-size", "28px");
  s1.setAttributeNS(null, "font-size", "16px");
  s2.setAttributeNS(null, "font-size", "16px");
  s3.setAttributeNS(null, "font-size", "16px");
  s4.setAttributeNS(null, "font-size", "16px");
}


     attrTextFontsize(sizeStr) {
       this.svgRankText.t1.setAttributeNS(null, "font-size", sizeStr);
       this.svgRankText.t2.setAttributeNS(null, "font-size", sizeStr);
       this.svgRankText.t3.setAttributeNS(null, "font-size", sizeStr);
       this.svgRankText.t4.setAttributeNS(null, "font-size", sizeStr);
     }

     attrScoreFontsize(sizeStr) {
       this.svgScoreText.s1.setAttributeNS(null, "font-size", sizeStr);
       this.svgScoreText.s2.setAttributeNS(null, "font-size", sizeStr);
       this.svgScoreText.s3.setAttributeNS(null, "font-size", sizeStr);
       this.svgScoreText.s4.setAttributeNS(null, "font-size", sizeStr);
     }