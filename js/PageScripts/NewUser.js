
$(document).bind("pageinit", function (event) {

    $('#save').click(function () {
        var typesArray = new Array();
        var myType = new Object();
        myType.FirstName = $("#name").val();
        myType.LastName = $("#surname").val();
        myType.EMailAddress1 = $("#email").val();
        myType.MobilePhone = $("#cellphone").val();
        typesArray.push(myType);

        $.support.cors = true;
        $.ajax({

            type: "GET",
            contentType: "application/json;charset=utf-8",
            datatype: "json",
            url: "http://212.109.96.121:5556/Mobile/MobilizmService.svc/CreateCustomer",
            async: false,
            data: { customers: JSON.stringify(typesArray), origin: 167440003, status: 167440000 },
            cache: false,
            processData: true,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data) {//On Successfull service call      
                alert("Kaydınız alınmıştır");
                window.location.href = "../Index.html";

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("işlem yapılırken hata oluştu");
            }
        });


    });

});