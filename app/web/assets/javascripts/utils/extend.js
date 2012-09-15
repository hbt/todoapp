String.prototype.trim = function() {
    return (this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, ""))
}

String.prototype.startsWith = function(str) {
    return (this.match("^" + RegExp.escape(str)) == str);
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.escapeRegExp = function() {
    // From MooTools core 1.2.4
    return this.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
}

String.prototype.trimFirst = function( /* String || Array */ str) {
    if (typeof str == 'string') {
        return this.replace(new RegExp("^" + RegExp.escape(str)), "").trim();
    } else {
        var result = this;
        for (var i = 0; i < str.length; i++) {
            result = result.replace(new RegExp("^" + RegExp.escape(str[i])), "").trim();
        }
        return result;
    }
}

String.prototype.reverse = function() {
    return this.split('').reverse().join('')
}

String.prototype.isUpperCase = function() {
    return (this == this.toUpperCase());
}

String.prototype.isLowerCase = function() {
    return (this == this.toLowerCase());
}

String.prototype.firstLetterUpper = function() {
    var ret = this.replace('', '')
    ret = ret.charAt(0).toUpperCase() + ret.substring(1)
    return ret
}


String.prototype.escape = function() {
    return _.escape(this);
}

String.prototype.formatLineBreaks = function() {
    return this.replace(/\n/g, '<br/>')
}

String.prototype.isValidURL = function() {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return this.match(exp) !== null
}

String.prototype.transformURL = function() {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return this.replace(exp, "<a href='$1'>$1</a>");
}

RegExp.escape = function(text) {
    if (!arguments.callee.sRE) {
        var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
        arguments.callee.sRE = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
    }
    return text.replace(arguments.callee.sRE, '\\$1');
}

String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length == 0) return hash;
    for (var i = 0; i < this.length; i++) {
        var c = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + c;
        hash = hash & hash;
    }
    return hash;
}
