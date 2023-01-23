
function getPoiVal(){
    if (document.getElementById('Eingang').checked){
        console.log(0);
        return 0;
    }
    else if (document.getElementById('Toilette').checked){
        console.log(1);
        return 1;
    }
    
    else if (document.getElementById('Getränkeautomat').checked){
        console.log(2);
        return 2;
    }
    else if (document.getElementById('Mensa').checked){
        console.log(3)
        return 3;
    }
    else if (document.getElementById('Bankautomat').checked){
        console.log(4)
        return 4;
    }
    return null;
}

function getBarriereFree(){
    if (document.getElementById('barrierefrei').checked){
        return true;
    }
    return false;
}


async function getInputVal(id){
    var key = document.getElementById(id).value;
    const obj = await $.getJSON("oldraumliste.json");
    {
        for (data of obj) {
            if (data.Raum === key){
                return {
                    x : data.X,
                    y : data.Y,
                    stock : data.Stock
                };
            }
        }
        return {x : null,
                y : null,
                stock : null};

    }

}

function checkInputLogic(anfang, ende, poi){
    if (anfang != null && ende != null && poi == null){ // Anfang und Ende eingabe und kein POI
        return true;
    }
    else if(anfang != null && ende == null && poi != null){ // Anfang und kein Ende und POI
        return true;
    }
    else if(anfang == null && ende == null && poi == null){ //Anfang null ende null poi null
        console.log(1);
        document.getElementById('poi_error').innerHTML = "No POI selected!";
        document.getElementById('anf_error').innerHTML = "No starting point entered!";
        document.getElementById('end_error').innerHTML = "No ending point entered!";
        $("#poi_error").fadeOut(5000);
        $("#anf_error").fadeOut(5000);
        $("#end_error").fadeOut(5000);
        return false;
    }
    else if(anfang != null && ende == null && poi == null){ //Anfang vorhanden ende null poi null
        console.log(2);
        document.getElementById('poi_error').innerHTML = "Or no POI entered!";
        document.getElementById('end_error').innerHTML = "No ending point entered!";
        $("#poi_error").fadeOut(5000);
        $("#end_error").fadeOut(5000);
        return false;
    }
    else if(anfang == null && ende != null && poi == null){//Kein Anfang, nur ende vorhanden kein poi
        console.log(3);
        document.getElementById('anf_error').innerHTML = "No starting point entered!";
        $("#anf_error").fadeOut(5000);
        return false;
    }
    else if(anfang == null && ende != null && poi != null){//kein anfang, ende und poi vorhanden
        console.log(4);
        document.getElementById('anf_error').innerHTML = "No starting point entered!";
        document.getElementById('end_error').innerHTML = "POI and end can't get submitted together!";
        clearField("datasend");
        clearBox(poi);
        $("#anf_error").fadeOut(5000);
        $("#end_error").fadeOut(5000);
        return false;
    }
    else if(anfang == null && ende == null && poi != null){//kein anfang kein ende nur poi
        console.log(5);
        document.getElementById('anf_error').innerHTML = "No starting point entered!";
        $("#anf_error").fadeOut(5000);
        return false;
    }
    else if(anfang != null && ende != null && poi != null){
        console.log(6);
        document.getElementById('end_error').innerHTML = "POI and end can't get submitted together!";
        clearField("datasend");
        clearBox(poi);
        $("#end_error").fadeOut(5000);
    }
    return false;
}

function clearField(field){
    // ende -> id = "end",
    if (document.getElementById(field).value != null){
        document.getElementById(field).value = "";
    }
}

function clearBox(box){
    //poi -> id = "Toilette", id = "Cafeteria", id = "Automat", id="Eingang"
    if (document.getElementById(box).checked){
        document.getElementById(box).checked = false;
    }
}

function mapDisplay(){
    $("#treppe").hide();
    $("#eg0Map").show();
    $("#og1Map").hide();
    $("#og2Map").hide();
}

