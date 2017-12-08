window.addEventListener("load", load);
function load()
{
    var canvas = document.getElementById("canvas-mask");
    var width = parseInt(getComputedStyle(canvas).width);
    var height = parseInt(getComputedStyle(canvas).height);

    canvas.height = height;
    canvas.width = width;
    var rectData = [
        {
            height: 200,
            wrapHeight:220,
            width: 500,
            x: 100,
            pos: { x: 0, y: 0 }
        },
        {
            height: 200,
            wrapHeight: 220,
            width: 600,
            x: -100,
            pos: { x: 0, y: 0 }
        },
        {
            height: 200,
            wrapHeight: 220,
            width: 600,
            x: 150,
            pos: { x: 0, y: 0 }
        }
    ];
    var color = "rgba(255,238,119,1.0)";
    /**
     * @type {CanvasRenderingContext2D}
     */
    var ctx = canvas.getContext("2d");
    var totalHeight = 0;
    for (var i = 0; i < rectData.length; i++)
    {
        rectData[i].pos.y = totalHeight;
        totalHeight += rectData[i].wrapHeight;
    }
    for (var i = 0; i < rectData.length; i++)
    {
        (function (rect)
        {
            var x = width / 2;
            x += rect.x;
            x -= rect.width / 2;
            var y = (height - totalHeight) / 2 + rect.pos.y;
            y += (rect.wrapHeight - rect.height) / 2;
            rect.pos = { x: x, y: y };
        })(rectData[i]);
    }

    window.requestAnimationFrame(update);
    var lastDelay = 0;
    function update(delay)
    {
        dt = (delay - lastDelay) / 1000;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        for (var i = 0; i < rectData.length; i++)
        {
            ctx.clearRect(rectData[i].pos.x, rectData[i].pos.y, rectData[i].width, rectData[i].height);
        }
    }
}