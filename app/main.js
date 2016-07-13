'use strict';
define(["jquery", "paper", "app/graph", "app/PositionSeries", "app/BaseChart"],
    function($, paper, Graph, PositionSeries, BaseChart) {

        /*var canvas = document.getElementById('canvas');

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        paper.install(window);
        paper.setup(canvas);*/
       
        var testData = [{
        time: 3.43573,
        pressure: 0,
        angle: 0,
        penDown: true,
        speed: 0,
        position: {
            x: 635,
            y: 779.5
        }
    }, {
        time: 3.4621,
        pressure: 0.694499,
        angle: 0.394383,
        penDown: true,
        speed: 958.418,
        position: {
            x: 612,
            y: 776.5
        }
    }, {
        time: 3.46552,
        pressure: 0.714583,
        angle: 0.393666,
        penDown: true,
        speed: 498.768,
        position: {
            x: 609,
            y: 776
        }
    }];

        let distanceGraph = new Graph(450, 200, 10, 1000, "red", "stroke_graphs", "distance");
        let strokeGraph = new Graph(450, 200, 10, 15, "blue", "stroke_graphs", "stroke count");

        let xGraph = new Graph(450, 200, 2, 1000, "green", "stroke_graphs", "x position");
        let yGraph = new Graph(450, 200, 2, 900, "orange", "stroke_graphs", "y position");

        let pressure = new Graph(450, 200, 2, 6, "orange", "stylus_graphs", "pressure");
        let stylusXGraph = new Graph(450, 200, 2, 1000, "green", "stylus_graphs", "x position");
        let stylusYGraph = new Graph(450, 200, 2, 1000, "orange", "stylus_graphs", "y position");
        let speedGraph = new Graph(450, 200, 15, 25, "orange", "stylus_graphs", "speed");
        var baseChart1 = new PositionSeries();
        

        var json = $.getJSON("app/sample_stylus_data.json", stylusDataLoaded);


        baseChart1.setWidth(1500).setHeight(200);
        
        // if user is running mozilla then use it's built-in WebSocket


        window.WebSocket = window.WebSocket || window.MozWebSocket;

        var connection = new WebSocket('ws://10.8.0.205:8080/', "desktop_client");



        connection.onopen = function() {
            console.log('connection opened');
            connection.send('desktop');
        };

        connection.onerror = function(error) {
            console.log('connection error', error);

            // an error occurred when sending/receiving data
        };

        connection.onmessage = function(message) {
            // try to decode json (I assume that each message from server is json)
            //try {
            var data = JSON.parse(message.data);
                                    console.log("data.type",data.type);

            if (data.type == "stroke_data") {
                graphStroke(data);
            }
            else if(data.type =="stylus_data"){
                graphStylus(data);
            }
        };

        function loadData(file){

        }

        function stylusDataLoaded(json){
            console.log("total datapoints",json.drawings.length);
        var data = json.drawings.map(function(d,rank){
            var position = [d.position];
            var stop = rank-1-200>0?rank-1-200:0;
            for(var i=rank-1;i>stop;i-=4){
                if(i>=0){
                    position.unshift(json.drawings[i].position);
                }
            }
            //console.log(position)
            return {time:{x:d.time,y:0},position:position};
            
        });
        console.log('data',data);
        baseChart1.addChild(data).generate();
        baseChart1.render();
        }

        function graphStylus(json){
            var data = json.drawings;
            var pressureData = data.map(function(d,rank){
                return {
                    x:d.time,
                    y:d.pressure
                };
            });
            var speedData = data.map(function(d,rank){
                return {
                    x:d.time,
                    y:d.speed
                };
            });
            pressure.setData([pressureData]);
            speedGraph.setData([speedData]);


        }

        function graphStroke(data) {

            var drawings = data.drawings;
            var strokes = drawings[0].strokes;

            var strokeData = strokes.map(function(stroke, rank) {

                return {
                    x: stroke.time,
                    y: rank
                };
            });

            var distanceData = strokes.map(function(stroke, rank) {
                return stroke.lengths.map(function(length, rank) {
                    return {
                        x: length.time,
                        y: length.length
                    };
                });
            });
            distanceData = [].concat.apply([], distanceData);

            var xPositionData = strokes.map(function(stroke, rank) {
                return stroke.segments.map(function(segment, rank) {

                    return {

                        x: segment.time,
                        y: segment.point.x,
                    };
                });
            });

            var yPositionData = strokes.map(function(stroke, rank) {
                return stroke.segments.map(function(segment, rank) {

                    return {
                        x: segment.time,
                        y: segment.point.y

                    };
                });
            });

            //console.log("strokeData", strokeData);
            //console.log("distanceData", distanceData);

            distanceGraph.setData([distanceData]);
            xGraph.setData(xPositionData);
            yGraph.setData(yPositionData);
            strokeGraph.setData([strokeData]);



            //lengthGraph.setData(lengthData);
            //var penState = json.penDown == true? 1:0;
            //deltaGraph.tick(penState,json.time);


            //} catch (e) {
            // console.log('This doesn\'t look like a valid JSON: ', message);
            //return;
            //}

            // handle incoming message
        }
    });