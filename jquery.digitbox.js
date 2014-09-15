
/*
* Digitbox Jquery Component by Mostafa Rowghanian
* Version: 0.0
* Release: 2013-11-22
*/
(function ($) {
    $.digitbox = {
        defaults: {
            createWords: true,
            thousandSeparator: true,
            postfix: ''
        },
        getThousandGroupName: function (_igroup) {
            switch (_igroup) {
                case 2: return ' هزار';
                case 3: return ' میلیون';
                case 4: return ' میلیارد';
                case 5: return ' هزار میلیار';
            }
            return '';
        },
        digitsToWord3: function (chars) {
            if (chars == '000') return '';
            var _text = '';
            switch (chars.substring(0, 1)) {
                case '1': _text += 'یکصد'; break;
                case '2': _text += 'دویست'; break;
                case '3': _text += 'سیصد'; break;
                case '4': _text += 'چهارصد'; break;
                case '5': _text += 'پانصد'; break;
                case '6': _text += 'ششصد'; break;
                case '7': _text += 'هفتصد'; break;
                case '8': _text += 'هشتصد'; break;
                case '9': _text += 'نهصد'; break;
            }
            if (_text.length > 0) _text += ' و ';
            if (chars.substring(1, 2) == '1') {
                switch (chars.substring(2, 3)) {
                    case '0': _text += 'ده'; break;
                    case '1': _text += 'یازده'; break;
                    case '2': _text += 'دوازده'; break;
                    case '3': _text += 'سیزده'; break;
                    case '4': _text += 'چهارده'; break;
                    case '5': _text += 'پانزده'; break;
                    case '6': _text += 'شانزده'; break;
                    case '7': _text += 'هفده'; break;
                    case '8': _text += 'هیجده'; break;
                    case '9': _text += 'نوزده'; break;
                }
            }
            else {
                switch (chars.substring(1, 2)) {
                    case '0': _text = _text.substring(0, _text.length - 3); break;
                    case '2': _text += 'بیست'; break;
                    case '3': _text += 'سی'; break;
                    case '4': _text += 'چهل'; break;
                    case '5': _text += 'پنجاه'; break;
                    case '6': _text += 'شصت'; break;
                    case '7': _text += 'هفتاد'; break;
                    case '8': _text += 'هشتاد'; break;
                    case '9': _text += 'نود'; break;
                }
                if (_text.length > 0) _text += ' و ';
                switch (chars.substring(2, 3)) {
                    case '0': _text = _text.substring(0, _text.length - 3); break;
                    case '1': _text += 'یک'; break;
                    case '2': _text += 'دو'; break;
                    case '3': _text += 'سه'; break;
                    case '4': _text += 'چهار'; break;
                    case '5': _text += 'پنج'; break;
                    case '6': _text += 'شش'; break;
                    case '7': _text += 'هفت'; break;
                    case '8': _text += 'هشت'; break;
                    case '9': _text += 'نه'; break;
                }
            }
            return _text;
        },
        digitsToWord: function (chars, options) {
            if (chars.length == 0) return 'در انتظار ورود اعداد';
            var _lengthMod3 = chars.length % 3;
            if (_lengthMod3 > 0) for (i = 0; i < 3 - _lengthMod3; i++) chars = '0' + chars;
            if (chars == '000') return 'صفر' + options.postfix;
            var _groups_count = chars.length / 3;
            var _groups = new Array();
            var _text = '';
            for (i = 0; i < _groups_count; i++) {
                _groups[i] = chars.substring(i * 3, i * 3 + 3);
                if (_groups[i] == '000') continue;
                if (_text.length > 0) _text += ' و ';
                _text += $.digitbox.digitsToWord3(_groups[i]);
                _text += $.digitbox.getThousandGroupName(_groups_count - i);
            }
            return _text + options.postfix;
        },
        thousandSeparate: function (inputControl) {
            var _input = $(inputControl);
            var _val = _input.val();
            _val = _val.replace(/,/g, '');
            _val = _val.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            _input.val(_val);
            return _input;
        }
    };

    $.fn.digitbox = function (_options) {
        var options = $.extend({}, $.digitbox.defaults, _options);
        return this.each(function () {
            var _input = $(this);
            var _pos = {
                top: _input.position().top + _input.height() + 14,
                left: _input.offset().left,
                width: _input.width() + 2,
                height: _input.height()
            };
            var _overlay = $('<div></div>').css({
                'position': 'absolute', 'z-index': '1',
                'top': String(_pos.top) + 'px',
                'left': String(_pos.left) + 'px',
                'width': String(_pos.width) + 'px',
                'padding': '5px', 'background-color': '#e6f1f6',
                'border': '1px solid #ccc',
                'border-radius': '5px 5px 5px 5px',
                'border-color': 'rgb(0, 136, 204)',
                'font-family': 'tahoma', 'font-size': '10px',
                'box-shadow': '0px 1px 4px rgba(0, 105, 214, 0.25)'
            }).hide();
            _input.bind('keyup', function () {
                    var _val = $(this).val();
                    // remove the thousand separator char
                    if (options.thousandSeparator)
                        _val = _val.replace(/,/g, '');
                    // if there is a 0 at the beginning, remove it
                    if (_val.length > 1 && _val.substring(0, 1) == '0') _val = _val.substring(1);
                    // produce the words
                    if (options.createWords)
                        _overlay.html($.digitbox.digitsToWord(_val, options));
                    // insert the thousand separator char
                    if (options.thousandSeparator)
                        _val = _val.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    // place 0 instead of empty string
                    //if (_val == '') _val = '0';
                    // place the correct string in the textbox
                    $(this).val(_val);
                })
                .bind('keypress', function (evt) {
                    // allow only number keys
                    evt = (evt) ? evt : window.event;
                    var charCode = (evt.which) ? evt.which : evt.keyCode;
                    if (charCode == 38)
                        $(this).val(String(parseInt($(this).val().replace(/,/g, '')) + 1));
                    if (charCode == 40)
                        $(this).val(String(parseInt($(this).val().replace(/,/g, '')) - 1));
                    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
                    return true;
                }).bind('focus', function () {
                    $(this).select();
                    if (options.createWords)
                        _overlay.fadeIn();
                }).bind('blur', function () {
                    if (options.createWords)
                        _overlay.fadeOut();
                });
            if (options.createWords)
                $(this).after(_overlay);
            if (options.createWords)
                _overlay.html($.digitbox.digitsToWord($(this).val(), options));
            if (options.thousandSeparator)
                $(this).val($(this).val().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        })
    };

})(jQuery);
