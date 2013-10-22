$(document).bind("pageinit", function () {
    //attach ajax start and end events
    $("#myhref").css("visibility", "hidden");
    if (localStorage.getItem("user") != null) {
        window.location.href = $("#myhref").attr("href");
    };

    $('#save').on("click", function (event) {

        $.ajax({

            type: "GET",
            contentType: "application/json;charset=utf-8",
            datatype: "json",
            url: "http://212.109.96.121:5556/Mobile/MobilizmService.svc/Login",
            async: true,
            data: { Email: $("#username").val(), Password: $("#password").val() },
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
                $('body').unblock();
                if (data.d[0] == true) {
                    localStorage.setItem("user", $("#username").val());
                    localStorage.setItem("userguid", data.d[1]);
                    window.location.href = $("#myhref").attr("href");
                }
                else {
                    alert(data.d[1]);
                    event.stopPropagation();
                    event.preventDefault();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('body').unblock();
                alert(XMLHttpRequest.responseJSON.Message);
                event.stopPropagation();
                event.preventDefault();
            }
        });

    });
});