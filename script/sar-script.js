window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
window.addEventListener("load", load);
function load()
{
    initBGMask();
    initCircle();
    initImage();
}
function initBGMask()
{
    var canvas = document.getElementById("canvas-mask");
    var width = parseInt(getComputedStyle(canvas).width);
    var height = parseInt(getComputedStyle(canvas).height);

    canvas.height = height;
    canvas.width = width;

    var colorList = [
        Color.fromString("#ff4747"),
        Color.fromString("#ffbc47"),
        Color.fromString("#fffd47"),
        Color.fromString("#47ff54"),
        Color.fromString("#47ffec"),
        Color.fromString("#477bff"),
        Color.fromString("#a647ff"),
        Color.fromString("#ff78d1"),
    ];
    var rectWrapHeight = 220;
    var lineCount = 5;
    var rectData = [
        {
            width: 500,
            height: 200,
            x: 100,
            pos: { x: 0, y: 0 }
        },
        {
            width: 600,
            height: 200,
            x: -100,
            pos: { x: 0, y: 0 }
        },
        {
            width: 600,
            height: 200,
            x: 150,
            pos: { x: 0, y: 0 }
        }
    ];
    var rectTransform = [
        {
            width: 500,
            height: 200,
            x: 100,
            pos: { x: 0, y: 0 }
        },
        {
            width: 600,
            height: 200,
            x: -100,
            pos: { x: 0, y: 0 }
        },
        {
            width: 600,
            height: 200,
            x: 150,
            pos: { x: 0, y: 0 }
        }
    ];
    var targetData = rectData;
    var lastData;
    var nextRect = [
        {
            width: 400,
            height: 200,
            x: -100,
            pos: { x: 0, y: 0 }
        },
        {
            width: 500,
            height: 200,
            x: 0,
            pos: { x: 0, y: 0 }
        },
        {
            width: 600,
            height: 200,
            x: 50,
            pos: { x: 0, y: 0 }
        }
    ];
    var zoomRect = [
        {
            width: width / 2,
            height: (height - rectWrapHeight) / 2,
            x: -100,
            pos: { x: width / 2, y: 0 }
        },
        {
            width: width / 2,
            height: rectWrapHeight,
            x: 0,
            pos: { x: width / 2, y: (height - rectWrapHeight) / 2 }
        },
        {
            width: width / 2,
            height: (height - rectWrapHeight) / 2,
            x: 50,
            pos: { x: width / 2, y: (height + rectWrapHeight) / 2 }
        }
    ];

    var colorIdx = 0;
    var color = colorList[colorIdx];
    var colorTransform = color.copy();
    var colorTarget = color.copy();
    /**
     * @type {CanvasRenderingContext2D}
     */
    var ctx = canvas.getContext("2d");
    initPos(rectData);
    initPos(nextRect);
    for (var i = 0; i < rectData.length; i++)
    {
        rectTransform[i] = Object.create(rectData[i]);
        rectTransform[i].pos = Object.create(rectData[i].pos);
    }

    /*setTimeout(() =>
    {
        maskZoomIn();
        setInterval(back, 1000);
        duration = 1000;
    }, 1000);*/

    window.requestAnimationFrame(update);
    var lastDelay = 0;
    var transformStartTime = 0;
    var time = 0;
    var duration = 1000;
    function update(delay)
    {
        window.requestAnimationFrame(update);
        time = delay;
        
        var dt = (delay - lastDelay) / 1000;
        lastDelay = delay;
        console.log(dt);
        var t = (time - transformStartTime) / duration;
        if (t > 1)
        {
            rectData = targetData;
            t = 1;
        }
        colorTransform.red = interpolate(color.red, colorTarget.red, t,0);
        colorTransform.green = interpolate(color.green, colorTarget.green, t,0);
        colorTransform.blue = interpolate(color.blue, colorTarget.blue, t, 0);
        ctx.fillStyle = colorTransform.toString();
        ctx.clearRect(0, 0, width, height);
        ctx.fillRect(0, 0, width, height);
        var w = width / (lineCount + 1);
        for (var i = 1; i <= lineCount; i++)
        {
            ctx.beginPath();
            var x = Math.floor(w * i)+0.5;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.lineWidth = 0.1;
            ctx.stroke();
        }
        for (var i = 0; i < rectTransform.length; i++)
        {
            rectTransform[i].pos.x = interpolate(rectData[i].pos.x, targetData[i].pos.x, t);
            rectTransform[i].pos.y = interpolate(rectData[i].pos.y, targetData[i].pos.y, t);
            rectTransform[i].width = interpolate(rectData[i].width, targetData[i].width, t);
            rectTransform[i].height = interpolate(rectData[i].height, targetData[i].height, t);

            ctx.clearRect(rectTransform[i].pos.x, rectTransform[i].pos.y, rectTransform[i].width, rectTransform[i].height);
        }
    }
    function transformTo(nextRect)
    {
        lastData = rectData;
        rectData = rectTransform;
        targetData = nextRect;
        transformStartTime = time;
    }
    function colorNext()
    {
        colorIdx++;
        color = colorTransform;
        colorTransform = color.copy();
        colorTarget = colorList[colorIdx];
    }
    function colorBack()
    {
        colorIdx--;
        color = colorTransform;
        colorTransform = color.copy();
        colorTarget = colorList[colorIdx];
    }
    function next()
    {
        transformTo(randomNext());
    }
    function back()
    {
        transformTo(lastData);
    }

    function maskZoomIn()
    {
        transformTo(zoomRect);
        /*lastData = rectData;
        rectData = rectTransform;
        targetData = zoomRect;
        transformStartTime = time;*/
    }
    function randomNext()
    {
        for (var i = 0; i < nextRect.length; i++)
        {
            nextRect[i].width = 300 * Math.random() + 400;
            nextRect[i].x = 300 * (Math.random() - 0.5) * 2;
        }
        initPos(nextRect);
        return nextRect;
    }
    function initPos(rectData)
    {
        var totalHeight = 0;
        for (var i = 0; i < rectData.length; i++)
        {
            rectData[i].pos.y = totalHeight;
            totalHeight += rectWrapHeight;
        }
        for (var i = 0; i < rectData.length; i++)
        {
            (function (rect)
            {
                var x = width / 2;
                x += rect.x;
                x -= rect.width / 2;
                var y = (height - totalHeight) / 2 + rect.pos.y;
                y += (rectWrapHeight - rect.height) / 2;
                rect.pos = { x: x, y: y };
            })(rectData[i]);
        }
    }
    function interpolate(from, to, t, iterate)
    {
        if (iterate === undefined)
            iterate = 2;
        return timingFunc(t,iterate) * (to - from) + from;
    }
    function timingFunc(t, iterate)
    {
        if (iterate === undefined)
            iterate = 2;
        if (iterate === 0)
            return t;
        return (-Math.cos(Math.PI * timingFunc(t, iterate - 1)) + 1) / 2;
    }
    window.maskNext = next;
    window.maskBack = back;
    window.maskZoomIn = maskZoomIn;
    window.colorNext = colorNext;
    window.colorBack = colorBack;
}
function initCircle()
{
    var element = document.getElementById("circle");
    var width = window.innerWidth;
    var height = window.innerHeight;
    var k = 0.1;
    var scaled = false;
    window.addEventListener("mousemove", function (e)
    {
        if (scaled)
            return;    
        var x = e.clientX;
        var y = e.clientY;
        var offsetX = x - width / 2;
        var offsetY = y - height / 2;
        offsetX *= k;
        offsetY *= k;
        element.style.left = offsetX + "px";
        element.style.top = offsetY + "px";
    });
    function zoomIn()
    {
        scaled = true;
        element.style.left = 0;
        element.style.top = 0;
        element.style.width = element.style.height = Math.sqrt(width * width + height * height) + "px";
        //setTimeout(zoomOut, 1000);
    }
    function zoomOut()
    {
        scaled = false;
        element.style.left = 0;
        element.style.top = 0;
        element.style.width = element.style.height = "500px";
    }
    //setTimeout(zoomIn, 1000);
    window.circleZoomIn = zoomIn;
    window.circleZoomOut = zoomOut;
}
function initImage()
{
    var imgs = document.querySelectorAll(".bg-img");
    var idx = 0;
    function imageNext()
    {
        $(".bg-img").removeClass("display");
        $(".bg-img").addClass("hide");
        idx++;
        $(imgs[idx]).removeClass("hide");
        $(imgs[idx]).addClass("display");
    }
    function imageBack()
    {
        $(".bg-img").removeClass("display");
        $(".bg-img").addClass("hide");
        idx--;
        $(imgs[idx]).removeClass("hide");
        $(imgs[idx]).addClass("display");
    }
    function imageZoomIn()
    {
        
    }
    function imageZoomOut()
    {
        
    }
    window.imageNext = imageNext;
    window.imageBack = imageBack;
    window.imageZoomIn = imageZoomIn;
    window.imageZoomOut = imageZoomOut;
}
function initColor()
{
    
}
function Color(r, g, b, a) {
    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);
    if (isNaN(r) || r >= 256)
        r = 255;
    else if (r < 0)
        r = 0;
    if (isNaN(g) || g >= 256)
        g = 255;
    else if (g < 0)
        g = 0;
    if (isNaN(b) || b >= 256)
        b = 255;
    else if (b < 0)
        b = 0;
    if (isNaN(a) || a > 1.0)
        a = 1.0;
    else if (a < 0)
        a = 0;
    this.red = r;
    this.green = g;
    this.blue = b;
    this.alpha = a;
}
Color.version = 2.0;
Color.random = function () {
    return new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255, 1.0);
}
Color.fromString = function (str) {
    str = str.replace(new RegExp(/\s/g), "");

    var reg = new RegExp("#[0-9a-fA-F]{6}");
    if (reg.test(str)) {
        str = str.replace("#", "");
        var strR = str.charAt(0) + str.charAt(1);
        var strG = str.charAt(2) + str.charAt(3);
        var strB = str.charAt(4) + str.charAt(5);
        var r = parseInt(strR, 16);
        var g = parseInt(strG, 16);
        var b = parseInt(strB, 16);
        return new Color(r, g, b, 1.0);
    }
    reg = new RegExp("rgb\\(([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1})\\)");
    if (reg.test(str)) {
        var colorArray = str.replace("rgb(", "").replace(")", "").split(",");
        var r = parseInt(colorArray[0]);
        var g = parseInt(colorArray[1]);
        var b = parseInt(colorArray[2]);
        var a = 1.00;
        return new Color(r, g, b, a);
    }
    reg = new RegExp("rgba\\(([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1})\\)");
    if (reg.test(str)) {
        var colorArray = str.replace("rgba(", "").replace(")", "").split(",");
        var r = parseInt(colorArray[0]);
        var g = parseInt(colorArray[1]);
        var b = parseInt(colorArray[2]);
        var a = parseFloat(colorArray[3]);
        return new Color(r, g, b, a);
    }
    switch (str) {
        case "transparent":
            return new Color(255, 255, 255, 0);
        case "aliceblue":
            return new Color(240, 248, 255, 1.0);
        case "antiquewhite":
            return new Color(250, 235, 215, 1.0);
        case "aqua":
            return new Color(0, 255, 255, 1.0);
        case "aquamarine":
            return new Color(127, 255, 212, 1.0);
        case "azure":
            return new Color(240, 255, 255, 1.0);
        case "beige":
            return new Color(245, 245, 220, 1.0);
        case "bisque":
            return new Color(255, 228, 196, 1.0);
        case "black":
            return new Color(0, 0, 0, 1.0);
        case "blanchedalmond":
            return new Color(255, 235, 205, 1.0);
        case "blue":
            return new Color(0, 0, 255, 1.0);
        case "blueviolet":
            return new Color(138, 43, 226, 1.0);
        case "brown":
            return new Color(165, 42, 42, 1.0);
        case "burlywood":
            return new Color(222, 184, 135, 1.0);
        case "cadetblue":
            return new Color(95, 158, 160, 1.0);
        case "chartreuse":
            return new Color(127, 255, 0, 1.0);
        case "chocolate":
            return new Color(210, 105, 30, 1.0);
        case "coral":
            return new Color(255, 127, 80, 1.0);
        case "cornflowerblue":
            return new Color(100, 149, 237, 1.0);
        case "cornsilk":
            return new Color(255, 248, 220, 1.0);
        case "crimson":
            return new Color(220, 20, 60, 1.0);
        case "cyan":
            return new Color(0, 255, 255, 1.0);
        case "darkblue":
            return new Color(0, 0, 139, 1.0);
        case "darkcyan":
            return new Color(0, 139, 139, 1.0);
        case "darkgoldenrod":
            return new Color(184, 134, 11, 1.0);
        case "darkgray":
            return new Color(169, 169, 169, 1.0);
        case "darkgreen":
            return new Color(0, 100, 0, 1.0);
        case "darkgrey":
            return new Color(169, 169, 169, 1.0);
        case "darkkhaki":
            return new Color(189, 183, 107, 1.0);
        case "darkmagenta":
            return new Color(139, 0, 139, 1.0);
        case "darkolivegreen":
            return new Color(85, 107, 47, 1.0);
        case "darkorange":
            return new Color(255, 140, 0, 1.0);
        case "darkorchid":
            return new Color(153, 50, 204, 1.0);
        case "darkred":
            return new Color(139, 0, 0, 1.0);
        case "darksalmon":
            return new Color(233, 150, 122, 1.0);
        case "darkseagreen":
            return new Color(143, 188, 143, 1.0);
        case "darkslateblue":
            return new Color(72, 61, 139, 1.0);
        case "darkslategray":
            return new Color(47, 79, 79, 1.0);
        case "darkslategrey":
            return new Color(47, 79, 79, 1.0);
        case "darkturquoise":
            return new Color(0, 206, 209, 1.0);
        case "darkviolet":
            return new Color(148, 0, 211, 1.0);
        case "deeppink":
            return new Color(255, 20, 147, 1.0);
        case "deepskyblue":
            return new Color(0, 191, 255, 1.0);
        case "dimgray":
            return new Color(105, 105, 105, 1.0);
        case "dimgrey":
            return new Color(105, 105, 105, 1.0);
        case "dodgerblue":
            return new Color(30, 144, 255, 1.0);
        case "firebrick":
            return new Color(178, 34, 34, 1.0);
        case "floralwhite":
            return new Color(255, 250, 240, 1.0);
        case "forestgreen":
            return new Color(34, 139, 34, 1.0);
        case "fuchsia":
            return new Color(255, 0, 255, 1.0);
        case "gainsboro":
            return new Color(220, 220, 220, 1.0);
        case "ghostwhite":
            return new Color(248, 248, 255, 1.0);
        case "gold":
            return new Color(255, 215, 0, 1.0);
        case "goldenrod":
            return new Color(218, 165, 32, 1.0);
        case "gray":
            return new Color(128, 128, 128, 1.0);
        case "green":
            return new Color(0, 128, 0, 1.0);
        case "greenyellow":
            return new Color(173, 255, 47, 1.0);
        case "grey":
            return new Color(128, 128, 128, 1.0);
        case "honeydew":
            return new Color(240, 255, 240, 1.0);
        case "hotpink":
            return new Color(255, 105, 180, 1.0);
        case "indianred":
            return new Color(205, 92, 92, 1.0);
        case "indigo":
            return new Color(75, 0, 130, 1.0);
        case "ivory":
            return new Color(255, 255, 240, 1.0);
        case "khaki":
            return new Color(240, 230, 140, 1.0);
        case "lavender":
            return new Color(230, 230, 250, 1.0);
        case "lavenderblush":
            return new Color(255, 240, 245, 1.0);
        case "lawngreen":
            return new Color(124, 252, 0, 1.0);
        case "lemonchiffon":
            return new Color(255, 250, 205, 1.0);
        case "lightblue":
            return new Color(173, 216, 230, 1.0);
        case "lightcoral":
            return new Color(240, 128, 128, 1.0);
        case "lightcyan":
            return new Color(224, 255, 255, 1.0);
        case "lightgoldenrodyellow":
            return new Color(250, 250, 210, 1.0);
        case "lightgray":
            return new Color(211, 211, 211, 1.0);
        case "lightgreen":
            return new Color(144, 238, 144, 1.0);
        case "lightgrey":
            return new Color(211, 211, 211, 1.0);
        case "lightpink":
            return new Color(255, 182, 193, 1.0);
        case "lightsalmon":
            return new Color(255, 160, 122, 1.0);
        case "lightseagreen":
            return new Color(32, 178, 170, 1.0);
        case "lightskyblue":
            return new Color(135, 206, 250, 1.0);
        case "lightslategray":
            return new Color(119, 136, 153, 1.0);
        case "lightslategrey":
            return new Color(119, 136, 153, 1.0);
        case "lightsteelblue":
            return new Color(176, 196, 222, 1.0);
        case "lightyellow":
            return new Color(255, 255, 224, 1.0);
        case "lime":
            return new Color(0, 255, 0, 1.0);
        case "limegreen":
            return new Color(50, 205, 50, 1.0);
        case "linen":
            return new Color(250, 240, 230, 1.0);
        case "magenta":
            return new Color(255, 0, 255, 1.0);
        case "maroon":
            return new Color(128, 0, 0, 1.0);
        case "mediumaquamarine":
            return new Color(102, 205, 170, 1.0);
        case "mediumblue":
            return new Color(0, 0, 205, 1.0);
        case "mediumorchid":
            return new Color(186, 85, 211, 1.0);
        case "mediumpurple":
            return new Color(147, 112, 219, 1.0);
        case "mediumseagreen":
            return new Color(60, 179, 113, 1.0);
        case "mediumslateblue":
            return new Color(123, 104, 238, 1.0);
        case "mediumspringgreen":
            return new Color(0, 250, 154, 1.0);
        case "mediumturquoise":
            return new Color(72, 209, 204, 1.0);
        case "mediumvioletred":
            return new Color(199, 21, 133, 1.0);
        case "midnightblue":
            return new Color(25, 25, 112, 1.0);
        case "mintcream":
            return new Color(245, 255, 250, 1.0);
        case "mistyrose":
            return new Color(255, 228, 225, 1.0);
        case "moccasin":
            return new Color(255, 228, 181, 1.0);
        case "navajowhite":
            return new Color(255, 222, 173, 1.0);
        case "navy":
            return new Color(0, 0, 128, 1.0);
        case "oldlace":
            return new Color(253, 245, 230, 1.0);
        case "olive":
            return new Color(128, 128, 0, 1.0);
        case "olivedrab":
            return new Color(107, 142, 35, 1.0);
        case "orange":
            return new Color(255, 165, 0, 1.0);
        case "orangered":
            return new Color(255, 69, 0, 1.0);
        case "orchid":
            return new Color(218, 112, 214, 1.0);
        case "palegoldenrod":
            return new Color(238, 232, 170, 1.0);
        case "palegreen":
            return new Color(152, 251, 152, 1.0);
        case "paleturquoise":
            return new Color(175, 238, 238, 1.0);
        case "palevioletred":
            return new Color(219, 112, 147, 1.0);
        case "papayawhip":
            return new Color(255, 239, 213, 1.0);
        case "peachpuff":
            return new Color(255, 218, 185, 1.0);
        case "peru":
            return new Color(205, 133, 63, 1.0);
        case "pink":
            return new Color(255, 192, 203, 1.0);
        case "plum":
            return new Color(221, 160, 221, 1.0);
        case "powderblue":
            return new Color(176, 224, 230, 1.0);
        case "purple":
            return new Color(128, 0, 128, 1.0);
        case "red":
            return new Color(255, 0, 0, 1.0);
        case "rosybrown":
            return new Color(188, 143, 143, 1.0);
        case "royalblue":
            return new Color(65, 105, 225, 1.0);
        case "saddlebrown":
            return new Color(139, 69, 19, 1.0);
        case "salmon":
            return new Color(250, 128, 114, 1.0);
        case "sandybrown":
            return new Color(244, 164, 96, 1.0);
        case "seagreen":
            return new Color(46, 139, 87, 1.0);
        case "seashell":
            return new Color(255, 245, 238, 1.0);
        case "sienna":
            return new Color(160, 82, 45, 1.0);
        case "silver":
            return new Color(192, 192, 192, 1.0);
        case "skyblue":
            return new Color(135, 206, 235, 1.0);
        case "slateblue":
            return new Color(106, 90, 205, 1.0);
        case "slategray":
            return new Color(112, 128, 144, 1.0);
        case "slategrey":
            return new Color(112, 128, 144, 1.0);
        case "snow":
            return new Color(255, 250, 250, 1.0);
        case "springgreen":
            return new Color(0, 255, 127, 1.0);
        case "steelblue":
            return new Color(70, 130, 180, 1.0);
        case "tan":
            return new Color(210, 180, 140, 1.0);
        case "teal":
            return new Color(0, 128, 128, 1.0);
        case "thistle":
            return new Color(216, 191, 216, 1.0);
        case "tomato":
            return new Color(255, 99, 71, 1.0);
        case "turquoise":
            return new Color(64, 224, 208, 1.0);
        case "violet":
            return new Color(238, 130, 238, 1.0);
        case "wheat":
            return new Color(245, 222, 179, 1.0);
        case "white":
            return new Color(255, 255, 255, 1.0);
        case "whitesmoke":
            return new Color(245, 245, 245, 1.0);
        case "yellow":
            return new Color(255, 255, 0, 1.0);
        case "yellowgreen":
            return new Color(154, 205, 50, 1.0);
        default:
            return new Color(0, 0, 0, 1.0);
    }
}
Color.prototype.copy = function () {
    return new Color(this.red, this.green, this.blue, this.alpha);
}
Color.prototype.toString = function () {
    this.red = this.red > 255 ? 255 : this.red;
    this.green = this.green > 255 ? 255 : this.green;
    this.blue = this.blue > 255 ? 255 : this.blue;
    this.alpha = this.realphad > 1.0 ? 1.0 : this.alpha;

    this.red = this.red < 0 ? 0 : this.red;
    this.green = this.green < 0 ? 0 : this.green;
    this.blue = this.blue < 0 ? 0 : this.blue;
    this.alpha = this.alpha < 0.0 ? 0.0 : this.alpha;
    return "rgba(" + parseInt(this.red).toString() + "," + parseInt(this.green).toString() + "," + parseInt(this.blue).toString() + "," + this.alpha.toString() + ")";
}
Color.prototype.equal = function (color) {
    if (!color instanceof Color)
        return false;
    if (color.red == this.red && color.green == this.green && color.blue == this.blue && color.alpha == this.alpha)
        return true;
    return false;
}

window.zoomIn = function ()
{
    circleZoomIn();
    maskZoomIn();
}
window.zoomOut = function ()
{
    circleZoomOut();
    maskBack();
}
window.moveRight = function ()
{
    maskNext();
    imageNext();
    colorNext();
}
window.moveLeft = function ()
{
    maskNext();
    imageBack();
    colorBack();
}