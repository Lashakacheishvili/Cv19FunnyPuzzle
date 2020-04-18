(function() {
  var Blank, Puzzle, Tile,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Puzzle = (function() {
    function Puzzle(images) {
      var i, image, t, x, y, _i, _j, _len, _ref,
        _this = this;
      this.images = images;
      this.changeImage = __bind(this.changeImage, this);
      this.switchTwo = __bind(this.switchTwo, this);
      this.renderBoard = __bind(this.renderBoard, this);
      this.blankPosition = __bind(this.blankPosition, this);
      this.checkIfWon = __bind(this.checkIfWon, this);
      this.mixup = __bind(this.mixup, this);
      this.places = [];
      this.initialPlaces = [];

      this.first = '';
      _ref = this.images;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        image = _ref[_i];
        $('#previews').append('<img src="' + image + '" class="mini"/>');
      }
      this.image = this.images[0];
      $('.mini').bind('click', function(event) {
        return _this.changeImage(event.target.src);
      });
      for (i = _j = 0; _j <= 7; i = ++_j) {
        x = Math.floor(i % 3) * 110;
        y = Math.floor(i / 3) * 110;
        t = new Tile(i, 110, 110, x, y, this.image);
        this.places.push(t);
      }
      this.places.push(new Blank(8));
      this.initialPlaces = this.places.slice(0);
      this.mixup();
      $(document).keyup(function( event ) {
        if ( event.which != 81 && event.which != 113 ) return;
        var elems = document.querySelectorAll('.innerSquare:hover');
        if(!elems.length) return;
  
        var elem = elems[0];
        if(!_this.first){
          _this.first = elem;
        }else {
          _this.switchTwo(parseInt(elem.id), parseInt(_this.first.id));
          _this.first = '';
  
        }
      });
    }

    Puzzle.prototype.mixup = function() {
      var blankpos, i, randomNum, _i, _results;
      blankpos = 8;
      _results = [];
      for (i = _i = 0; _i <= 10; i = ++_i) {
        randomNum = Math.floor(Math.random() * 9);
        this.switchTwo(randomNum, blankpos);
        _results.push(blankpos = randomNum);
      }
      return _results;
    };

    Puzzle.prototype.checkIfWon = function() {
      var i, _i;
      for (i = _i = 0; _i <= 8; i = ++_i) {
        if (this.places[i] === this.initialPlaces[i]) {
          continue;
        } else {
          return false;
        }
      }
      return true;
    };

    Puzzle.prototype.blankPosition = function() {
      var place, pos, _i, _len, _ref;
      _ref = this.places;
      for (pos = _i = 0, _len = _ref.length; _i < _len; pos = ++_i) {
        place = _ref[pos];
        if (place["class"] === 'Blank') {
          return pos;
        }
      }
    };


    Puzzle.prototype.renderBoard = function() {
      var blank, t, _i, _len, _ref,
        _this = this;
      blank = this.blankPosition();
      $('#canvas').html('');
      if (this.checkIfWon()) {
        $('#canvas').append('<span id="windiv"><img src="' + this.image + '"/><div class="banner">საღოლ :D</div></span>');
        return $('#windiv').show('slow');
      } else {
        _ref = this.places;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          t = _ref[_i];
          t.show(blank);
        }
  
        return $('.clickable').bind('click', function(event) {
          var toSwitch;
          toSwitch = parseInt(event.target.id);
          return _this.switchTwo(toSwitch, _this.blankPosition());
        });
      }
    };

    Puzzle.prototype.switchTwo = function(pos1, pos2) {
      var bl = this.blankPosition();
      if(isNaN(pos1)) pos1 = bl;
      if(isNaN(pos2)) pos2 = bl;
      if(pos1 == bl){
          pos1 = pos2;
          pos2 = bl;
      }
      var x, y;
    //  console.log("1: " + pos1 + " 2: " + pos2);
      x = this.places[pos1];
      y = this.places[pos2];
      this.places[pos2] = x;
      this.places[pos1] = y;
      this.places[pos2].position = pos2;
      if(pos2 != bl)
        this.places[pos1].position = pos1;
      return this.renderBoard();
    };

    Puzzle.prototype.changeImage = function(image) {
      var panel, _i, _len, _ref;
      this.image = image;
      _ref = this.places;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        panel = _ref[_i];
        if (panel["class"] !== 'Blank') {
          panel.image = image;
        }
      }

      this.mixup();
      return this.renderBoard();
    };
//esaa sadac surati brundeba ho? ki

    return Puzzle;

  })();

  Tile = (function() {
    function Tile(position, width, height, x, y, image) {
      this.position = position;
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.image = image;
      this["class"] = 'Tile';
    }

    Tile.prototype.show = function(blankPosition) {
      if (this.isAdjacent(blankPosition)) {
        $('#canvas').append('<div id="' + this.position + '" class="innerSquare imageSquare clickable"></div>');
      } else {
        $('#canvas').append('<div id="' + this.position + '" class="innerSquare imageSquare"></div>');
      }
      $("#" + this.position).css('background-position', '-' + this.x + 'px -' + this.y + 'px');
      return $("#" + this.position).css('background-image', 'url(' + this.image + ')');
    };

    Tile.prototype.isAdjacent = function(blanksPosition) {
      if (blanksPosition - 1 === this.position && (blanksPosition % 3) > 0 || blanksPosition + 1 === this.position && (blanksPosition % 3) < 2 || blanksPosition + 3 === this.position && (blanksPosition / 3) < 2 || blanksPosition - 3 === this.position && (blanksPosition / 3) > 0) {
        return true;
      }
      return false;
    };

    Tile.prototype.setImage = function(image) {
      return this.image = image;
    };

    return Tile;

  })();

  Blank = (function() {
    function Blank(position) {
      this.position = position;
      this["class"] = 'Blank';
    }

    Blank.prototype.show = function() {
      return $('#canvas').append('<div class="innerSquare blank"></div>');
    };

    return Blank;

  })();

  var puzz;
  $(document).ready(function() {
    var imgs, puzzle;
    imgs = ['css/image/img1.jpg', 'css/image/img2.jpg', 'css/image/img3.jpg', 'css/image/img4.jpg', 'css/image/img5.jpg'];
    puzz = new Puzzle(imgs);
  });
}).call(this);


