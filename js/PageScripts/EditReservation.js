
$(document).bind("pageinit", function (event) {

    var querystring = getUrlVars(decodeURIComponent(window.location.href));
    type = querystring["type"];
    Reservation = querystring["Rezervation"];

    $("#startdate").scroller(TurkishMobiscrollLocalization);
    $("#enddate").scroller(TurkishMobiscrollLocalization);

    /*#region Enabling Disabling Functions*/
    $('#car').prop('disabled', true);
    $('#parkingpoint').prop('disabled', true);

    if (type == "Past") {
        $('#startdate').prop('disabled', true);
        $('#enddate').prop('disabled', true);
        $('#save').prop('disabled', true);

    }
    else if (type == "Present") {
        $('#startdate').prop('disabled', true);
    }
    /*#endregion Enabling Disabling Functions*/

    /*#region GetReservationInfo*/

    $.ajax({

        type: "GET",
        contentType: "application/json;charset=utf-8",
        datatype: "json",
        url: "http://212.109.96.121:5556/Mobile/MobilizmService.svc/GetOneRezervation",
        async: false,
        data: { ReservationNumber: Reservation },
        cache: false,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function (data) {//On Successfull service call   

            $("#startdate").val(data.d.ScheduledStart);
            $("#enddate").val(data.d.ScheduledEnd);
            $("#car").val(data.d.Car);
            $("#parkingpoint").val(data.d.ParkingPoint);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
    /*#endregion GetReservationInfo*/
});