(function(utils) {
     var s4 = function() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    utils.newGuid = function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    utils.getYPositionOfText = function(signature, code_block) {
        var original = code_block.html();
        //Replace the signature with a span
        var sanitizedSig = signature.replace("(", "\\(");
        sanitizedSig = sanitizedSig.replace(")", "\\)");
        sanitizedSig = sanitizedSig.replace("rec", "(rec)?");
        sanitizedSig = sanitizedSig.replace(/ +/g,"( ){0,4}");
        console.log("Matching against pattern : " + sanitizedSig);
        var pattern = new RegExp(sanitizedSig, "i");
        var replaced = code_block.text().replace(pattern, "<span id='signature'>tmp</span>");
        code_block.html(replaced);
        var offset = code_block.find("#signature").offset();
        code_block.html(original);
        return offset.top;
    }

    utils.find = function(list, id_func) {
        for(var i=0;i<list.length;i++) {
            if(id_func(list[i]) === true) return list[i];
        }
        return -1;
    };

    utils.groupBy = function(list, group_func) {
        var groups = {};
        for(var i=0;i<list.length;i++) {
            var group = group_func(list[i]);
            if(groups[group] === undefined) groups[group] = [];
            groups[group].push(list[i]);
        }
        return groups;
    };

    utils.dictionaryToArray = function(dict)  {
        var out = [];
        for(var key in dict) {
            out.push({
                'key' : key,
                'value' : dict[key]
            });
        }
        return out;
    };

    utils.map = function(list,trans_func) {
        var out = [];
        for(var i=0;i<list.length;i++) {
            out.push(trans_func(list[i]));
        }
        return out;
    };

    utils.reduce = function(list, base, func) {
        var result = base;
        for(var i=0;i<list.length;i++) {
            result = func(list[i],result);
        }
        return result;
    };

})(window.utils = window.utils || {});
