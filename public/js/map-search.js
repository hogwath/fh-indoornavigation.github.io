
//sucht den nähesten Punkt auf der X-Achse
function calculateDistance(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function nearest(startX, startY, kords) {
    let nearest;
    let minDistance = Infinity;

    // Iterieren durch alle Treppen im Gebäude
    for (const PointOfInterest of kords) {
        // Berechnen der Distanz zwischen dem Startpunkt und der aktuellen Treppe
        const distance = calculateDistance({ x: startX, y: startY }, { x: PointOfInterest.X, y: PointOfInterest.Y });

        // Wenn die Distanz kleiner ist als die bisher kleinste Distanz, aktualisiere die nächste Treppe und die kleinste Distanz
        if (distance < minDistance) {
            minDistance = distance;
            nearest = PointOfInterest;
        }
    }

    // Die nächste Treppe ist die Treppe mit der kleinsten Distanz
    return [nearest.Y, nearest.X];
}




// Die Stockwerke wurden bereits in der index.html eingebunden
var eg0Map = document.getElementById('eg0Map');
var og1Map = document.getElementById('og1Map');
var og2Map = document.getElementById('og2Map');

var mainMap = [eg0Map, og1Map, og2Map];

var graphEG = new Graph(grid0);
var rows0 = grid0.length;
var cols0 = grid0[0].length;

var graph1OG = new Graph(grid1);
var rows1 = grid1.length;
var cols1 = grid1[0].length;

var graph2OG = new Graph(grid2);
var rows2 = grid2.length;
var cols2 = grid2[0].length;

var graph = [graphEG, graph1OG, graph2OG];
var rows = [rows0, rows1, rows2];
var cols = [cols0, cols1, cols2];
var grid = [grid0, grid1, grid2];

/*
    Speichert die erstellten Elemente, es kann über die gefundenen Koordinaten
    auf sie zugegriffen werden. z. B.: gridElems[y][x].style.backgroundColor = 'red';
*/
var gridElems = [];

for (var g = 0; g < mainMap.length; g++) {
    gridElems[g] = [];
    initGrids(g);
    console.log(g);
}

function initGrids(g) {
    'use strict';

    // vorläufiger Container für die zu erstellenden HTML-Elemente
    var docFrag = document.createDocumentFragment();

    // Raster Elemente für begehbare Bereiche erzeugen
    for (var i = 0; i < rows[g]; i++) {
        var row = [];
        for (var j = 0; j < cols[g]; j++) {
            // ignoriere nicht begehbare Bereiche
            if (grid[g][i][j] === 0) continue;
            // Element erzeugen und Attribute setzen
            var elem = document.createElement('div');
            elem.className = 'grid-box';
            elem.style.left = 100/cols[g] * j + '%';
            elem.style.top = 100/rows[g] * i + '%';
            elem.title = i + ', ' + j;
            //
            docFrag.appendChild(elem);
            row[j] = elem;
        }
        // Elemente für späteren Zugriff speichern
        gridElems[g][i] = row;
    }
    console.log(docFrag);
    mainMap[g].appendChild(docFrag);
}


