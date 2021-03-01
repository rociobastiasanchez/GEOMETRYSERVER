'use strict'

var Mapa;

require([
    "esri/map",
    "esri/graphic",
    "esri/geometry/Extent",
    "esri/SpatialReference",
    "esri/Color",
    "esri/layers/GraphicsLayer",
    "esri/toolbars/draw",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/tasks/GeometryService",
    "esri/tasks/BufferParameters",

    "dojo/parser", 
    "dojo/on",
    "dojo/dom",
    "dojo/_base/array",
    "dojo/domReady!"
],
 function(
     Map, Graphic, Extent, SpatialReference, Color, GraphicsLayer, Draw, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, GeometryService, BufferParameters, parser, on, dom, array,
 ){
    parser.parse();

    Mapa = new Map ("mimapa", {
        basemap: "topo",
        extent: new Extent(
            {
            xmax: 1670203.8382181716,
            xmin: -2703217.1721453103,
            ymax: 5960668.0927024055,
            ymin: 4003880.1686024144,
             spatialReference: {wkid: 102100},
            }
           )
    });

    Mapa.on('load', inciodibujo);

    function inciodibujo(){
        const toolbar = new Draw (Mapa);
        toolbar.activate(Draw.POLYLINE);
        toolbar.on("draw-complete", addToMap);
    };

    var geomService = new GeometryService ("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer")


    function addToMap(evetobj){
        console.log(evetobj)
        
        var geometria = evetobj.geometry;
        var symbol= new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color("red"), 1);

        var grafic = new Graphic (geometria, symbol)
        Mapa.graphics.add(grafic);

        var parametros= new BufferParameters();
        parametros.distances = [10];
        parametros.spatialReference = Mapa.spatialReference;
        parametros.unit = GeometryService.UNIT_KILOMETER;
        parametros.geometries = [geometria];

        geomService.buffer(parametros, showBuffer);

    }

    function showBuffer(buffergeometrias){
        console.log(buffergeometrias)
        var simbolobuffer = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol (
                SimpleLineSymbol.STYLE_SOLID,
                new Color ("red"),2),
                new Color ("white")
            )

        array.forEach(buffergeometrias, function(geomtry){
            var grafic2 = new Graphic (geomtry, simbolobuffer);
            Mapa.graphics.add(grafic2)
        })
        
    }
 })