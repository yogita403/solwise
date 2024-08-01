const CABLE = {
    "HDF200": {
        "name": "HDF200",
        "2400": 0.5,
        "5800": 0.9
    },
    "HDF400": {
        "name": "HDF400",
        "2400": 0.2,
        "5800": 0.5
    }
};


function loadDefaults() {
    //The default frequency
    var defFreq = 2400;

    $("#distance").val(100);
    $("#frequency").find("input:radio[value='" + defFreq + "']").click();

    /*SITE A*/
    $("#transmitPower").val(12);
    $("#transmitAntennaGain").val(8);
    $("#transmitCableLength").val(0);
    $("#transmitCableLossPerMetre").val(CABLE.HDF200.name);

    /*SITE B*/
    $("#receiverSensitivity").val(-90);
    $("#receiverAntennaGain").val(8);
    $("#receiverCableLength").val(0);
    $("#receiverCableLossPerMetre").val(CABLE.HDF200.name);
}

loadDefaults();


/*$("#product").change(function() {
    $.getJSON("js/resource.php?product=" + $(this).val(), function(response) {
        //Success?
        if(response.success) {
            alert("rxSens is " + response.data.rxSensitivity);
        } else {
            alert(response.message);
        }
    });
});*/

/*
Put functions here

Note:
Square Root: math.sqrt(val)
Log base 10: math.log10(val)
 */
function calcFresnalZone(distance, frequency) {
    return ((43.3*math.sqrt((Number(distance)*0.621)/(4*(Number(frequency)/1000))))*0.3048)*0.8;
}

function calcCableConLoss(noOfCons, frequency, length, lossPerMetre, noOfArrestors) {
    return (Number(noOfCons)*(math.sqrt(Number(frequency)/1000)*0.1))+(Number(length)*Number(lossPerMetre))+(Number(noOfArrestors)*0.5);
}

function calcFreeSpaceLoss(frequency, distance) {
    return (92.4+(20*(math.log10(Number(frequency)/1000))))+(20*(math.log10(Number(distance))));
}

function calcEIRP(transmitPower, transmitAntennaGain, transmitCableConLoss) {
    return (Number(transmitPower)+Number(transmitAntennaGain))-Number(transmitCableConLoss);
}

function calcReceivedSignal(EIRP, freeSpaceLoss, receiverAntennaGain, receiverCableConLoss) {
    return (Number(EIRP)-Number(freeSpaceLoss))+(Number(receiverAntennaGain) - Number(receiverCableConLoss));
}

function calcSystemOperatingMargin(receivedSignal, receiverSensitivty) {
    return (Number(receivedSignal) - Number(receiverSensitivty));
}


/*
Your program is here
 */
