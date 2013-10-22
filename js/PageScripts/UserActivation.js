var email = null;

$(document).bind("pageinit", function () {
    $('#newpasswordagain').textinput('disable');

    var querystring = getUrlVars(decodeURIComponent(window.location.href));
    email = querystring["email"];
    $.support.cors = true;
    $.ajax({

        type: "GET",
        contentType: "application/json;charset=utf-8",
        datatype: "json",
        url: "http://212.109.96.121:5556/Mobile/MobilizmService.svc/CheckCustomer",
        async: false,
        data: { email: email },
        cache: false,
        processData: true,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function (data) {//On Successfull service call      
            if (data.d == false) {
                $("body").empty();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $("body").empty();
            e.stopImmediatePropagation();
        }
    });

    $("#newwpassword").bind("change", function () {
        //reference "js/passy.js" 
        if ($.passy.valid($(this).val()) == false) {
            alert("Şifreniz en az 1 harf , en az 1 rakam içermeli , minimum 6 , maximum 12 harf olmalıdır");
            $(this).focus();
            return;
        }

        $('#newpasswordagain').textinput('enable');
    });
    //save click
    $('#save').click(function (event) {
        if ($("#newwpassword").val() != $("#newpasswordagain").val()) {
            alert("Girdiğiniz şifreler eşleşmiyor");
            return false;
        }

        $.support.cors = true;
        $.ajax({

            type: "GET",
            contentType: "application/json;charset=utf-8",
            datatype: "json",
            url: "http://212.109.96.121:5556/Mobile/MobilizmService.svc/UpdatePassword",
            async: false,
            data: { email: email, password: $("#newwpassword").val() },
            cache: false,
            processData: true,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data) {//On Successfull service call      
                alert("Şifreniz oluşturulmuştur");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("hata oluştu");
                $("body").empty();
                e.stopImmediatePropagation();
            }
        });
    });

});