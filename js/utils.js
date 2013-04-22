function decime(myvar) {
    //adds .00 to integer and adds spaces in front of string variable for spacing numerics
    var mysp = '';
    if (myvar < 100) mysp = ' ';
    if (myvar < 10) mysp = '  ';
    mysp += myvar;
    var haszeros = mysp.indexOf('.');
    if (haszeros < 0) { mysp = mysp + '.00'; };
    return mysp;
}
function calcamt(perc, total) {
    //calculate an amount based on percentage and total
    var amt = total * perc / 100;
    return amt;
}
function calcperc(amt, total) {//calculate percentage based on amount and total
    var perc = amt / total * 100;
    return perc;
}

function totsizes() {
    size = parseFloat(document.getElementById("PanelSpesific_txtsize").value);
    outbsize = parseFloat(document.getElementById("PanelSpesific_txtoutbsize").value);
    altersize = parseFloat(document.getElementById("PanelSpesific_txtaltersize").value);
    garagesize = parseFloat(document.getElementById("PanelSpesific_txtgaragesize").value);
    totalsize = size + outbsize + altersize + garagesize;
    document.getElementById("PanelSpesific_txttotalsize").value = totalsize;
}
// *** These are the various client script implementation
// *** of the Callback handlers for the samples on this page
function calccom(whatfirst) {
    var Sc = document.getElementById("PanelStatus_txtPrice").value;
    var Oc = document.getElementById("PanelStatus_txtowner").value;
    var Cc = document.getElementById("PanelStatus_txtGrosscom").value;
    var S1 = Sc.replace(',', '');
    var O1 = Oc.replace(',', '');
    var C1 = Cc.replace(',', '');
    var S = parseFloat(S1);
    var O = parseFloat(O1);
    var C = parseFloat(C1);

    if (whatfirst == '1') { //selling price
        if (O == 0 || C == 0 || isNaN(O) || isNaN(C)) {
            return;
        }
        var n = confirm("New Owner Price - Adjust Selling Price");
        if (n) {
            lcform = document.getElementById('txtcalcsel').value;
            lcform = lcform.toUpperCase();
            var S = eval(lcform);
            S = decme(S);
            document.getElementById("PanelStatus_txtPrice").value = S;
            calccom('3');
        }
        return;
    }
    if (whatfirst == '2') {//Owner price
        if (S == 0 || C == 0 || isNaN(S) || isNaN(C)) {
            return;
        }
        var n = confirm("New Selling Price - Adjust Owner Price");
        if (n) {
            lcform = document.getElementById('txtcalcown').value
            lcform = lcform.toUpperCase();
            var O = eval(lcform);
            O = decme(O);
            document.getElementById("PanelStatus_txtowner").value = O;
            calccom('3');
        }
        return;
    }
    if (whatfirst == '3') {//Percentage
        if (O == 0 || S == 0 || isNaN(O) || isNaN(S)) {
            return;
        }
        lcform = document.getElementById('txtcalcper').value
        lcform = lcform.toUpperCase();
        var C = eval(lcform);
        C = decme(C);
        document.getElementById("PanelStatus_txtGrosscom").value = C;
    }
}
function setPOA() {
    var jispoa = document.getElementById('PanelStatus_txtPOA').checked;
    if (jispoa) {
        document.getElementById('PanelStatus_txtPrice').value = 999999999;
    } else {
        document.getElementById('PanelStatus_txtPrice').value = 0;
    }
}
function perccheck() {
    var percval = document.getElementById("PanelStatus_txtGrosscom").value;
    if (percval > 99.99) {
        alert('Cannot be more than 99.99 percent');
        document.getElementById("PanelStatus_txtGrosscom").focus();
    }
    calccom('2');
}

jQuery.fn.serializeObject = function () {
    var arrayData, objectData;
    arrayData = this.serializeArray();
    objectData = {};

    $.each(arrayData, function () {
        var value;

        if (this.value != null) {
            value = this.value;
        } else {
            value = '';
        }

        if (objectData[this.name] != null) {
            if (!objectData[this.name].push) {
                objectData[this.name] = [objectData[this.name]];
            }

            objectData[this.name].push(value);
        } else {
            objectData[this.name] = value;
        }
    });

    return objectData;
};