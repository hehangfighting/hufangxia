var canvas;
var seed;
var hold = 1;
function startRunLoveTree(e) {
  var offset = canvas.offset(), x, y;
  x = e.pageX - offset.left;
  y = e.pageY - offset.top;
  if (seed.hover(x, y)) {
      hold = 0;
      canvas.unbind("click");
      canvas.unbind("mousemove");
      canvas.removeClass('hand');
  }
}


$('#wrap').click(function(e) {
  var x = e.pageX;
  var y = e.pageY;
  var offset = $(e.target).offset();
  console.info(offset);
  console.info(e.pageX);
  console.info(e.pageY);
/*
            554
init.js:24 286
init.js:23 694
init.js:24 393
*/
  if((x > 554 && y > 286) && (x < 694 && y < 393)) {
    console.info('running..');
    $('#wrap').css({'background': ''});
    $('.game-desc').fadeOut();
    $('#canvas').animate({'opacity': 1}, function() {
      startRunLoveTree();
    });
  }
});

(function(){
    canvas = $('#canvas');

    if (!canvas[0].getContext) {
        $("#error").show();
        return false;        }

    var width = canvas.width();
    var height = canvas.height();
    canvas.attr("width", width);
    canvas.attr("height", height);
    var opts = {
        seed: {
            x: width / 2 - 20,
            color: "rgb(190, 26, 37)",
            scale: 2
        },
        branch: [
            [535, 680, 570, 250, 500, 200, 30, 100, [
                [540, 500, 455, 417, 340, 400, 13, 100, [
                    [450, 435, 434, 430, 394, 395, 2, 40]
                ]],
                [550, 445, 600, 356, 680, 345, 12, 100, [
                    [578, 400, 648, 409, 661, 426, 3, 80]
                ]],
                [539, 281, 537, 248, 534, 217, 3, 40],
                [546, 397, 413, 247, 328, 244, 9, 80, [
                    [427, 286, 383, 253, 371, 205, 2, 40],
                    [498, 345, 435, 315, 395, 330, 4, 60]
                ]],
                [546, 357, 608, 252, 678, 221, 6, 100, [
                    [590, 293, 646, 277, 648, 271, 2, 80]
                ]]
            ]]
        ],
        bloom: {
            num: 700,
            width: 1080,
            height: 650,
        },
        footer: {
            width: 1200,
            height: 5,
            speed: 10,
        }
    }

    var tree = new Tree(canvas[0], width, height, opts);
    seed = tree.seed;
    var foot = tree.footer;


    canvas.click(function(e) {
      console.info('clicked');
      startRunLoveTree(e, seed);
      /**
      var offset = canvas.offset(), x, y;
      x = e.pageX - offset.left;
      y = e.pageY - offset.top;
      if (seed.hover(x, y)) {
          hold = 0;
          canvas.unbind("click");
          canvas.unbind("mousemove");
          canvas.removeClass('hand');
      }
      **/
    }).mousemove(function(e){
        var offset = canvas.offset(), x, y;
        x = e.pageX - offset.left;
        y = e.pageY - offset.top;
        canvas.toggleClass('hand', seed.hover(x, y));
    });

    var seedAnimate = eval(Jscex.compile("async", function () {
        seed.draw();
        while (hold) {
            $await(Jscex.Async.sleep(10));
        }
        while (seed.canScale()) {
            seed.scale(0.95);
            $await(Jscex.Async.sleep(10));
        }
        while (seed.canMove()) {
            seed.move(0, 2);
            foot.draw();
            $await(Jscex.Async.sleep(10));
        }
    }));

    var growAnimate = eval(Jscex.compile("async", function () {
        do {
          tree.grow();
            $await(Jscex.Async.sleep(10));
        } while (tree.canGrow());
    }));

    var flowAnimate = eval(Jscex.compile("async", function () {
        do {
          tree.flower(2);
            $await(Jscex.Async.sleep(10));
        } while (tree.canFlower());
    }));

    var moveAnimate = eval(Jscex.compile("async", function () {
        tree.snapshot("p1", 240, 0, 610, 680);
        while (tree.move("p1", 500, 0)) {
            foot.draw();
            $await(Jscex.Async.sleep(10));
        }
        foot.draw();
        tree.snapshot("p2", 500, 0, 610, 680);

        // 会有闪烁不得意这样做, (＞﹏＜)
        canvas.parent().css("background", "url(" + tree.toDataURL('image/png') + ")");
        canvas.css("background", "#ffe");
        $await(Jscex.Async.sleep(300));
        canvas.css("background", "none");
    }));

    var jumpAnimate = eval(Jscex.compile("async", function () {
        var ctx = tree.ctx;
        while (true) {
            tree.ctx.clearRect(0, 0, width, height);
            tree.jump();
            foot.draw();
            $await(Jscex.Async.sleep(25));
        }
    }));

    var textAnimate = eval(Jscex.compile("async", function () {
    var together = new Date();
    together.setFullYear(2009,10,23 );      //时间年月日
    together.setHours(16);            //小时
    together.setMinutes(53);          //分钟
    together.setSeconds(0);         //秒前一位
    together.setMilliseconds(2);        //秒第二位

    $("#code").show().typewriter();
        $("#clock-box").fadeIn(500);
        while (true) {
            timeElapse(together);
            $await(Jscex.Async.sleep(1000));
        }
    }));

    var runAsync = eval(Jscex.compile("async", function () {
        $await(seedAnimate());
        $await(growAnimate());
        $await(flowAnimate());
        $await(moveAnimate());

        textAnimate().start();

        $await(jumpAnimate());
    }));

    runAsync().start();
})();
