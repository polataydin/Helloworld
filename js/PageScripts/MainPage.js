var equipments, parkings = [];


$(document).bind("pageinit", function (event) {

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

    $('#save').click(function (e) {
       
        arr = jQuery.grep(parkings, function (n) {
            return (n.Name = $("#parkingtext").val());
        });
        res = jQuery.grep(equipments, function (n) {
            return (n.Name = $("#citytext").val());
        });

        //lookups
        var rezervationslookups = {

            trd_contactid: {
                Id: "B90A7E10-321A-E311-8BC6-00155D0B0611",
                ş: "contact"
            }

        };
        //optionsets
        var rezervationsoptionsets = {

            trd_reservationtype: {
                Value: 167440000
            }

        };
        //CrmFields
        var rezervations = {

            ScheduledStart: dateToWcf($("#startdate").val().replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')),
            ScheduledEnd: dateToWcf($("#enddate").val().replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1'))
        };

        $.support.cors = true;
        $.ajax({

            type: "GET",
            contentType: "application/json;charset=utf-8",
            datatype: "json",
            url: "http://212.109.96.121:5556/Mobile/MobilizmService.svc/CreateRezervation",
            async: false,
            data: { rezervations: JSON.stringify(rezervations), rezervationslookups: JSON.stringify(rezervationslookups), rezervationsoptionsets: JSON.stringify(rezervationsoptionsets), origin: 2, ParkingId: res[0].Guid },
            cache: false,
            processData: true,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data) {//On Successfull service call      
                alert("Kaydınız alınmıştır");
                e.stopImmediatePropagation();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("işlem yapılırken hata oluştu");
                e.stopImmediatePropagation();
            }
        });


    });
});
$(document).delegate('#dialog1', 'pagebeforeshow', function (event) {
    debugger;
    var obj = GetCrmData("http://212.109.96.121:5556/Mobile/MobilizmService.svc/GetEquipments", "citylist", "clickhref", "cities");
    equipments = JSON.parse(obj);
    $('.clickhref').click(function () {
        $("#citytext").val($(this)[0].innerText);
        $("#dialog1").dialog("close");
    });
});
$(document).delegate('#dialog2', 'pagebeforeshow', function (event) {
    debugger;
    var obj = GetCrmData("http://212.109.96.121:5556/Mobile/MobilizmService.svc/GetParkingPoints", "parkinglist", "clickhrefparking", "parkings");
    parkings = JSON.parse(obj);
    $('.clickhrefparking').click(function () {


        $("#parkingtext").val($(this)[0].innerText);
        $("#dialog2").dialog("close");
    });
});