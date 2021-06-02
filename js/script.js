class Game {
  constructor(start) {
    this.stats = new Statistics();
    this.wallet = new Wallet(start);
    document
      .getElementById("start")
      .addEventListener("click", this.startGame.bind(this));

    this.spanResult = document.querySelector("span.result");
    this.spanWallet = document.querySelector("span.wallet");
    this.spanGames = document.querySelector("span.games");
    this.spanWins = document.querySelector("span.wins");
    this.spanLosses = document.querySelector("span.losses");
    this.boards = [...document.querySelectorAll("div.color")];
    this.color = document.querySelector("color");
    this.input = document.getElementById("bid");

    this.render();
  }
  render(
    colors = ["grey", "grey", "grey"],
    money = this.wallet.getWalletValue(),
    result = "",
    stats = [0, 0, 0],
    bid = 0,
    wonMoney = 0
  ) {
    if (result) {
      result = `Ты выйграл ${wonMoney}$ !`;
      this.spanResult.style.color = "rgb(255, 0, 98)";
      this.spanResult.style.fontSize = "2em";
      this.spanResult.style.fontWeight = "700";
    } else if (!result && result !== "") {
      result = `Ты потерял ${bid}$ !`;
      this.spanResult.style.color = "rgb(0, 0, 0)";
      this.spanResult.style.fontSize = "1.5em";
    }
    this.spanResult.textContent = result;

    this.spanWallet.textContent = money;
    this.spanWallet.style.fontSize = "1.3em";
    this.spanWallet.style.fontWeight = "700";

    this.spanGames.textContent = stats[0];
    this.spanGames.style.fontSize = "1.3em";
    this.spanGames.style.fontWeight = "700";

    this.spanWins.textContent = stats[1];
    this.spanWins.style.fontSize = "1.3em";
    this.spanWins.style.fontWeight = "700";

    this.spanLosses.textContent = stats[2];
    this.spanLosses.style.fontSize = "1.3em";
    this.spanLosses.style.fontWeight = "700";

    this.boards.forEach((board, index) => {
      board.style.backgroundColor = colors[index];
    });
    this.input.value = "";
  }

  startGame() {
    if (this.input.value < 1) return alert("Сумма слишком мала!");
    const bid = Math.floor(this.input.value);

    if (!this.wallet.checkCanPlay(bid)) {
      return alert("У тебя недостаточно денег !");
    }
    this.wallet.changeWalllet(bid, "-");

    this.draw = new Draw();
    const colors = this.draw.getDrawResult();
    const win = Result.checkWinner(colors);
    const wonMoney = Result.moneyWinInGame(win, bid);
    // console.log(win);
    // console.log(colors);
    // console.log(wonMoney);
    this.wallet.changeWalllet(wonMoney);
    this.spanWallet.textContent = game.wallet.getWalletValue();
    this.stats.addGameToStatistics(win, bid);

    this.render(
      colors,
      this.wallet.getWalletValue(),
      win,
      this.stats.showGameStatistics(),
      bid,
      wonMoney
    );
  }
}

class Statistics {
  constructor() {
    this.gameResults = [];
  }
  addGameToStatistics(win, bid) {
    let gameResult = {
      win: win,
      bid: bid
    };
    // console.log(gameResult);
    this.gameResults.push(gameResult);
  }

  showGameStatistics() {
    // return [ количество игр, количество побед, количество проигрышей]
    let games = this.gameResults.length;
    let wins = this.gameResults.filter((result) => result.win).length;
    let losses = games - wins;
    return [games, wins, losses];
  }
}

const stats = new Statistics();

class Result {
  static moneyWinInGame(result, bid) {
    if (result) return bid * 3;
    else return 0;
  }
  static checkWinner(draw) {
    if (
      (draw[0] === draw[1] && draw[1] === draw[2]) ||
      (draw[0] !== draw[1] && draw[1] !== draw[2] && draw[0] !== draw[2])
    )
      return true;
    else return false;
  }
}

class Wallet {
  constructor(money) {
    let _money = money;
    //скачать текущее содержимое кошелька
    this.getWalletValue = () => _money;
    //проверка наличия у пользователя соответствующей суммы средств

    this.checkCanPlay = (value) => {
      if (_money >= value) {
        return true;
      } else {
        return false;
      }
    };

    this.changeWalllet = (value, type = "+") => {
      if (typeof value === "number" && !isNaN(value)) {
        if (type === "+") {
          return (_money += value);
        } else if (type === "-") {
          return (_money -= value);
        } else {
          throw new Error("Неверный тип действия");
        }
      } else {
        // console.log(typeof value);
        throw new Error("Неправильный номер");
      }
    };
  }
}

const wallet = new Wallet(200);

class Draw {
  constructor() {
    this.options = ["pink", "blue", "yellow"];
    let _result = this.drawResult();
    this.getDrawResult = () => _result;
  }
  drawResult() {
    let colors = [];

    for (let i = 0; i < this.options.length; i++) {
      let index = Math.floor(Math.random() * this.options.length);
      let color = this.options[index];

      colors.push(color);
    }
    return colors;
  }
}
const draw = new Draw();

const game = new Game(200);

