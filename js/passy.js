﻿(function ($) {
    // Polat Aydın 7.10.2013

    var passy = {
        character: { UPPERCASEORLOWERCASE: 0, DIGIT: 1, LOWERCASE: 2, UPPERCASE: 4, PUNCTUATION: 8 },
        strength: { LOW: 0, MEDIUM: 1, HIGH: 2, EXTREME: 3 },

        dictionary: [],

        patterns: [
            '0123456789',
            'abcdefghijklmnopqrstuvwxyz',
            'qwertyuiopasdfghjklzxcvbnm',
            'azertyuiopqsdfghjklmwxcvbn',
            '!#$*+-.:?@^'
        ],

        threshold: {
            medium: 16,
            high: 22,
            extreme: 36
        }
    };
    // Polat Aydın 7.10.2013
    // Polat Aydın 7.10.2013
    var requirementsarray = [passy.character.DIGIT, passy.character.UPPERCASEORLOWERCASE];
    // Polat Aydın 7.10.2013
    passy.requirements = {
        characters: requirementsarray,
        length: {
            min: 6,
            max: 12
        }
    };

    if (Object.seal) {
        Object.seal(passy.character);
        Object.seal(passy.strength);
    }

    if (Object.freeze) {
        Object.freeze(passy.character);
        Object.freeze(passy.strength);
    }

    passy.analize = function (password) {
        var score = Math.floor(password.length * 2);
        var i = password.length;

        score += $.passy.analizePatterns(password);
        score += $.passy.analizeDictionary(password);

        while (i--) score += $.passy.analizeCharacter(password.charAt(i));

        return $.passy.analizeScore(score);
    };

    passy.analizeCharacter = function (char) {
        var code = char.charCodeAt(0);

        if (code >= 97 && code <= 122) return 1; // lower case
        if (code >= 48 && code <= 57) return 2;  // numeric
        if (code >= 65 && code <= 90) return 3;  // capital
        if (code <= 126) return 4;               // punctuation
        return 5;                               // foreign characters etc
    };

    passy.analizePattern = function (password, pattern) {
        var lastmatch = -1;
        var score = -2;

        for (var i = 0; i < password.length; i++) {
            var match = pattern.indexOf(password.charAt(i));

            if (lastmatch === match - 1) {
                lastmatch = match;
                score++;
            }
        }

        return Math.max(0, score);
    };

    passy.analizePatterns = function (password) {
        var chars = password.toLowerCase();
        var score = 0;

        for (var i in $.passy.patterns) {
            var pattern = $.passy.patterns[i].toLowerCase();
            score += $.passy.analizePattern(chars, pattern);
        }

        // patterns are bad man!
        return score * -5;
    };

    passy.analizeDictionary = function (password) {
        var chars = password.toLowerCase();
        var score = 0;

        for (var i in $.passy.dictionary) {
            var word = $.passy.dictionary[i].toLowerCase();

            if (password.indexOf(word) >= 0) score++;
        }

        // using words are bad too!
        return score * -5;
    };

    passy.analizeScore = function (score) {
        if (score >= $.passy.threshold.extreme) return $.passy.strength.EXTREME;
        if (score >= $.passy.threshold.high) return $.passy.strength.HIGH;
        if (score >= $.passy.threshold.medium) return $.passy.strength.MEDIUM;

        return $.passy.strength.LOW;
    };

    passy.generate = function (len) {
        var chars = [
            '0123456789',
            'abcdefghijklmnopqrstuvwxyz',
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            '!#$&()*+<=>@[]^'
        ];

        var password = [];
        var type, index;

        len = Math.max(len, $.passy.requirements.length.min);
        len = Math.min(len, $.passy.requirements.length.max);

        while (len--) {
            type = len % chars.length;
            index = Math.floor(Math.random() * chars[type].length);
            password.push(chars[type].charAt(index));
        }

        password.sort(function () {
            return Math.random() * 2 - 1;
        });

        return password.join('');
    };

    passy.contains = function (str, char) {

        if (char === $.passy.character.DIGIT) {
            return /\d/.test(str);
        } else if (char === $.passy.character.LOWERCASE) {
            return /[a-z]/.test(str);
        } else if (char === $.passy.character.UPPERCASE) {
            return /[A-Z]/.test(str);
        } else if (char === $.passy.character.PUNCTUATION) {
            return /[!"#$%&'()*+,\-./:;<=>?@[\\]\^_`{\|}~]/.test(str);
        }
        else if (char === $.passy.character.UPPERCASEORLOWERCASE) {
            return /[a-z]/.test(str) || /[A-Z]/.test(str);
        }
    };

    passy.valid = function (str) {

        var valid = true;

        if (!$.passy.requirements) return true;

        if (str.length < $.passy.requirements.length.min) return false;
        if (str.length > $.passy.requirements.length.max) return false;
        // Polat Aydın 7.10.2013

        for (var i in $.passy.character) {

            $.grep($.passy.requirements.characters, function (index, value) {
                if (value == $.passy.character[i]) {
                    valid = $.passy.contains(str, $.passy.character[i]);
                   
                }   
            });
            if (valid == false) {
                break;
            }
            //original version
            //if ($.passy.requirements.characters & $.passy.character[i]) {
            //    valid = $.passy.contains(str, $.passy.character[i]) && valid;
            //}
            // Polat Aydın 7.10.2013
        }

        return valid;
    };

    var methods = {
        init: function (callback) {
            var $this = $(this);

            $this.on('change keyup', function () {
                if (typeof callback !== 'function') return;

                var value = $this.val();
                callback.call($this, $.passy.analize(value), methods.valid.call($this));
            });
        },

        generate: function (len) {
            this.val($.passy.generate(len));
            this.change();
        },

        valid: function () {
            return $.passy.valid(this.val());
        }
    };

    $.fn.passy = function (opt) {
        if (methods[opt]) {
            return methods[opt].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof opt === 'function' || !opt) {
            return methods.init.apply(this, arguments);
        }

        return this;
    };

    $.extend({ passy: passy });
})(jQuery);