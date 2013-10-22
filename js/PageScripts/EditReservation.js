
$(document).bind("pageinit", function (event) {

    var scheduledstartinit, scheduledendinit = null;
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

            if (type == "Future") {
                var d = new Date();

                var dateandtime = data.d.ScheduledStart.toString().split(" ");

                var datepart = dateandtime[0].split('.');
                var timepart = dateandtime[1].split(':');
                var scheduledstart = new Date(datepart[2], parseInt(datepart[1]) - 1, datepart[0], timepart[0], timepart[1], 0);
                scheduledstart = new Date(scheduledstart.getTime() + (-60) * 60000);
                if (d > scheduledstart) {
                    $('#startdate').prop('disabled', true);
                }

            }
            $("#startdate").val(data.d.ScheduledStart);
            $("#enddate").val(data.d.ScheduledEnd);
            $("#car").val(data.d.Car);
            $("#parkingpoint").val(data.d.ParkingPoint);

            scheduledstartinit = $('#startdate').val();
            scheduledendinit = $('#enddate').val();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
    /*#endregion GetReservationInfo*/

    /*#region Save Click*/
    $("#save").click(function (e) {
        if ($("#startdate").val() == scheduledstartinit && $("#enddate").val() == scheduledendinit) {
            alert("Başlangıç veya bitiş zamanını değiştirmediniz..");
            e.preventDefault();

            return false;
        }
        var starts, ends = null;
        if ($("#startdate").val() == scheduledstartinit) {
            starts = JSON.stringify(GeneraldateTimeToWcf(new Date(1970,0,1,0,0,0,0)));
        }
        else {
            starts = JSON.stringify(dateToWcf($("#startdate").val().replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')))
        }
        if ($("#endate").val() == scheduledendinit) {
            ends = JSON.stringify(GeneraldateTimeToWcf(new Date(1970, 0, 1, 0, 0, 0, 0)));;
        }
        else {
            ends = JSON.stringify(dateToWcf($("#enddate").val().replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')))
        }
        $.support.cors = true;
        $.ajax({

            type: "GET",
            contentType: "application/json;charset=utf-8",
            datatype: "json",
            url: "http://212.109.96.121:5556/Mobile/MobilizmService.svc/ExtentRezervation",
            async: true,
            data: { ReservationNumber: Reservation, ScheduledStart: starts, ScheduledEnd: ends },
            cache: false,
            processData: true,
            beforeSend: function (XMLHttpRequest) {
                $.blockUI({
                    message: '<h4> İşleminiz yapılıyor...</h4>',
                    css: { border: '3px solid #a00' }
                });
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data) {//On Successfull service call  
                if (data.d != "") {
                    alert("İşleminiz yapılırken hata oluştu");
                }
                else {
                    alert("Rezervasyonunuz uzatılmıştır.");
                    window.location = "Reservationlist.html?type=" + type;
                }
                $('body').unblock();

                $.mobile.hidePageLoadingMsg();
                e.stopImmediatePropagation();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('body').unblock();
                alert(XMLHttpRequest.responseJSON.Message);
                e.stopImmediatePropagation();
            }
        });
    });
    /*#endregion Save Click*/
});