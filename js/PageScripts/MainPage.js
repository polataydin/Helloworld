var lng, lat = null;
var markers = [];
var info_window = new google.maps.InfoWindow();

$(document).bind("pageinit", function (event) {

    //if (localStorage.getItem("userguid") == null) {
    //    alert("Login hatası oluştu , lütfen uygulamınızın cache değerlerini siliniz.");
    //    event.stopImmediatePropagation();
    //    return;
    //}

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successonload);
    }
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

$(document).delegate('#dialog1', 'pagebeforeshow', function (event) {
    var lookuparray = [];
    var integer = 0;
    var count = null;
    /*#region Get Cities And Push it to the local storage*/
    if (localStorage["cities"] == null || JSON.parse(localStorage["cities"]).length == 0) {

        $("#citylist").empty();
        while (true) {

            $.ajax({

                type: "GET",
                contentType: "application/json;charset=utf-8",
                datatype: "json",
                url: "http://212.109.96.121:5556/Mobile/MobilizmService.svc/GetEquipments",
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

                            var $li = $('<li />').appendTo($("#citylist"));

                            var $a = $('<a />').appendTo($li);
                            $a.attr("href", "#");
                            $a.addClass("clickhref");
                            $a.text(data.d[i].Name);
                            $("#citylist").listview('refresh');

                            //lookupobject must Name And Guid Standart
                            var lookup = {};
                            lookup.Name = data.d[i].Name;
                            lookup.Guid = data.d[i].Guid;
                            lookuparray.push(lookup);
                        }
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                }
            });
            if (count == 0 || count == null) {
                localStorage["cities"] = JSON.stringify(lookuparray);
                break;

            }
        }

    }
    else {

        var storeditems = JSON.parse(localStorage["cities"]);
        $("#citylist").empty();
        for (var i = 0; i < storeditems.length; i++) {

            var $li = $('<li />').appendTo($("#citylist"));

            var $a = $('<a />').appendTo($li);
            $a.attr("href", "#");
            $a.addClass("clickhref");
            $a.text(storeditems[i].Name);
            $('#citylist').listview('refresh');
        }
    }
    /*#endregion Get Cities And Push it to the local storage*/

    $('.clickhref').click(function () {
        $("#citytext").val($(this)[0].innerText);
        $("#dialog1").dialog("close");
    });
});
$(document).delegate('#dialog2', 'pagebeforeshow', function (event) {

    var lookuparray = [];
    var integer = 0;
    var count = null;
    /*#region Get ParkingPoint And Push it to the local storage*/
    if (localStorage["parkings"] == null || JSON.parse(localStorage["parkings"]).length == 0) {

        $("#parkinglist").empty();
        while (true) {

            $.ajax({

                type: "GET",
                contentType: "application/json;charset=utf-8",
                datatype: "json",
                url: "http://212.109.96.121:5556/Mobile/MobilizmService.svc/GetParkingInformations",
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

                            var $li = $('<li />').appendTo($("#parkinglist"));

                            var $a = $('<a />').appendTo($li);
                            $a.attr("href", "#");
                            $a.addClass("clickhrefparking");
                            $a.text(data.d[i].Name);
                            $("#parkinglist").listview('refresh');

                            //lookupobject must Name And Guid Standart
                            var lookup = {};
                            lookup.Name = data.d[i].Name;
                            lookup.Guid = data.d[i].Guid;
                            lookup.Latitude = data.d[i].Latitude.toString().replace(',', '.');
                            lookup.Longtitude = data.d[i].Longtitude.toString().replace(',', '.')
                            //we fill the array after we want to create record , we find the selected item guid into this array 
                            lookuparray.push(lookup);
                        }
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                }
            });
            if (count == 0 || count == null) {
                localStorage["parkings"] = JSON.stringify(lookuparray);
                break;

            }
        }

    }
    else {

        var storeditems = JSON.parse(localStorage["parkings"]);
        $("#parkinglist").empty();
        for (var i = 0; i < storeditems.length; i++) {

            var $li = $('<li />').appendTo($("#parkinglist"));

            var $a = $('<a />').appendTo($li);
            $a.attr("href", "#");
            $a.addClass("clickhrefparking");
            $a.text(storeditems[i].Name);
            $("#parkinglist").listview('refresh');
        }
    }
    /*#endregion Get ParkingPoint And Push it to the local storage*/

    $('.clickhrefparking').click(function () {
        $("#parkingtext").val($(this)[0].innerText);
        $("#dialog2").dialog("close");
    });
});


$(document).delegate('#dialog3', 'pageshow', function (event) {
    debugger;
    var lookuparray = [];
    var service;
    var latlng = new google.maps.LatLng(lat, lng);
    var myOptions = {
        zoom: 12,
        center: latlng,
        mapTypeControl: false,
        navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var mapcanvas = $('#mapcanvas');
    var map = new google.maps.Map(mapcanvas[0], myOptions);
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: "You are Here"
    });

    google.maps.event.addListener(marker, 'click', function () {

        $("#hrefs").click();
    });
    google.maps.event.trigger(map, 'resize');
    // adding alll markers
    var int = 0;
    var count = null;
    if (localStorage["parkings"] == null || JSON.parse(localStorage["parkings"]).length == 0) {
        while (true) {
            $.ajax({

                type: "GET",
                contentType: "application/json;charset=utf-8",
                datatype: "json",
                url: "http://212.109.96.121:5556/Mobile/MobilizmService.svc/GetParkingInformations",
                async: false,
                data: { page: int },
                cache: false,
                processData: true,
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                },
                success: function (data) {//On Successfull service call   
                    int = parseInt(int) + 1;
                    count = data.d.length;
                    if (data.d.length > 0) {
                        for (var i = 0; i < data.d.length; i++) {
                            var lookup = {};
                            lookup.Name = data.d[i].Name;
                            lookup.Guid = data.d[i].Guid;
                            lookup.Latitude = data.d[i].Latitude.toString().replace(',', '.');
                            lookup.Longtitude = data.d[i].Longtitude.toString().replace(',', '.')
                            //we fill the array after we want to create record , we find the selected item guid into this array 
                            lookuparray.push(lookup);
                        }
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                }
            });

            if (count == 0 || count == null) {
                if (localStorage["parkings"] ==undefined  || JSON.parse(localStorage["parkings"]).length == 0) {
                    localStorage["parkings"] = JSON.stringify(lookuparray);
                }
                break;

            }
        }
    }

    var storeditems = JSON.parse(localStorage["parkings"]);

    for (var i = 0; i < storeditems.length; i++) {
        var mylatlng = new google.maps.LatLng(lat, lng);
        var latlng = new google.maps.LatLng(parseFloat(storeditems[i].Latitude.toString().replace(',', '.')), parseFloat(storeditems[i].Longtitude.toString().replace(',', '.')));

        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
        });
        //calculating two distance by kilometer
        var x = google.maps.geometry.spherical.computeDistanceBetween(mylatlng, latlng) / 1000;


        var thisname = storeditems[i].Name;
        var infoWindowContent = [
                      '<b>' + thisname + '</b><br />',
                      '<span>You are ' + x.toFixed(2) + ' km away from your position</span>',
                      '<button onclick="setmap(\'' + thisname.toString() + '\')">\ Set</button>'
        ].join("");

        markers.push(marker);
        marker.set('contents', infoWindowContent);


        google.maps.event.addListener(marker, 'click', function () {

            var c = this.get('contents');
            info_window.setContent(c);
            info_window.open(map, this);
        });

    }

});

function successonload(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;

}



function setmap(name) {
    debugger;
    $("#parkingtext").val(name);
    $('#dialog3').dialog("close");
}
