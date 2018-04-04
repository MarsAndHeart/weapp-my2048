const app = getApp()

const defaultList = [
  { id: 0, row: 0, column: 0, num: 0 },
  { id: 1, row: 0, column: 1, num: 0 },
  { id: 2, row: 0, column: 2, num: 0 },
  { id: 3, row: 0, column: 3, num: 0 },

  { id: 4, row: 1, column: 0, num: 0 },
  { id: 5, row: 1, column: 1, num: 0 },
  { id: 6, row: 1, column: 2, num: 0 },
  { id: 7, row: 1, column: 3, num: 0 },

  { id: 8, row: 2, column: 0, num: 0 },
  { id: 9, row: 2, column: 1, num: 0 },
  { id: 10, row: 2, column: 2, num: 0 },
  { id: 11, row: 2, column: 3, num: 0 },

  { id: 12, row: 3, column: 0, num: 0 },
  { id: 13, row: 3, column: 1, num: 0 },
  { id: 14, row: 3, column: 2, num: 0 },
  { id: 15, row: 3, column: 3, num: 0 },
];

const numbers = [
  2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192
]

Page({

  data: {
    msg: 'this is my page',
    title: 'this is a title',
    record: 0,
    score: 0,
    list: defaultList,
    startPoint: { x: 0, y: 0 },
    gameOver: false,
  },

  //初始化
  onLoad: function () {
    this.resetList();
    this.createCard();
    this.createCard();
  },

  //重置数组
  resetList: function () {
    this.setData({
      list: defaultList
    })
  },

  //随机选择一个空的格子，创建一个2或者4
  createCard: function () {
    const list = [...this.data.list];

    let emptyCells = [];
    for (let i = 0; i < 16; i++) {
      if (list[i].num === 0) {
        emptyCells.push(i)
      }
    }

    const len = emptyCells.length;
    if (len === 0) {
      this.gameOver();
      return
    }

    const targetIndex = Math.floor(Math.random() * len);

    const targetNum = Math.random() * 3 < 2 ? 2 : 4;

    list[emptyCells[targetIndex]].num = targetNum;

    this.setData({
      list: list
    })
  },

  //记录触控开始坐标
  touchStart: function (e) {

    const touchPoints = e.changedTouches
    if (touchPoints.lenth > 1) {
      return
    }

    const startPoint = touchPoints[0]

    this.setData({
      startPoint: startPoint
    })

  },

  //获取触控结束坐标，判断方向
  touchEnd: function (e) {

    const touchPoints = e.changedTouches
    if (touchPoints.lenth > 1) {
      return
    }

    const startPoint = this.data.startPoint
    const endPoint = touchPoints[0]

    if (this.judgeMoved(startPoint, endPoint)) {

      const direction = this.judgeDirection(startPoint, endPoint);
      this.moveAndCombine(direction);
      this.createCard();

    }

  },

  //判断是否移动
  judgeMoved: function (start = { pageX: 0, pageY: 0 }, end = { pageX: 0, pageY: 0 }) {
    const bool = Boolean(start.pageX !== end.pageX || start.pageY !== end.pageY)
    return bool
  },

  //判断移动方向
  judgeDirection: function (start = { pageX: 0, pageY: 0 }, end = { pageX: 0, pageY: 0 }) {

    const moveX = end.pageX - start.pageX;
    const moveY = end.pageY - start.pageY;

    if (Math.abs(moveX) > Math.abs(moveY) && moveX < 0) {
      return 'left'
    } else if (Math.abs(moveX) > Math.abs(moveY) && moveX > 0) {
      return 'right'
    } else if (Math.abs(moveX) < Math.abs(moveY) && moveY < 0) {
      return 'up'
    } else if (Math.abs(moveX) < Math.abs(moveY) && moveY > 0) {
      return 'down'
    }

    return ''

  },

  //移动并合并格子
  moveAndCombine: function (direction = '') {
    console.log(direction)

    this.moveCells(direction);
    this.combineCells(direction);
    this.moveCells(direction);

  },

  //移动格子
  moveCells: function (direction = '') {
    const oldList = this.data.list.map(ele => ({
      ...ele
    }));
    let newList = oldList;
    switch (direction) {
      case 'left': {

        for (let r = 0; r <= 3; r++) {
          let currentRow = newList.filter(ele => ele.row === r);

          let c = 0;
          for (; c <= 3;) {
            if (c === 0) {
              c++;
              continue;
            }

            let currentCell = currentRow.find(ele => ele.column === c);

            if (currentCell.num !== 0) {
              let lastCell = currentRow.find(ele => ele.column === c - 1);
              if (lastCell.num === 0) {
                lastCell.num = currentCell.num;
                currentCell.num = 0;
                c--;
                continue;
              }
            }

            c++;
          }
        }

        break;
      }
      case 'right': {

        for (let r = 0; r <= 3; r++) {
          let currentRow = newList.filter(ele => ele.row === r);

          let c = 3;
          for (; c >= 0;) {
            if (c === 3) {
              c--;
              continue;
            }

            let currentCell = currentRow.find(ele => ele.column === c);

            if (currentCell.num !== 0) {
              let lastCell = currentRow.find(ele => ele.column === c + 1);
              if (lastCell.num === 0) {
                lastCell.num = currentCell.num;
                currentCell.num = 0;
                c++;
                continue;
              }
            }

            c--;
          }
        }

        break;
      }
      case 'up': {

        for (let c = 0; c <= 3; c++) {
          let currentColumn = newList.filter(ele => ele.column === c);

          let r = 0;
          for (; r <= 3;) {
            if (r === 0) {
              r++;
              continue;
            }

            let currentCell = currentColumn.find(ele => ele.row === r);

            if (currentCell.num !== 0) {
              let lastCell = currentColumn.find(ele => ele.row === r - 1);
              if (lastCell.num === 0) {
                lastCell.num = currentCell.num;
                currentCell.num = 0;
                r--;
                continue;
              }
            }

            r++;
          }
        }

        break;
      }
      case 'down': {

        for (let c = 0; c <= 3; c++) {
          let currentColumn = newList.filter(ele => ele.column === c);

          let r = 3;
          for (; r >= 0;) {
            if (r === 3) {
              r--;
              continue;
            }

            let currentCell = currentColumn.find(ele => ele.row === r);

            if (currentCell.num !== 0) {
              let lastCell = currentColumn.find(ele => ele.row === r + 1);
              if (lastCell.num === 0) {
                lastCell.num = currentCell.num;
                currentCell.num = 0;
                r++;
                continue;
              }
            }

            r--;
          }
        }

        break;
      }
      default: {
        break;
      }
    }

    this.setData({
      list: newList
    })
  },

  //计算并合并格子
  combineCells: function (direction = '') {
    const oldList = this.data.list.map(ele => ({
      ...ele
    }));
    let newList = oldList;
    switch (direction) {
      case 'left': {

        for (let r = 0; r <= 3; r++) {
          let currentRow = newList.filter(ele => ele.row === r);

          for (let c = 1; c <= 3; c++) {
            let currentCell = currentRow.find(ele => ele.column === c);
            let lastCell = currentRow.find(ele => ele.column === c - 1);

            if (currentCell.num !== 0 && currentCell.num === lastCell.num) {
              let getScore = currentCell.num * 2;
              this.setData({
                score: this.data.score + getScore
              })

              lastCell.num = getScore;
              currentCell.num = 0;
            }

          }
        }

        break;
      }
      case 'right': {

        for (let r = 0; r <= 3; r++) {
          let currentRow = newList.filter(ele => ele.row === r);

          for (let c = 2; c >= 0; c--) {
            let currentCell = currentRow.find(ele => ele.column === c);
            let lastCell = currentRow.find(ele => ele.column === c + 1);

            if (currentCell.num !== 0 && currentCell.num === lastCell.num) {
              let getScore = currentCell.num * 2;
              this.setData({
                score: this.data.score + getScore
              })

              lastCell.num = getScore;
              currentCell.num = 0;
            }

          }
        }

        break;
      }
      case 'up': {

        for (let c = 0; c <= 3; c++) {
          let currentColumn = newList.filter(ele => ele.column === c);

          for (let r = 1; r <= 3; r++) {
            let currentCell = currentColumn.find(ele => ele.row === r);
            let lastCell = currentColumn.find(ele => ele.row === r - 1);

            if (currentCell.num !== 0 && currentCell.num === lastCell.num) {
              let getScore = currentCell.num * 2;
              this.setData({
                score: this.data.score + getScore
              })

              lastCell.num = getScore;
              currentCell.num = 0;
            }

          }
        }

        break;
      }
      case 'down': {

        for (let c = 0; c <= 3; c++) {
          let currentColumn = newList.filter(ele => ele.column === c);

          for (let r = 2; r >= 0; r--) {
            let currentCell = currentColumn.find(ele => ele.row === r);
            let lastCell = currentColumn.find(ele => ele.row === r + 1);

            if (currentCell.num !== 0 && currentCell.num === lastCell.num) {
              let getScore = currentCell.num * 2;
              this.setData({
                score: this.data.score + getScore
              })

              lastCell.num = getScore;
              currentCell.num = 0;
            }

          }
        }

        break;
      }
      default: {
        break;
      }
    }

    this.setData({
      list: newList
    })
  },

  //结束
  gameOver: function () {
    this.setData({
      gameOver: true
    })
  },

  //重新开始
  restart: function () {
    this.setData({
      gameOver: false,
    })
    this.resetList();
    this.createCard();
    this.createCard();
  },

})
