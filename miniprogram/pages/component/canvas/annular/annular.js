const screenWidth = 360; //屏幕宽度，自己获取
let pieInitData = { //环形饼图默认初始数据
  mW: 0.9 * screenWidth / 2,
  mH: 0.6 * screenWidth / 2,
  r: 0.15 * screenWidth,
  lineW: 0.07 * screenWidth,
  chink: 2 * Math.PI / 180,
  /* 环形间距 */
  outSpot: 0.067 * screenWidth, //伸出去点的长度
  outLine: 0.1 * screenWidth, //伸出去线的长度
  signR: 0.008 * screenWidth, //点半径
  fontSize: 0.03 * screenWidth, //字体大小
  textSpace: 0.025 * screenWidth, //文字上下与线的间距
  speed: 2 * Math.PI / 30,
  /* 速度 */
  moneyColorArr: ['#FF7573', '#7a95ff', '#0F8EE9']
};
Component({
  data: {
    canvasW: 0.9 * screenWidth,
    canvasH: 0.6 * screenWidth
  },
  pageLifetimes: {
    show: function() {
      let optionData = [{
          value: '6000-8000/月',
          ratio: 17
        },
        {
          value: '4500-6000/月',
          ratio: 34.8
        },
        {
          value: '3000-4500/月',
          ratio: 36.4
        }
      ]
      this.drawPie( optionData)
    },
  },
  methods: {
    // 环形饼图
    drawPie(data) {
      let ctx = wx.createCanvasContext('canvas',this);
      ctx.clearRect(0, 0, pieInitData.mW * 2, pieInitData.mH * 2);
      let oldOutY = 0;
      let oldDir = 'right';
      drawRing(); //绘制圆环
      function drawRing() {
        let all = 0;
        for (let i = 0; i < data.length; i++) {
          all += data[i].ratio
        }
        let angleList = transformAngle();
        let angleArr = [];
        let pieIndex = 0;
        let startAngle = 3 / 2 * Math.PI;
        loop(pieIndex)

        function loop(index) {
          let endAngle = startAngle + angleList[index].angle;
          ctx.beginPath();
          let proportion = 0;
          for (let j = 0; j < index; j++) {
            proportion += data[j].ratio;
          };
          let start = 3 / 2 * Math.PI + 2 * Math.PI * proportion / all;
          let end = start;
          pieAnimate(index, end, start);
          angleArr.push({
            startAngle: startAngle,
            angle: angleList[index].angle
          })
          startAngle = endAngle;
        }
        /**
         * index 第几个圆弧块
         * end 结束的角度
         * start 开始的角度
         */
        function pieAnimate(index, end, start) {
          console.log('=======组件pieAnimate======')
          setTimeout(() => {
            let endLimit = start + 2 * Math.PI * data[index].ratio / all - pieInitData.chink;
            if (end < endLimit) {
              end += pieInitData.speed;
              if (end > endLimit) {
                end = endLimit
              }
              pieAnimate(index, end, start);
            } else {
              if (pieIndex < data.length - 1) {
                pieIndex++;
                loop(pieIndex)
              } else {
                // 当最后一个圆弧
                angleArr.forEach(function (item, i) {
                  drawArcLine(item.startAngle, item.angle, i); //绘制点线
                });
              }
            }
          }, 10)
          ctx.setLineWidth(pieInitData.lineW);
          ctx.setStrokeStyle(pieInitData.moneyColorArr[pieIndex]);
          ctx.arc(pieInitData.mW, pieInitData.mH, pieInitData.r, start, end);
          ctx.stroke();
          ctx.draw(true);
        }
        // 转化弧度
        function transformAngle() {
          console.log('=======组件transformAngle======')
          let total = 0;
          data.forEach(function (item, i) {
            total += item.ratio;
          });
          data.forEach(function (item, i) {
            var angle = item.ratio / total * Math.PI * 2;
            item.angle = angle;
          });
          return data;
        };
        /**
         * startAngle 圆弧块开始的角度
         * angle 圆弧块扇形的角度
         */
        function drawArcLine(startAngle, angle, index) {
          /*计算点出去的坐标*/
          let edge = pieInitData.r + pieInitData.outSpot;
          let edgeX = Math.cos(startAngle + angle / 2) * edge;
          let edgeY = Math.sin(startAngle + angle / 2) * edge;
          let outX = pieInitData.mW + edgeX;
          let outY = pieInitData.mH + edgeY;
          /*计算线出去的坐标*/
          let edge1 = pieInitData.r + pieInitData.outLine;
          let edgeX1 = Math.cos(startAngle + angle / 2) * edge1;
          let edgeY1 = Math.sin(startAngle + angle / 2) * edge1;
          let outX1 = pieInitData.mW + edgeX1;
          let outY1 = pieInitData.mH + edgeY1;
          ctx.beginPath();
          let dir = 'right';
          if (outX1 > pieInitData.mW) {
            dir = 'right';
          } else {
            dir = 'left';
          }
          ctx.setStrokeStyle(pieInitData.moneyColorArr[index]);
          ctx.setLineWidth(1);
          ctx.setFontSize(pieInitData.fontSize);
          ctx.setTextBaseline('middle');
          if (Math.abs(outY - oldOutY) > 10 || dir != oldDir) {
            ctx.arc(outX - pieInitData.signR / 2, outY - pieInitData.signR / 2, pieInitData.signR, 0, 2 * Math.PI);
          }
          ctx.setFillStyle(pieInitData.moneyColorArr[index]);
          ctx.fill();
          ctx.moveTo(outX - pieInitData.signR / 2, outY - pieInitData.signR / 2);
          ctx.lineTo(outX1, outY1);
          /**
           * 优化，
           * 上下距离大于30时，上下显示
           * 上下距离大于10，小于30时，一行显示 3.9%  8000-1w/月 为一行
           * 否则不显示
           */
          if (Math.abs(outY - oldOutY) > 30 || dir != oldDir) {
            oldOutY = outY;
            oldDir = dir;
            if (dir == 'right') {
              /*右*/
              ctx.lineTo(pieInitData.mW * 2, outY1);
              ctx.stroke();
              ctx.setFillStyle('#4a4a4a');
              ctx.setTextAlign('left');
              const rightValueW = ctx.measureText(data[index].value).width;
              const rightRatioW = ctx.measureText(data[index].ratio + '%').width;
              ctx.fillText(data[index].value, pieInitData.mW * 2 - rightValueW, outY1 + pieInitData.textSpace);
              ctx.fillText(data[index].ratio + '%', pieInitData.mW * 2 - rightRatioW, outY1 - pieInitData.textSpace);
            } else {
              /*左*/
              ctx.lineTo(0, outY1);
              ctx.stroke();
              ctx.beginPath();
              ctx.setFillStyle('#4a4a4a');
              ctx.setTextAlign('right');
              const leftValueW = ctx.measureText(data[index].value).width;
              const leftRatioW = ctx.measureText(data[index].ratio + '%').width;
              ctx.fillText(data[index].value, 0 + leftValueW, outY1 + pieInitData.textSpace);
              ctx.fillText(data[index].ratio + '%', 0 + leftRatioW, outY1 - pieInitData.textSpace);
            }
          } else {
            if (Math.abs(outY - oldOutY) >= 10) {
              oldOutY = outY;
              oldDir = dir;
              if (dir == 'right') {
                /*右*/
                const lineOffsetR = ctx.measureText('1000%').width;
                ctx.lineTo(pieInitData.mW * 2 - lineOffsetR, outY1);
                ctx.stroke();
                ctx.setFillStyle('#4a4a4a');
                ctx.setTextAlign('left');
                const rightRatioW = ctx.measureText(data[index].ratio + '% ' + data[index].value + '1000%').width;
                ctx.fillText(data[index].ratio + '% ' + data[index].value, pieInitData.mW * 2 - rightRatioW, outY1 + pieInitData.textSpace);
              } else {
                /*左*/
                const lineOffsetL = ctx.measureText('1000%').width;
                ctx.lineTo(0 + lineOffsetL, outY1);
                ctx.stroke();
                ctx.beginPath();
                ctx.setFillStyle('#4a4a4a');
                ctx.setTextAlign('right');
                const leftRatioW = ctx.measureText(data[index].ratio + '% ' + data[index].value + '1000%').width;
                ctx.fillText(data[index].ratio + '% ' + data[index].value, 0 + leftRatioW, outY1 - pieInitData.textSpace);
              }
            }
          }
          ctx.draw(true);
        }
      }
    }
  }
})