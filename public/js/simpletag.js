var SIMPLETAG = SIMPLETAG || (function(){
    var _tag = ""; // private

    return {
        init : function(tagid) {
            _tag = tagid;
            // some other initialising
        },
        displayTag : function() {
            alert('My tag id is ' + _tag);
			document.write("<iframe src=\"http://localhost:3000/api/tags/call/" + _tag + "\" width=1 height=1 frameborder=0 style=\"border:0px\" ></iframe>");
        }
    };
	// TODO : call http://localhost:3000/api/tags/call/563deaa4deee2b7605b1da37
	// document.write the response
}());