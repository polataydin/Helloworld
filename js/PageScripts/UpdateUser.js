$(document).bind("pageinit", function (event) {
    
    var x = $("#birthdate").scroller(TurkishMobiscrollLocalizationWithoutTime);
    /*#region Get UserInfo And Push it to the local storage*/
    //cache atılmamasının sebebi kullanıcı update ettikten sonra resfresh ettiğinde eski halini gösterir.
    //o yüzden her onloadda güncel bilgiyi almak gerekir
         $.ajax({

            type: "GET",
            contentType: "application/json;charset=utf-8",
            datatype: "json",
            url: "http://212.109.96.121:5556/Mobile/MobilizmService.svc/GetCustomerInformation",
            async: false,
            data: { email : JSON.stringify( localStorage.getItem("user") ) },
            cache: false,
            processData: true,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data) {//On Successfull service call   
                if (data.d.length > 0) {
                     $("#tckn").val(data.d[0].GovernmentId);
                    $("#name").val(data.d[0].FirstName);
                    $("#surname").val(data.d[0].LastName);
                    $("#mobilephone").val(data.d[0].MobilePhone);
                    $("#birthdate").val(data.d[0].BirthDate == null ? "" : Formatting( ChangeWcfDateTime(data.d[0].BirthDate) ));
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });

    /*#endregion Get UserInfo And Push it to the local storage*/

    /*#region Save Button click*/
    $("#save").click(function (e) {
        var CustomerInfo = {

            FirstName: $("#name").val(),
            LastName: $("#surname").val(),
            GovernmentId: $("#tckn").val(),
            MobilePhone: $("#mobilephone").val(),
            BirthDate: dateWithoutTimeToWcf($("#birthdate").val().replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1'))
            
        };

        $.support.cors = true;
        $.ajax({

            type: "GET",
            contentType: "application/json;charset=utf-8",
            datatype: "json",
            url: "http://212.109.96.121:5556/Mobile/MobilizmService.svc/UpdateCustomerInformation",
            async: true,
            data: { CustomerInformation: JSON.stringify(CustomerInfo), Id: localStorage.getItem("userguid") },
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
                alert("Bilgileriniz güncellenmiştir");
                $('body').unblock();

                e.stopImmediatePropagation();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('body').unblock();
                alert(XMLHttpRequest.responseJSON.Message);
                e.stopImmediatePropagation();
            }
        });
        
    });
    /*#endregion Save Button click*/
})
