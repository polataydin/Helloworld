var lng, lat = null;
var markers = [];
var info_window = new google.maps.InfoWindow();

$(document).bind("pageinit", function (event) {

    var options = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };

    $("#startdate").scroller(TurkishMobiscrollLocalization);
    $("#enddate").scroller(TurkishMobiscrollLocalization);

    $("#citylookup").hide();
    $("#parkinglookup").css("visibility", "hidden");

    $('#citytext').click(function (e) {

        $("#citylookup").click();

        e.stopImmediatePropagation();
    });
    $('#parkingtext').click(function (e) {

        $("#parkinglookup").click();
        e.stopImmediatePropagation();
    });



});