function checkInput(startx, endx){
    if (endx === null || startx === null){
        console.log("erste if")
        return false;
    }
    if (endx === 0 || startx === 0){
        console.log("zweite if")
        return false;
    }
    return true;
}

async function initPath() {
    'use strict';

    var stairs = [{
        "X": 20,
        "Y": 3
    }, {
        "X": 7,
        "Y": 3
    }, {
        "X": 7,
        "Y": 20
    }, {
        "X": 20,
        "Y": 20
    }
    ];
    var restrooms = [{
        "X": 17,
        "Y": 3
    }, {
        "X": 10,
        "Y": 20
    }];
    var automata2OG = [{
        "X": 18,
        "Y": 7,
    }, {
        "X": 6,
        "Y": 21
    }];

    var test1 = await getInputVal("anfang");
    var test2 = await getInputVal("ende");


    var poi = getPoiVal();
    var startY = test1.y - 1;
    var startX = test1.x - 1;
    var startSt = test1.stock.toString();
    var endY = test2.y - 1;
    var endX = test2.x - 1;
    var st = test2.stock.toString();
    if (poi === 1) {
        var list = nearest(startX, startY, restrooms);
        endX = list[1];
        endY = list[0];
        st = startSt;
    } else if (poi === 0) {
        endX = 6;
        endY = 15;
        st = startSt;
    } else if (poi === 2) {
        if (startSt === "0"){
            endX = 7;
            endY = 8;
            st = startSt;
        }
        else if(startSt === "1"){
            endX = 18;
            endY = 19;
            st = startSt;
        }
        else if(startSt === "2"){
            let list = nearest(startX, startY, automata2OG);

            endX = list[1];
            endY = list[0];
            console.log(endX)
            st = startSt;
        }
    }
    else if (poi === 4){
        endX = 5;
        endY = 14;
        st = "0";
    }
    var barriereFrei = getBarriereFree();

    var anfang = document.getElementById("anfang").value;
    var ende = document.getElementById("ende").value;


    if (ende === "") {
        ende = null;
    }

    if (anfang === "") {
        anfang = null;
    }

    if (!(checkInputLogic(anfang, ende, poi))) {
        return 0;
        await initPath();
    }
    document.getElementById('map').scrollIntoView();
    var stSwitch = false; //wenn in ein anderes Stockwerk gegangen wird dann true

    console.log(startX, startY, startSt, endX, endY, st)


// Entferne zuvor erstellen Path
    $(".grid-box").removeClass("start end waypoint path");
    $("#treppe").hide().html('<span class="glyphicon glyphicon-circle-arrow-up" aria-hidden="true"></span>');
    if (startSt === "0") {
        $("#eg0Map").show();
        $("#og1Map").hide();
        $("#og2Map").hide();
    } else if (startSt === "1") {
        $("#eg0Map").hide();
        $("#og1Map").show();
        $("#og2Map").hide();
    } else if (startSt === "2") {
        $("#eg0Map").hide();
        $("#og1Map").hide();
        $("#og2Map").show();
    }

// Start beim Eingang ACHTUNG: zuerst wird die Zeile angegeben, dann die Spalte!


    var endStairsList = nearest(endX, endY, stairs);
    var endStY = endStairsList[0];
    var endStX = endStairsList[1];
    var liftY = 7;
    var liftX = 6;
    var stockwerk = st;
    var start;
    var end;
    var end2;
    var start2;
// ist Startpunkt und Endpunkt im gleichen stock?
    if (startSt === st) {
        start = graph[st].grid[startY][startX];
        end = graph[st].grid[endY][endX];
        drawPath(st, start, end, false);
    }
    else {
        if (barriereFrei) {
            if (startSt === "0") {
                if (st === "1") {
                    stSwitch = true;
                    start = graph[0].grid[startY][startX];
                    end = graph[0].grid[liftY][liftX];
                    drawPath(0, start, end, false);

                    start2 = graph[stockwerk].grid[liftY][liftX];
                    end2 = graph[stockwerk].grid[endY][endX];
                    // Klicke auf den Treppe-Button, um in das andere Stockwerk zu gelangen
                    $("#treppe").append($("<strong>").text("Hier ")).append($("<strong>").text("klicken")).append(" um mit dem Lift in den " + stockwerk + ". Stock zu fahren").off("click touch").on("click touch", function () {
                        $("#eg0Map").hide();
                        $("#treppe").hide();
                        $("#og1Map").show();
                        drawPath(1, start2, end2, true);
                    });
                } else if (st === "2") {
                    stSwitch = true;
                    start = graph[0].grid[startY][startX];
                    end = graph[0].grid[liftY][liftX];
                    drawPath(0, start, end, false);
                    start2 = graph[2].grid[liftY][liftX];
                    end2 = graph[2].grid[endY][endX];
                    // Klicke auf den Treppe-Button, um in das andere Stockwerk zu gelangen
                    $("#treppe").append($("<strong>").text("Hier ")).append($("<strong>").text("klicken")).append(" um mit dem Lift in den " + stockwerk + ". Stock zu fahren").off("click touch").on("click touch", function () {
                        $("#eg0Map").hide();
                        $("#treppe").hide();
                        $("#og2Map").show();
                        drawPath(2, start2, end2, true);

                    });
                } else {
                    console.log("Oli den Stock gibts nicht");
                }
            }
            //startpunkt im 1.Stock und Endpunkt im 2. oder EG
            if (startSt === "1") {
                if (stockwerk === "0") {
                    stSwitch = true;
                    start = graph[1].grid[startY][startX];
                    end = graph[1].grid[liftY][liftX];
                    drawPath(1, start, end, false);
                    start2 = graph[stockwerk].grid[liftY][liftX];
                    end2 = graph[stockwerk].grid[endY][endX];
                    // Klicke auf den Treppe-Button, um in das andere Stockwerk zu gelangen
                    $("#treppe").append($("<strong>").text("Hier ")).append($("<strong>").text("klicken")).append(" um mit dem Lift ins EG zu fahren").off("click touch").on("click touch", function () {
                        $("#og1Map").hide();
                        $("#treppe").hide();
                        $("#eg0Map").show();
                        drawPath(0, start2, end2, true);
                    });
                } else if (stockwerk === "2") {
                    stSwitch = true;

                    start = graph[1].grid[startY][startX];
                    end = graph[1].grid[liftY][liftX];
                    drawPath(1, start, end);
                    start2 = graph[stockwerk].grid[liftY][liftX];
                    end2 = graph[stockwerk].grid[endY][endX];
                    // Klicke auf den Treppe-Button, um in das andere Stockwerk zu gelangen
                    $("#treppe").append($("<strong>").text("Hier ")).append($("<strong>").text("klicken")).append(" um mit dem Lift in den" + stockwerk + ". Stock zu fahren").off("click touch").on("click touch", function () {
                        $("#og1Map").hide();
                        $("#treppe").hide();
                        $("#og2Map").show();


                        drawPath(2, start2, end2);

                    });
                } else {
                    console.log("Oli den Stock gibts nicht");
                }
            }
            //startpunkt im 2.Stock und Endpunkt im 1. oder EG
            if (startSt === "2") {
                if (st === "0") {
                    stSwitch = true;

                    start = graph[startSt].grid[startY][startX];
                    end = graph[startSt].grid[liftY][liftX];
                    drawPath(startSt, start, end, false);
                    start2 = graph[stockwerk].grid[liftY][liftX];
                    end2 = graph[stockwerk].grid[endY][endX];
                    // Klicke auf den Treppe-Button, um in das andere Stockwerk zu gelangen
                    $("#treppe").append($("<strong>").text("Hier ")).append($("<strong>").text("klicken")).append(" um mit dem Lift ins EG zu fahren").off("click touch").on("click touch", function () {
                        $("#og2Map").hide();
                        $("#treppe").hide();
                        $("#eg0Map").show();


                        drawPath(st, start2, end2, true);
                    });
                } else if (st === "1") {
                    stSwitch = true;

                    start = graph[startSt].grid[startY][startX];
                    end = graph[startSt].grid[liftY][liftX];
                    drawPath(startSt, start, end, false);
                    start2 = graph[stockwerk].grid[liftY][liftX];
                    end2 = graph[stockwerk].grid[endY][endX];
                    // Klicke auf den Treppe-Button, um in das andere Stockwerk zu gelangen
                    $("#treppe").append($("<strong>").text("Hier ")).append($("<strong>").text("klicken")).append(" um mit dem Lift in den" + stockwerk + ". Stock zu fahren").off("click touch").on("click touch", function () {
                        $("#og2Map").hide();
                        $("#treppe").hide();
                        $("#og1Map").show();


                        drawPath(st, start2, end2, true);
                    });
                } else {
                    console.log("Oli den Stock gibts nicht");
                }
            }
        } else {
            //startpunkt im EG und Endpunkt im 1. oder 2. Stock
            if (startSt === "0") {
                if (st === "1") {
                    stSwitch = true;
                    start = graph[0].grid[startY][startX];
                    end = graph[0].grid[endStY][endStX];
                    drawPath(0, start, end, false);
                    start2 = graph[stockwerk].grid[endStY][endStX + 1];
                    end2 = graph[stockwerk].grid[endY][endX];
                    // Klicke auf den Treppe-Button, um in das andere Stockwerk zu gelangen
                    $("#treppe").append($("<strong>").text("Hier ")).append($("<strong>").text("klicken")).append(" um die Treppen in den " + stockwerk + ". Stock zu nehmen").off("click touch").on("click touch", function () {
                        $("#eg0Map").hide();
                        $("#treppe").hide();
                        $("#og1Map").show();
                        drawPath(1, start2, end2, true);
                    });
                } else if (st === "2") {
                    stSwitch = true;
                    start = graph[0].grid[startY][startX];
                    end = graph[0].grid[endStY][endStX];
                    drawPath(0, start, end, false);
                    start2 = graph[stockwerk].grid[endStY][endStX + 1];
                    end2 = graph[stockwerk].grid[endY][endX];
                    // Klicke auf den Treppe-Button, um in das andere Stockwerk zu gelangen
                    $("#treppe").append($("<strong>").text("Hier ")).append($("<strong>").text("klicken")).append(" um die Treppen in den " + stockwerk + ". Stock zu nehmen").off("click touch").on("click touch", function () {
                        $("#eg0Map").hide();
                        $("#treppe").hide();
                        $("#og2Map").show();
                        drawPath(2, start2, end2, true);

                    });
                } else {
                    console.log("Oli den Stock gibts nicht");
                }
            }
            //startpunkt im 1.Stock und Endpunkt im 2. oder EG
            if (startSt === "1") {
                if (stockwerk === "0") {
                    stSwitch = true;
                    start = graph[1].grid[startY][startX];
                    end = graph[1].grid[endStY][endStX];
                    drawPath(1, start, end, false);
                    start2 = graph[stockwerk].grid[endStY][endStX + 1];
                    end2 = graph[stockwerk].grid[endY][endX];
                    // Klicke auf den Treppe-Button, um in das andere Stockwerk zu gelangen
                    $("#treppe").append($("<strong>").text("Hier ")).append($("<strong>").text("klicken")).append(" um die Treppen ins EG zu nehmen").off("click touch").on("click touch", function () {
                        $("#og1Map").hide();
                        $("#treppe").hide();
                        $("#eg0Map").show();
                        drawPath(0, start2, end2, true);
                    });
                } else if (st === "2") {
                    stSwitch = true;
                    start = graph[1].grid[startY][startX];
                    end = graph[1].grid[endStY][endStX];
                    drawPath(1, start, end, false);
                    start2 = graph[stockwerk].grid[endStY][endStX + 1];
                    end2 = graph[stockwerk].grid[endY][endX];
                    // Klicke auf den Treppe-Button, um in das andere Stockwerk zu gelangen
                    $("#treppe").append($("<strong>").text("Hier ")).append($("<strong>").text("klicken")).append(" um die Treppen in den " + stockwerk + ". Stock zu nehmen").off("click touch").on("click touch", function () {
                        $("#og1Map").hide();
                        $("#treppe").hide();
                        $("#og2Map").show();


                        drawPath(2, start2, end2, true);

                    });
                } else {
                    console.log("Oli den Stock gibts nicht");
                }
            }
            //startpunkt im 2.Stock und Endpunkt im 1. oder EG
            if (startSt === "2") {
                if (st === "0") {
                    stSwitch = true;
                    start = graph[2].grid[startY][startX];
                    end = graph[2].grid[endStY][endStX];
                    drawPath(2, start, end, false);
                    start2 = graph[stockwerk].grid[endStY][endStX + 1];
                    end2 = graph[stockwerk].grid[endY][endX];
                    // Klicke auf den Treppe-Button, um in das andere Stockwerk zu gelangen
                    $("#treppe").append($("<strong>").text("Hier ")).append($("<strong>").text("klicken")).append(" um die Treppen ins EG zu nehmen").off("click touch").on("click touch", function () {
                        $("#og2Map").hide();
                        $("#treppe").hide();
                        $("#eg0Map").show();
                        drawPath(0, start2, end2, true);
                    });
                } else if (st === "1") {
                    stSwitch = true;
                    start = graph[2].grid[startY][startX];
                    end = graph[2].grid[endStY][endStX];
                    drawPath(2, start, end, false);
                    start2 = graph[stockwerk].grid[endStY][endStX + 1];
                    end2 = graph[stockwerk].grid[endY][endX];
                    // Klicke auf den Treppe-Button, um in das andere Stockwerk zu gelangen
                    $("#treppe").append($("<strong>").text("Hier ")).append($("<strong>").text("klicken")).append(" um die Treppen in den " + stockwerk + ". Stock zu nehmen").off("click touch").on("click touch", function () {
                        $("#og2Map").hide();
                        $("#treppe").hide();
                        $("#og1Map").show();


                        drawPath(1, start2, end2, true);

                    });
                } else {
                    console.log("Oli du den Stock gibts nicht");
                }
            }
        }
    }

    function drawPath(st, start, end, secondTime) {
        // astar anwenden
        var result = astar.search(graph[st], start, end);

        // Ergebnisse anzeigen
        for (var i = 0; i < result.length; i++) {
            (function (ind) {
                // jeden Wegpunkt nach 100 millisekunden hinzufügen
                setTimeout(function () {
                    if (ind < result.length - 1) {
                        // Style für jeden gefundenen Wegpunkt hinzufügen
                        gridElems[st][result[ind].x][result[ind].y].classList.add('waypoint', 'path');
                    } else {
                        // Style für Endpunkt hinzufügen
                        gridElems[st][result[ind].x][result[ind].y].classList.add('waypoint', 'end');
                        if (stSwitch) {
                            $("#treppe").show()
                            stSwitch = false;
                        }
                    }
                }, 100 * ind);
            })(i);
        }
        // Startpunkt zeigen:
        console.log(gridElems[st][startY][startX]);
        console.log()
        if (st !== startSt) {
            if (secondTime) {
                if (barriereFrei === false) {
                    startX = endStX + 1;
                    startY = endStY;
                } else {
                    startX = liftX;
                    startY = liftY;
                }
                gridElems[st][startY][startX].classList.add('waypoint', 'start');
            } else {
                if (!barriereFrei) {
                    gridElems[startSt][startY][startX].classList.add('waypoint', 'start')
                } else {
                    gridElems[st][startY][startX].classList.add('waypoint', 'start')
                }
            }
        } else {
            gridElems[startSt][startY][startX].classList.add('waypoint', 'start')
        }
    }
}




