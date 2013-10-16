﻿//burada document ready'e attach olunmasının sebebi wijmo grid'in pageinit eventinde bind edememesi.
//mobil ortamda document ready tavsıye edılmıyor ama burada grid plugini kullanıdığından dolayı bu eventte yapılması gerekir.
//diğer sayfalarda pageinit eventıne attach olundugunu goreceksınız.
$(document).ready(function () {
    debugger;
    //we pass type parameter from Reservation.html to know which rezervation will be listed.
    var querystring = getUrlVars(decodeURIComponent(window.location.href));
    type = querystring["type"];



    /*#region GetReservation Information and create table*/
    $.ajax({

        type: "GET",
        contentType: "application/json;charset=utf-8",
        datatype: "json",
        url: "http://212.109.96.121:5556/Mobile/MobilizmService.svc/GetRezervations",
        async: false,
        data: { type: type, ContactId: localStorage.getItem("userguid") },
        cache: false,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function (data) {//On Successfull service call   

            if (data.d.length > 0) {
                var $thead = $('<thead />').appendTo($("#listtable"));
                var $tr = $('<tr />').appendTo($thead);
                var columns = ["Ad", "Rez. Başlangıç Tar.", "Rez. Bitiş Tar."];
                for (var i = 0; i < columns.length; i++) {
                    var $th = $('<th />').appendTo($tr);
                    $th.text(columns[i]);
                }
                var $tbody = $('<tbody />').appendTo($("#listtable"));
                for (var i = 0; i < data.d.length; i++) {
                    var $trr = $('<tr />').appendTo($tbody);
                    var $td = $('<td />').appendTo($trr);
                    $td.text(data.d[i].Subject);
                    var $td1 = $('<td />').appendTo($trr);
                    $td1.text(data.d[i].ScheduledStart);
                    var $td2 = $('<td />').appendTo($trr);
                    $td2.text(data.d[i].ScheduledEnd);
                }
                $("#listtable").wijgrid(
                    {
                        allowPaging: true,
                        pageSize: 7
                    });
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });

    /*#endregion GetReservation Information and create table*/


    /*#region TouchStart and touchend events*/
    //bu event table üzerindeki row'a tıkladıgımızda renginin değişmesini bıraktıgımızda eski halıne donmesını saglar
    $(".mGrid tr").bind("touchstart", function (event) {
        $(".mGrid tr").each(function () {
            $(this).removeClass("active");
        });
        $(this).addClass("active");

    });

    $(".mGrid tr").bind("touchmove ", function (event) {
        $(".mGrid tr").removeClass("active");

    });
    /*#endregion TouchStart and touchend events*/

    $("#listtable tr").bind("click", function (event) {
      
        debugger;
        window.location = "EditReservation.html?type=" + type + "&Rezervation=" + $(this).find("td")[0].innerText;
    });
});
