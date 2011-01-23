function init() {
    var slider = document.querySelector('#size-range');
    var output = document.querySelector('#size');
    var code = document.querySelector('textarea');
    var canvas = document.querySelector('#logo');
	var colorPicker = document.querySelector("#color-picker");
	var colorCtx = colorPicker.getContext('2d');
    var ctx = canvas.getContext('2d');
    var MAX_SIZE = 512;
    var MIN_SIZE = 16;
    var size = MAX_SIZE;
    var originalPrimaryColor = primaryColor = 'hsl(13, 77%, 52%)'; // '#E44D26';
    var originalSecondaryColor = secondaryColor = 'hsl(18, 86%, 55%)'; //'#F16529';
    var colorsSwapped = false;
    var respondToMouseMove = true;
    var originalLightness = lightness = 52;
    var cachedX = cachedY = undefined;

	var realW   = parseInt(getComputedStyle(colorPicker, null).width, 10),
	    ratio   = colorPicker.width / realW;
	
	var colorCache = [];

	function fillColorPicker() {
		var width = colorPicker.width;
		var height = colorPicker.height;
		var x = 0;
		var y = 0;
		
		for (x = 0; x < width; x++){

		  colorCache[x] = [];

		  for (y = 0; y < height; y++){
		    color = 'hsl(' + x  + ', ' + (100 - y) + '%, ' + lightness + '%)';
		    colorCache[x][y] = color;
		    colorCtx.fillStyle = color;
		    colorCtx.fillRect(x,y,1,1);
		  }
		}
	}
    
    function doInputDetect(type) {
        var input = document.createElement('input');
        input.setAttribute('type', type);
        return input.type !== 'text';
    }
    
    // Hide output element content if "range" type not supported
    var isSlider = doInputDetect('range');
    output = (!isSlider) ? slider : output;
    
    function drawLogo(ctx, size) {
        ctx.clearRect(0, 0, MAX_SIZE, MAX_SIZE);
        
        var outputcode = 'var canvas = document.querySelector("canvas");\nvar ctx = canvas.getContext("2d");\n\n';
        // Calculate the offset as the size changes
        var offset = size * (((MAX_SIZE / size) - 1) / 2);
        // Calculate the path coordinates
        var bg_dark = [
            [size / 7.175, size / 1.111],
            [size / 16.663, 0],
            [size / 1.063, 0],
            [size / 1.162, size / 1.111],
            [size / 2, size / 1]
        ];
        var bg_light = [
            [size / 2, size / 1.083],
            [size / 1.263, size / 1.187],
            [size / 1.162, size / 13.588],
            [size / 2, size / 13.588]
        ];
        var fg_dark = [
            [size / 2, size / 2.455],
            [size / 2.825, size / 2.455],
            [size / 2.908, size / 3.397],
            [size / 2, size / 3.397],
            [size / 2, size / 5.435],
            [size / 4.48, size / 5.435],
            [size / 3.953, size / 1.931],
            [size / 2, size / 1.931],
            [size / 2, size / 1.441],
            [size / 2.655, size / 1.513],
            [size / 2.712, size / 1.745],
            [size / 3.877, size / 1.745],
            [size / 3.658, size / 1.34],
            [size / 2, size / 1.236]
        ];
        var fg_light =[
            [size / 2, size / 2.455],
            [size / 2, size / 1.931],
            [size / 1.573, size / 1.931],
            [size / 1.606, size / 1.513],
            [size / 2, size / 1.441],
            [size / 2, size / 1.236],
            [size / 1.374, size / 1.374],
            [size / 1.322, size / 2.455],
            [size / 2, size / 5.435],
            [size / 2, size / 3.397],
            [size / 1.305, size / 3.397],
            [size / 1.288, size / 5.435]
        ];
        
        // Draw the dark part of the background
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        outputcode += '//Draw the dark part of the background\nctx.fillStyle = "' + primaryColor + '";\nctx.beginPath();\n';
        for (var i = 0, coord; coord = bg_dark[i]; i++) {
            if (i === 0) {
                ctx.moveTo(coord[0] + offset, coord[1] + offset);
                outputcode += 'ctx.moveTo(' + Math.round(coord[0]) + ', ' + Math.round(coord[1]) + ');\n';
            } else {
                ctx.lineTo(coord[0] + offset, coord[1] + offset);
                outputcode += 'ctx.lineTo(' + Math.round(coord[0]) + ', ' + Math.round(coord[1]) + ');\n';
            }
        }
        ctx.closePath();
        ctx.fill();
        outputcode += 'ctx.closePath();\nctx.fill();\n\n';
        
        // Draw light part of the background
        ctx.fillStyle = secondaryColor;
        ctx.beginPath();
        outputcode += '//Draw the light part of the background\nctx.fillStyle = "' + secondaryColor + '";\nctx.beginPath();\n';
        for (var i = 0, coord; coord = bg_light[i]; i++) {
            if (i === 0) {
                ctx.moveTo(coord[0] + offset, coord[1] + offset);
                outputcode += 'ctx.moveTo(' + Math.round(coord[0]) + ', ' + Math.round(coord[1]) + ');\n';
            } else {
                ctx.lineTo(coord[0] + offset, coord[1] + offset);
                outputcode += 'ctx.lineTo(' + Math.round(coord[0]) + ', ' + Math.round(coord[1]) + ');\n';
            }
        }
        ctx.closePath();
        ctx.fill();
        outputcode += 'ctx.closePath();\nctx.fill();\n\n';

        // Draw dark part of the foreground
        ctx.fillStyle = '#EBEBEB';
        ctx.beginPath();
        outputcode += '//Draw the dark part of the foreground\nctx.fillStyle = "#EBEBEB";\nctx.beginPath();\n';
        for (var i = 0, coord; coord = fg_dark[i]; i++) {
            if (i === 0 || i === 8) {
                ctx.moveTo(coord[0] + offset, coord[1] + offset);
                outputcode += 'ctx.moveTo(' + Math.round(coord[0]) + ', ' + Math.round(coord[1]) + ');\n';
            } else {
                ctx.lineTo(coord[0] + offset, coord[1] + offset);
                outputcode += 'ctx.lineTo(' + Math.round(coord[0]) + ', ' + Math.round(coord[1]) + ');\n';
            }
        }
        ctx.closePath();
        ctx.fill();
        outputcode += 'ctx.closePath();\nctx.fill();\n\n';
        
        // Draw light part of the foreground
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        outputcode += '//Draw the light part of the foreground\nctx.fillStyle = "#FFFFFF";\nctx.beginPath();\n';
        for (var i = 0, coord; coord = fg_light[i]; i++) {
            if (i === 0 || i === 8) {
                ctx.moveTo(coord[0] + offset, coord[1] + offset);
                outputcode += 'ctx.moveTo(' + Math.round(coord[0]) + ', ' + Math.round(coord[1]) + ');\n';
            } else {
                ctx.lineTo(coord[0] + offset, coord[1] + offset);
                outputcode += 'ctx.lineTo(' + Math.round(coord[0]) + ', ' + Math.round(coord[1]) + ');\n';
            }
        }
        ctx.closePath();
        ctx.fill();
        outputcode += 'ctx.closePath();\nctx.fill();';
        
        code.value = outputcode;
    }
    
    function doDraw(ctx, size) {
        if (size <= MAX_SIZE && size >= MIN_SIZE) {
            drawLogo(ctx, size);
            output.textContent = size;
            slider.value = size;
            slider.setAttribute('aria-valuenow', size);
        }
    };
    
    function doScroll(event){
        var event = window.event || event;
        var delta = event.detail ? event.detail : event.wheelDelta / -120;
        delta = (delta > 0) ? 8 : -8;
        size -= delta;
        doDraw(ctx, size);
        event.preventDefault();
    }
     
    if (window.attachEvent) {
        canvas.attachEvent('mousewheel', doScroll)
    } else {
        canvas.addEventListener('DOMMouseScroll', doScroll, false);
        canvas.addEventListener('mousewheel', doScroll, false);
    }
     
    if (isSlider) {
        slider.onchange = function() {
	        size = slider.value;
            doDraw(ctx, slider.value);
        };
    } else {
        slider.onkeyup = function() {
	        size = slider.value;
            doDraw(ctx, slider.value);
        };
    }
    
    var isSelected = false;
    code.onclick = function() {
        code.focus();
        if (isSelected) {
            isSelected = false;
        } else {
            code.select();
            isSelected = true;
        }
    };
    
    // Export to PNG - so easy!
    canvas.onclick = function() {
       window.open(canvas.toDataURL(), 'HTML5 Logo');
    };

	function grabColor(e){
		if (e) {
			var x     = e.offsetX || e.layerX,
		      y     = e.offsetY || e.layerY,
		      realX = parseInt(x * ratio, 10) % 360,
		      realY = parseInt(y * ratio, 10) % 360;
			cachedX = realX;
			cachedY = realY;
		} else {
			// if user changes lighteness
			var realX = cachedX,
			    realY = cachedY;
		}

	  var c1 = colorCache[realX][realY] || originalPrimaryColor;
	  var c2 = colorCache[realX+6][realY-9] || originalSecondaryColor;
	
	  primaryColor = (colorsSwapped ? c1 : c2);
	  secondaryColor = (colorsSwapped ? c2 : c1);
	}

	function colorPickerMouseMove(e){
	  grabColor(e);
	  doDraw(ctx, size);
	}
	
	colorPicker.addEventListener('mousemove', colorPickerMouseMove, false);
	
	colorPicker.addEventListener('click', function() {
		if (respondToMouseMove) {
			respondToMouseMove = false;
			colorPicker.removeEventListener('mousemove', colorPickerMouseMove);
		} else {
			respondToMouseMove = true;
			colorPicker.addEventListener('mousemove', colorPickerMouseMove, false);
		}
	}, false);
	
	document.getElementById('swap').addEventListener('click', function() {
		colorsSwapped = !colorsSwapped;
		var temp = primaryColor;
		primaryColor = secondaryColor;
		secondaryColor = temp;
		doDraw(ctx, size);
	}, false);
	
	document.getElementById('revert').addEventListener('click', function() {
		primaryColor = originalPrimaryColor;
		secondaryColor = originalSecondaryColor;
		doDraw(ctx, size);
	}, false);
	
	document.getElementById('lightness-range').addEventListener('change', function(e) {
		lightness = e.target.value;
		fillColorPicker();
		document.getElementById('lightness').textContent = lightness;
		grabColor();
		doDraw(ctx, size);
	}, false);
    
	fillColorPicker();
    doDraw(ctx, size);
}

window.onload = init;