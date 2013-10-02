function GetCrmData(url,ulid,addhrefclassforclick,localstoragename) {

    var lookuparray = [];
    var integer = 0;
    var count = null;

    if (localStorage[localstoragename] == null || localStorage[localstoragename].length == 0) {

        $("#" + ulid).empty();
        while (true) {

            $.ajax({

                type: "GET",
                contentType: "application/json;charset=utf-8",
                datatype: "json",
                url: url,
                async: false,
                data: { page: integer },
                cache: false,
                processData: true,
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                },
                success: function (data) {//On Successfull service call   
                    integer = parseInt(integer) + 1;
                    count = data.d.length;
                    if (data.d.length > 0) {
                        for (var i = 0; i < data.d.length; i++) {
                            // Enhance new listview element      

                            var $li = $('<li />').appendTo($("#"+ulid));

                            var $a = $('<a />').appendTo($li);
                            $a.attr("href", "#");
                            $a.addClass(addhrefclassforclick);
                            $a.text(data.d[i].Name);
                            $("#" + ulid).listview('refresh');

                            //lookupobject must Name And Guid Standart
                            var lookup = {};
                            lookup.Name = data.d[i].Name;
                            lookup.Guid = data.d[i].Guid;
                            //we fill the array after we want to create record , we find the selected item guid into this array 
                            lookuparray.push(lookup);
                        }
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                }
            });
            if (count == 0 || count == null) {
                localStorage[localstoragename] = JSON.stringify(lookuparray);
                break;

            }
        }

    }
    else {

        var storeditems = JSON.parse( localStorage[localstoragename]);
        $("#"+ulid).empty();
        for (var i = 0; i < storeditems.length; i++) {

            var $li = $('<li />').appendTo($("#" + ulid));

            var $a = $('<a />').appendTo($li);
            $a.attr("href", "#");
            $a.addClass(addhrefclassforclick);
            $a.text(storeditems[i].Name);
            $('#' + ulid).listview('refresh');
        }
    }

    return localStorage[localstoragename];

}

function dateToWcf(input) {
    var d = new Date(input);
    if (isNaN(d)) return null;
    return '\/Date(' + d.getTime() + '-0000)\/';
}

function getUrlVars(url) {
    var vars = [], hash;
    var hashes = url.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

