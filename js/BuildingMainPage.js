
$(document).bind("pagebeforecreate", function (e, data) {

    debugger;

    var $page = $("div[data-role='page']");

    $divheader = $('<div />').appendTo($page);
    $divheader.attr("data-theme", "d");
    $divheader.attr("data-role", "header");

    $("<h3>Mobilizm</h3>").appendTo($divheader);

    $divcontent = $('<div />').appendTo($page);
    $divcontent.attr("data-role", "content");

    $divfooter = $('<div />').appendTo($page);
    $divfooter.attr("data-role", "footer");
    $divfooter.attr("data-position", "fixed");

    $navbar = $('<div />').appendTo($divfooter);
    $navbar.attr("data-role", "navbar");
    $navbar.attr("data-iconpos", "top");

    $ul = $('<ul />').appendTo($navbar);
    debugger;
    var typesArray = new Array();
    var myType = new Object();                
    myType.FirstName = "polat";
    myType.LastName = "aydın"; 
    myType.EMailAddress1 = "polattt@gmail.com";
    myType.MobilePhone = "05353858028";
    typesArray.push(myType);

    $.support.cors = true;
    $.ajax({

        type: "GET",
        contentType: "application/json;charset=utf-8",
        datatype: "json",
        url: "http://10.0.11.134:5556/Mobile/MobilizmService.svc/CreateCustomer",
        async: false,
        data: { customers: JSON.stringify(typesArray), origin: 167440003, status: 167440001 },
        cache: false,
        processData: true,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function (data) {//On Successfull service call      
            returnval = data.d;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            returnval = null;
        }
    });

    //var mylist = ajaxrequest("http://10.0.11.134:5556/Mobile/MobilizmService.svc/GetMenus", false, false);
    if (mylist != null) {
        for (var i = 0; i < mylist.length; i++) {
            $li = $('<li />').appendTo($ul);
            $a = $('<a />').appendTo($li);

            $a.attr("href", "#");
            $a.attr("data-icon", "delete");
            $a.addClass("ui-btn-active");
            $a.text(mylist[i].Label);
        }
    }

});


function ajaxrequest(url, async, cache) {
    var returnval;
    $.support.cors = true;
    $.ajax({

        type: "GET",
        contentType: "application/json;charset=utf-8",
        datatype: "json",
        url: url,
        async: async,
        cache: cache,
        processData: true,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function (data) {//On Successfull service call      
            returnval = data.d;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            returnval = null;
        }
    });
    return returnval;
}