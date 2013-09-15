(function(utils) {


    utils.getYPositionOfText = function(signature, code_block) {
        var original = code_block.html();
        //Replace the signature with a span
        var sanitizedSig = signature.replace("(", "\\(");
        sanitizedSig = sanitizedSig.replace(")", "\\)");
        sanitizedSig = sanitizedSig.replace(/ +/g,"( ){0,4}");
        console.log("Matching against pattern : " + sanitizedSig);
        var pattern = new RegExp(sanitizedSig, "i");
        var replaced = original.replace(pattern, "<span id='signature'>tmp</span>");
        code_block.html(replaced);
        var offset = code_block.find("#signature").offset();
        code_block.html(original);
        return offset.top;
    }

})(window.utils = window.utils || {});
