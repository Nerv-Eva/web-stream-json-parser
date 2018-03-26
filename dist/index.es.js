// my event handler
function EventBus(all) {
    all = all || Object.create(null);

    return {
        on: function on(type, handler) {
            if (typeof handler !== 'function') {
                throw new Error('Handler is not a function');
            }
            (all[type] || (all[type] = [])).push(handler);
        },
        off: function off(type, handler) {
            if (all[type]) {
                all[type].splice(all[type].indexOf(handler) >>> 0, 1);
            }
        },
        emit: function emit(type, evt) {
            (all[type] || []).slice().map(function (handler) {
                handler(evt);
            });
            (all['*'] || []).slice().map(function (handler) {
                handler(type, evt);
            });
        }
    };
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) { descriptor.writable = true; } Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) { defineProperties(Constructor.prototype, protoProps); } if (staticProps) { defineProperties(Constructor, staticProps); } return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Named constants with unique integer values
var C = {};
// Tokenizer States
var START = C.START = 0x11;
var TRUE1 = C.TRUE1 = 0x21;
var TRUE2 = C.TRUE2 = 0x22;
var TRUE3 = C.TRUE3 = 0x23;
var FALSE1 = C.FALSE1 = 0x31;
var FALSE2 = C.FALSE2 = 0x32;
var FALSE3 = C.FALSE3 = 0x33;
var FALSE4 = C.FALSE4 = 0x34;
var NULL1 = C.NULL1 = 0x41;
var NULL2 = C.NULL3 = 0x42;
var NULL3 = C.NULL2 = 0x43;
var NUMBER1 = C.NUMBER1 = 0x51;
var NUMBER2 = C.NUMBER2 = 0x52;
var NUMBER3 = C.NUMBER3 = 0x53;
var NUMBER4 = C.NUMBER4 = 0x54;
var NUMBER5 = C.NUMBER5 = 0x55;
var NUMBER6 = C.NUMBER6 = 0x56;
var NUMBER7 = C.NUMBER7 = 0x57;
var NUMBER8 = C.NUMBER8 = 0x58;
var STRING1 = C.STRING1 = 0x61;
var STRING2 = C.STRING2 = 0x62;
var STRING3 = C.STRING3 = 0x63;
var STRING4 = C.STRING4 = 0x64;
var STRING5 = C.STRING5 = 0x65;
var STRING6 = C.STRING6 = 0x66;

function toknam(code) {
    var keys = Object.keys(C);
    for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        if (C[key] === code) {
            return key;
        }
    }
    return code && "0x" + code.toString(16);
}

