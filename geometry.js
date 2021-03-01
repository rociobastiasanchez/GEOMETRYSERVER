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
    "dojo/domReady!"
],
 function(
     Map, Graphic, Extent, SpatialReference, Color, GraphicsLayer, Draw, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, GeometryService, BufferParameters, parser, on, dom
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
        toolbar.activate(Draw.LINE);
        toolbar.on("draw-complete", addToMap);
    };

    function addToMap (params){
        Mapa.graphics.clear();
        var simbolo = new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID,
        new Color("blue"), 2);
        var misgraficos = new Graphic(params.geometry,simbolo);
        Mapa.graphics.add(misgraficos);
    


        var servergeometria = new GeometryService ("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
        var bufferparametros = new BufferParameters();
        bufferparametros.unit = GeometryService.UNIT_KILOMETER;
        bufferparametros.distance = [10];
        bufferparametros.outSpatialReference = Mapa.spatialReference;
        bufferparametros.geometries = [params.geometry];
        servergeometria.buffer(bufferparametros, showBuffer);
        console.log(bufferparametros)

       
    };
    
    function showBuffer(parametros){
        console.log(parametros)
        var simbolobuffer = new SimpleFillSymbol(
         SimpleFillSymbol.STYLE_SOLID,
         new SimpleLineSymbol(
         SimpleLineSymbol.STYLE_SOLID,
         new Color(["green"]), 2
        ),
         new Color(["green"])
      );
      var areas = new Graphic(parametros.geometry[1], simbolobuffer);
      Mapa.graphics.add(areas);

    };




})
