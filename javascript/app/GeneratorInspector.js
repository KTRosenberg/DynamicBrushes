//ChartViewManager.js
'use strict';
define(["jquery", "app/id", "app/Emitter"],

	function($, ID, Emitter) {

		var GeneratorInspector = class extends Emitter {

			constructor(model, element) {
				super();
			}


			addDefaultValues(type,data){
				switch (type){
					
					case "alternate":
					data.values = [1,100];
					break;
					case "range":
					data.min = 1;
					data.max = 100;
					data.start = 1;
					data.stop = 100;
					break;
					case "random":
					data.min = 0;
					data.max = 100;
					break;
					case "sine":
					data.freq = 0.032;
					data.amp = 100;
					data.phase = -1.6;
					break;
					case "square":
					data.min = 0;
					data.max = 100;
					data.freq = 10;
					break;
					case "triangle":
					data.min = 0;
					data.max = 100;
					data.freq = 0.5;
					break;
					case "index":
					break;
					case "siblingcount":
					break;
					case "ease":
					data.a = 1.2;
					data.k = -0.3;
					data.b = 10;
					break;

				}
				return data;
			}



		};
		return GeneratorInspector;
	});