var StreamJSONPaser = function () {
    function StreamJSONPaser() {
        _classCallCheck(this, StreamJSONPaser);

        this.state = START;

        // for string parsing
        this.string = undefined;
        this.unicode = undefined;

        // For number parsing
        this.negative = undefined;
        this.magnatude = undefined;
        this.position = undefined;
        this.exponent = undefined;
        this.negativeExponent = undefined;

        // For events
        var emit = EventBus();
        this.on = emit.on;
        this.off = emit.off;
        this.emit = emit.emit;
    }

    _createClass(StreamJSONPaser, [{
        key: "read",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var _ref2, value, done;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    var this$1 = this;

                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this$1.reader.read();

                            case 2:
                                _ref2 = _context.sent;
                                value = _ref2.value;
                                done = _ref2.done;


                                this$1._parse(value);

                                if (!done) {
                                    _context.next = 8;
                                    break;
                                }

                                return _context.abrupt("return");

                            case 8:
                                _context.next = 10;
                                return this$1.read();

                            case 10:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function read() {
                return _ref.apply(this, arguments);
            }

            return read;
        }()
    }, {
        key: "charError",
        value: function charError(buffer, i) {
            throw new Error("Unexpected " + JSON.stringify(String.fromCharCode(buffer[i])) + " at position " + i + " in state " + toknam(this.state));
        }
    }, {
        key: "cancel",
        value: function cancel() {
            if (this.reader) {
                this.reader.cancel();
            }
        }
    }, {
        key: "_parse",
        value: function _parse(buffer) {
            var this$1 = this;

            if (!buffer) { return; }
            var n = void 0;
            for (var i = 0; i < buffer.length; i++) {
                switch (this$1.state) {
                    case START:
                        n = buffer[i];
                        switch (n) {
                            case 0x7b:
                                // `{`
                                this$1.emit('startObject');
                                continue;
                            case 0x7d:
                                // `}`
                                this$1.emit('endObject');
                                continue;
                            case 0x5b:
                                // `[`
                                this$1.emit('startArray');
                                continue;
                            case 0x5d:
                                // `]`
                                this$1.emit('endArray');
                                continue;
                            case 0x3a:
                                // `:`
                                this$1.emit('colon');
                                continue;
                            case 0x2c:
                                // `,`
                                this$1.emit('comma');
                                continue;
                            case 0x74:
                                // `t`
                                this$1.state = TRUE1;
                                continue;
                            case 0x66:
                                // `f`
                                this$1.state = FALSE1;
                                continue;
                            case 0x6e:
                                // `n`
                                this$1.state = NULL1;
                                continue;
                            case 0x22:
                                // `"`
                                this$1.string = "";
                                this$1.state = STRING1;
                                continue;
                            case 0x2d:
                                // `-`
                                this$1.negative = true;
                                this$1.state = NUMBER1;
                                continue;
                            case 0x30:
                                // `0`
                                this$1.magnatude = 0;
                                this$1.state = NUMBER2;
                                continue;
                        }
                        if (n > 0x30 && n < 0x40) {
                            // 1-9
                            this$1.magnatude = n - 0x30;
                            this$1.state = NUMBER3;
                            continue;
                        }
                        if (n === 0x20 || n === 0x09 || n === 0x0a || n === 0x0d) {
                            continue; // whitespace
                        }
                        this$1.charError(buffer, i);
                        break;
                    case STRING1:
                        // After open quote
                        n = buffer[i];
                        switch (n) {
                            case 0x22:
                                // `"`
                                this$1.emit('string', this$1.string);
                                this$1.string = undefined;
                                this$1.state = START;
                                continue;
                            case 0x5c:
                                // `\`
                                this$1.state = STRING2;
                                continue;
                        }
                        if (n >= 0x20) {
                            this$1.string += String.fromCharCode(n);
                            continue;
                        }
                        this$1.charError(buffer, i);
                        break;
                    case STRING2:
                        // After backslash
                        n = buffer[i];
                        switch (n) {
                            case 0x22:
                                this$1.string += "\"";this$1.state = STRING1;continue;
                            case 0x5c:
                                this$1.string += "\\";this$1.state = STRING1;continue;
                            case 0x2f:
                                this$1.string += "/";this$1.state = STRING1;continue;
                            case 0x62:
                                this$1.string += "\b";this$1.state = STRING1;continue;
                            case 0x66:
                                this$1.string += "\f";this$1.state = STRING1;continue;
                            case 0x6e:
                                this$1.string += "\n";this$1.state = STRING1;continue;
                            case 0x72:
                                this$1.string += "\r";this$1.state = STRING1;continue;
                            case 0x74:
                                this$1.string += "\t";this$1.state = STRING1;continue;
                            case 0x75:
                                this$1.unicode = "";this$1.state = STRING3;continue;
                        }
                        this$1.charError(buffer, i);
                        break;
                    case STRING3:case STRING4:case STRING5:case STRING6:
                        // unicode hex codes
                        n = buffer[i];
                        // 0-9 A-F a-f
                        if (n >= 0x30 && n < 0x40 || n > 0x40 && n <= 0x46 || n > 0x60 && n <= 0x66) {
                            this$1.unicode += String.fromCharCode(n);
                            if (this$1.state++ === STRING6) {
                                this$1.string += String.fromCharCode(parseInt(this$1.unicode, 16));
                                this$1.unicode = undefined;
                                this$1.state = STRING1;
                            }
                            continue;
                        }
                        this$1.charError(buffer, i);
                        break;
                    case NUMBER1:
                        // after minus
                        n = buffer[i];
                        if (n === 0x30) {
                            // `0`
                            this$1.magnatude = 0;
                            this$1.state = NUMBER2;
                            continue;
                        }
                        if (n > 0x30 && n < 0x40) {
                            // `1`-`9`
                            this$1.magnatude = n - 0x30;
                            this$1.state = NUMBER3;
                            continue;
                        }
                        this$1.charError(buffer, i);
                        break;
                    case NUMBER2:
                        // * After initial zero
                        switch (buffer[i]) {
                            case 0x2e:
                                // .
                                this$1.position = 0.1;this$1.state = NUMBER4;continue;
                            case 0x65:case 0x45:
                                // e/E
                                this$1.exponent = 0;this$1.state = NUMBER6;continue;
                        }
                        this$1.finish();
                        i--; // rewind to re-check this char
                        continue;
                    case NUMBER3:
                        // * After digit (before period)
                        n = buffer[i];
                        switch (n) {
                            case 0x2e:
                                // .
                                this$1.position = 0.1;this$1.state = NUMBER4;continue;
                            case 0x65:case 0x45:
                                // e/E
                                this$1.exponent = 0;this$1.state = NUMBER6;continue;
                        }
                        if (n >= 0x30 && n < 0x40) {
                            // 0-9
                            this$1.magnatude = this$1.magnatude * 10 + (n - 0x30);
                            continue;
                        }
                        this$1.finish();
                        i--; // rewind to re-check
                        continue;
                    case NUMBER4:
                        // After period
                        n = buffer[i];
                        if (n >= 0x30 && n < 0x40) {
                            // 0-9
                            this$1.magnatude += this$1.position * (n - 0x30);
                            this$1.position /= 10;
                            this$1.state = NUMBER5;
                            continue;
                        }
                        this$1.charError(buffer, i);
                        break;
                    case NUMBER5:
                        // * After digit (after period)
                        n = buffer[i];
                        if (n >= 0x30 && n < 0x40) {
                            // 0-9
                            this$1.magnatude += this$1.position * (n - 0x30);
                            this$1.position /= 10;
                            continue;
                        }
                        if (n === 0x65 || n === 0x45) {
                            // E/e
                            this$1.exponent = 0;
                            this$1.state = NUMBER6;
                            continue;
                        }
                        this$1.finish();
                        i--; // rewind
                        continue;
                    case NUMBER6:
                        // After E
                        n = buffer[i];
                        if (n === 0x2b || n === 0x2d) {
                            // +/-
                            if (n === 0x2d) {
                                this$1.negativeExponent = true;
                            }
                            this$1.state = NUMBER7;
                            continue;
                        }
                        if (n >= 0x30 && n < 0x40) {
                            this$1.exponent = this$1.exponent * 10 + (n - 0x30);
                            this$1.state = NUMBER8;
                            continue;
                        }
                        this$1.charError(buffer, i);
                        break;
                    case NUMBER7:
                        // After +/-
                        n = buffer[i];
                        if (n >= 0x30 && n < 0x40) {
                            // 0-9
                            this$1.exponent = this$1.exponent * 10 + (n - 0x30);
                            this$1.state = NUMBER8;
                            continue;
                        }
                        this$1.charError(buffer, i);
                        break;
                    case NUMBER8:
                        // * After digit (after +/-)
                        n = buffer[i];
                        if (n >= 0x30 && n < 0x40) {
                            // 0-9
                            this$1.exponent = this$1.exponent * 10 + (n - 0x30);
                            continue;
                        }
                        this$1.finish();
                        i--;
                        continue;
                    case TRUE1:
                        // r
                        if (buffer[i] === 0x72) {
                            this$1.state = TRUE2;
                            continue;
                        }
                        this$1.charError(buffer, i);
                        break;
                    case TRUE2:
                        // u
                        if (buffer[i] === 0x75) {
                            this$1.state = TRUE3;
                            continue;
                        }
                        this$1.charError(buffer, i);
                        break;
                    case TRUE3:
                        // e
                        if (buffer[i] === 0x65) {
                            this$1.state = START;
                            this$1.emit('boolean', true);
                            continue;
                        }
                        this$1.charError(buffer, i);
                        break;
                    case FALSE1:
                        // a
                        if (buffer[i] === 0x61) {
                            this$1.state = FALSE2;
                            continue;
                        }
                        this$1.charError(buffer, i);
                        break;
                    case FALSE2:
                        // l
                        if (buffer[i] === 0x6c) {
                            this$1.state = FALSE3;
                            continue;
                        }
                        this$1.charError(buffer, i);
                        break;
                    case FALSE3:
                        // s
                        if (buffer[i] === 0x73) {
                            this$1.state = FALSE4;
                            continue;
                        }
                        this$1.charError(buffer, i);
                        break;
                    case FALSE4:
                        // e
                        if (buffer[i] === 0x65) {
                            this$1.state = START;
                            this$1.emit('boolean', false);
                            continue;
                        }
                        this$1.charError(buffer, i);
                        break;
                    case NULL1:
                        // u
                        if (buffer[i] === 0x75) {
                            this$1.state = NULL2;
                            continue;
                        }
                        this$1.charError(buffer, i);
                        break;
                    case NULL2:
                        // l
                        if (buffer[i] === 0x6c) {
                            this$1.state = NULL3;
                            continue;
                        }
                        this$1.charError(buffer, i);
                        break;
                    case NULL3:
                        // l
                        if (buffer[i] === 0x6c) {
                            this$1.state = START;
                            this$1.emit('null', null);
                            continue;
                        }
                        this$1.charError(buffer, i);
                }
            }
        }
    }, {
        key: "finish",
        value: function finish() {
            switch (this.state) {
                case NUMBER2:
                    // * After initial zero
                    this.emit('number', 0);
                    this.state = START;
                    this.magnatude = undefined;
                    this.negative = undefined;
                    break;
                case NUMBER3:
                    // * After digit (before period)
                    this.state = START;
                    if (this.negative) {
                        this.magnatude = -this.magnatude;
                        this.negative = undefined;
                    }
                    this.emit('number', this.magnatude);
                    this.magnatude = undefined;
                    break;
                case NUMBER5:
                    // * After digit (after period)
                    this.state = START;
                    if (this.negative) {
                        this.magnatude = -this.magnatude;
                        this.negative = undefined;
                    }
                    this.emit('number', this.negative ? -this.magnatude : this.magnatude);
                    this.magnatude = undefined;
                    this.position = undefined;
                    break;
                case NUMBER8:
                    // * After digit (after +/-)
                    if (this.negativeExponent) {
                        this.exponent = -this.exponent;
                        this.negativeExponent = undefined;
                    }
                    this.magnatude *= Math.pow(10, this.exponent);
                    this.exponent = undefined;
                    if (this.negative) {
                        this.magnatude = -this.magnatude;
                        this.negative = undefined;
                    }
                    this.state = START;
                    this.emit('number', this.magnatude);
                    //this.callbacks.onNumber(this.magnatude);
                    this.magnatude = undefined;
                    break;
            }
            if (this.state !== START) {
                //this.callbacks.onError(new Error("Unexpected end of input stream"));
                throw new Error('Unexpected end of input stream');
            }
        }
    }, {
        key: "parse",
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(stream) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    var this$1 = this;

                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                this$1.reader = stream.getReader();
                                _context2.next = 3;
                                return this$1.read();

                            case 3:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function parse(_x) {
                return _ref3.apply(this, arguments);
            }

            return parse;
        }()
    }]);

    return StreamJSONPaser;
}();

export default StreamJSONPaser;
//# sourceMappingURL=index.es.js.map