function runProgram() {

    var distance = $("#distance").val();
    var distanceUnit = $("#distance-unit").val();
    var frequency = $("input[name='frequency']:checked").val();

    $("#summaryDistance").text(distance + distanceUnit);
    $("#summaryFrequency").text(frequency);

    switch(distanceUnit) {
        case "m":
            distance = distance / 1000;
            break;
        case "mi":
            distance = distance * 1.60934;
            break;
        default:
            //distance = distance;
    }

    //var distance = $("#distance").val();

    //var frequency = $("#frequency").val();


    var txPower = $("#transmitPower").val();
    var txAntGain = $("#transmitAntennaGain").val();
    var txCableLen = $("#transmitCableLength").val();
    //var txCableLossPM = $("#transmitCableLossPerMetre").val();
    var txCableLossPM = CABLE[$("#transmitCableLossPerMetre").find("option:selected").val()][frequency];
    //var txLightningArrest = $("#transmitLightningArrestor").val();
    var txLightningArrest = $("#transmitLightningArrestor").is(":checked");
    //var txNoConnectors = $("#transmitNoOfConnectors").val();
    var txNoConnectors = 2;
    if(txLightningArrest) txNoConnectors = 4;

    var rxSensitivity = $("#receiverSensitivity").val();
    var rxAntGain = $("#receiverAntennaGain").val();
    var rxCableLen = $("#receiverCableLength").val();
    //var rxCableLossPM = $("#receiverCableLossPerMetre").val();
    var rxCableLossPM = CABLE[$("#receiverCableLossPerMetre").find("option:selected").val()][frequency];
    //var rxLightningArrest = $("#receiverLightningArrestor").val();
    var rxLightningArrest = $("#receiverLightningArrestor").is(":checked");
    //var rxNoConnectors = $("#receiverNoOfConnectors").val();
    var rxNoConnectors = 2;
    if(rxLightningArrest) rxNoConnectors = 4;

    var varFresnalZone = calcFresnalZone(distance, frequency);
    $("#FresnalZone").text(varFresnalZone.toFixed(2));

    var varTransmitCableConLoss = calcCableConLoss(txNoConnectors, frequency, txCableLen, txCableLossPM, txLightningArrest);
    $("#TransCableConLoss").text(varTransmitCableConLoss.toFixed(2));

    var varFreeSpaceLoss = calcFreeSpaceLoss(frequency, distance);
    $("#FreeSpaceLoss").text(varFreeSpaceLoss.toFixed(1));

    var varReceiverCableConLoss = calcCableConLoss(rxNoConnectors, frequency, rxCableLen, rxCableLossPM, rxLightningArrest);
    $("#ReceiverCableConLoss").text(varReceiverCableConLoss.toFixed(2));

    var varEIRP = calcEIRP(txPower, txAntGain, varTransmitCableConLoss);
    $("#EIRP").text(varEIRP.toFixed(2));

    var varReceivedSignal = calcReceivedSignal(varEIRP, varFreeSpaceLoss, rxAntGain, varReceiverCableConLoss);
    $("#ReceivedSignal").text(varReceivedSignal.toFixed(2));

    var varSystemOperatingMargin = calcSystemOperatingMargin(varReceivedSignal, rxSensitivity);
    $("#SystemOperatingMargin").text(varSystemOperatingMargin.toFixed(2));

    varSystemOperatingMargin = varSystemOperatingMargin.toFixed(2);


    // EIRP legality feedback
    var $EIRPLegal = $("#EIRPLegal");
    var $EIRPLegalWarning = $("#EIRPLegalWarning");
    if ((frequency == 2400 && varEIRP >= 20.00) || (frequency == 5800 && varEIRP >= 30.00)) {
        $EIRPLegal
            .attr('class', "text-danger");
        $EIRPLegalWarning.addClass("warn");
    } else {
        $EIRPLegal
            .removeAttr('class');
        $EIRPLegalWarning.removeClass("warn");
    }

    // System operating margin feedback
    var $linkQuality = $("#linkQuality");
    var $SOMRow = $("#SOMRow");

    var lQDOM = {
        elem: $("#linkQualityAlert"),
    };
    /*lQDOM.elem = $("#linkQualityAlert");*/
    lQDOM.icon = lQDOM.elem.find("#linkQualityAlert-Icon");
    lQDOM.msg = lQDOM.elem.find("#linkQualityAlert-Message");
    lQDOM.desc = lQDOM.elem.find("#linkQualityAlert-Desc");

    if(varSystemOperatingMargin >= 10) {
        //Optimal
        $linkQuality
            .text(varSystemOperatingMargin + " dB - The link quality is OPTIMAL")
            .attr("class", "label label-success");
        $SOMRow.attr("class", "success");

        lQDOM.elem.attr("class", "alert alert-success");
        lQDOM.icon.attr("class", "fa fa-stack-1x fa-check");
        lQDOM.msg.text("Optimal");
        lQDOM.desc.html("<strong>" + varSystemOperatingMargin + " dB</strong> - The link should be stable and consistent.");
    } else if (varSystemOperatingMargin > 6) {
        //Warning
        $linkQuality
            .text(varSystemOperatingMargin + " dB - The link quality is MARGINAL")
            .attr("class", "label label-warning");
        $SOMRow.attr("class", "warning");

        lQDOM.elem.attr("class", "alert alert-warning");
        lQDOM.icon.attr("class", "fa fa-stack-1x fa-exclamation");
        lQDOM.msg.text("Marginal");
        lQDOM.desc.html("<strong>" + varSystemOperatingMargin + " dB</strong> - The link may still work, but will likely be temperamental.");
    } else if(varSystemOperatingMargin < 6) {
        //Turj
        $linkQuality
            .text(varSystemOperatingMargin + " dB - The link quality is UNSATISFACTORY")
            .attr("class", "label label-danger");
        $SOMRow.attr("class", "danger");

        lQDOM.elem.attr("class", "alert alert-danger");
        lQDOM.icon.attr("class", "fa fa-stack-1x fa-remove");
        lQDOM.msg.text("Unsatisfactory.");
        lQDOM.desc.html("<strong>" + varSystemOperatingMargin + " dB</strong> - The link would be unlikely to work under these conditions.");
    }




    return false;
}


//FORM VALIDATION FUNCTION
 runProgram();

/**
 * Enable tooltips
 */
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});



