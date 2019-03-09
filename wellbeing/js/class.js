


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