  // ###############################
 // ##  Random Number Observer  ###
// ###############################

'use strict';

// app object
var app = {

  cycle: 500,
  inputs: document.forms['hud'].getElementsByTagName('input'),
  clearBtn: document.getElementById('clear-btn'),
  stat: document.getElementById('stat'),
  dataSets: [],

  init: function() {
    // Start Stop App
    this.inputs.startBtn.addEventListener('click', this.startStop.bind(this), true);
    // Clear Cache
    this.clearBtn.addEventListener('click', this.clearCache);

    // Event Handler for focus
    var formItems = document.getElementsByClassName('form-item');
    for(let x = 0; x < formItems.length; x++) {
      formItems[x].addEventListener('focus', this._focusItem ,true);
      formItems[x].addEventListener('blur', this._focusItem ,true);
    };

    // get local storage
    if(localStorage.getItem('dataSets')) {
      this.dataSets = JSON.parse(localStorage.getItem('dataSets'));
      for(let x = 0; x < this.dataSets.length; x++) {
        // console.log(this.dataSets[x]);
        this._renderStats(this.dataSets[x]);
      }
    }

    this.toggleMenu('close');
    this._visualFeedback();
  },

  _getSettings: function() {
    var settings = {
      cycle: parseInt(document.getElementById('cycle').value),
      count: parseInt(document.getElementById('count').value)
    };
    return settings;
  },

  toggleMenu: function(comm) {
    var menu = document.getElementById('menu');
    switch (comm) {
      case 'open':
        // menu.style.display = 'block';
        menu.style.height = '148px';
        break;
      case 'close':
        menu.style.height = '0px';
        break;
      default:
        // menu.style.display = (menu.style.display == 'none' || menu.style.display == '') ? 'block' : 'none';
        menu.style.height = (menu.style.height == '0px' || menu.style.height == '') ? '148px' : '0px';
        break;
    }
  },

  _focusItem: function(e) {
    this.classList.toggle('focus');
  },

  _randomNum: function() {
    this.inputs.rand.value = Math.floor(Math.random()*2);
  },

  _clearInputs: function() {
    for(var x = 0; x < 4; x++) {
      this.inputs[x].value = 0;
    };
  },

  clearCache: function() {
    this.dataSets = [];
    localStorage.clear();
    location.reload();
  },

  startStop: function() {
    // console.log(this.timer);

    this._visualFeedback();
    this.toggleMenu('close');

    var btn = this.inputs.startBtn;
    if (btn.value == 'Stop') { // Start Interval
      btn.value = 'Start';
      btn.classList.toggle('btn-active');
      clearInterval(this.timer);
      this._saveStats();
    }else { // Stop Interval and Claer Inputs
      this._clearInputs();
      this.timer = setInterval(this._go.bind(this), this._getSettings().cycle);
      btn.value = 'Stop';
      btn.classList.toggle('btn-active');
    };
  },

  _visualFeedback: function() {
    var app = document.getElementById('app');
    app.className = '';
    app.style['box-shadow'] = '0px 0px 18px 1px dodgerblue';
    this.clickTimer = setInterval(function() {
      app.className = 'app-focus';
      app.style['box-shadow'] = '0px 0px 18px slategrey';
      clearInterval(this.clickTimer);
    }.bind(this), 80);
  },

  _go: function() {
    var counter = this.inputs.counter;
    var count = this._getSettings().count;

    counter.value ++;
    if(counter.value < count) {
      this._randomNum();
      if (this.inputs.rand.value == 0) {
        this.inputs.zero.focus();
        this.inputs.zero.value ++;
      }else {
        this.inputs.one.focus();
        this.inputs.one.value ++;
      }
    } else {
      this.startStop();
    }
  },

  _saveStats: function() {
    var data = {
      count: this.inputs.counter.value,
      zero: this.inputs.zero.value,
      one: this.inputs.one.value
    };
    // render to display
    this._renderStats(data);
    this.dataSets.push(data);
    // save to local storage
    localStorage.setItem('dataSets', JSON.stringify(this.dataSets));
  },

  _renderStats: function(data) {
    var htmlRow = document.createElement('tr');

    var count = document.createElement('td');
    var zero = document.createElement('td');
    var one = document.createElement('td');

    if(data.zero > data.one) {
      one.className = 'lower';
      zero.className = 'higher';
    } else if(data.zero < data.one) {
      one.className = 'higher';
      zero.className = 'lower';
    } else {
      one.className = 'even';
      zero.className = 'even';
    }

    count.innerHTML = '<span>' + data.count + '</span>';
    one.innerHTML = '<span>' + data.one + '</span>';
    zero.innerHTML = '<span>' + data.zero + '</span>';

    htmlRow.append(count);
    htmlRow.append(zero);
    htmlRow.append(one);
    stat.after(htmlRow);
  },

  sortStats: function(n) {
    var table,
        rows,
        switching,
        i,
        x,
        y,
        shouldSwitch,
        dir,
        switchcount = 0;

    table = document.getElementById("statTable");
    switching = true;

    // Set the sorting direction to ascending:
    dir = "asc";
    while (switching) {
      switching = false;
      rows = table.getElementsByTagName("TR");
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        x = parseInt(x.firstChild.innerHTML);
        y = parseInt(y.firstChild.innerHTML);

        if (dir == "asc") {
          if (x > y) {
            // If so, mark as a switch and break the loop:
            shouldSwitch= true;
            break;
          }
        } else if (dir == "desc") {
          if (x < y) {
            // If so, mark as a switch and break the loop:
            shouldSwitch= true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount ++;
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

};
