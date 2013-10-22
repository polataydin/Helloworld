var querystring = getUrlVars(decodeURIComponent(window.location.href));
type = querystring["type"];
var rezervations = [];
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
            rezervations = data.d;
        }

    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {

    }

});

//ui.jqgridmobile.css
//line 55 override edildi.
jQuery('#grid').jqGrid({
    defaults : {
        emptyrecords: "No records to view",
    },
    hoverrows: false,
    "viewrecords": true,
    "jsonReader": { "repeatitems": false, "subgrid": { "repeatitems": false } },
    datatype: "local",
    data: rezervations,
    loadonce: true,
    shrinkToFit: false,
    gridview: true,
    "rowNum": 5,
    "height": 200,
    "autowidth": true,
    "sortname": "Subject",
    "rowList": [7, 10],
    colNames: ['Rezervasyon', 'Başlangıç', 'Bitiş'],
    colModel: [
        { name: 'Subject', index: 'Subject', key: true, },
        { name: "ScheduledStart", "index": "ScheduledStart", "sorttype": "datetime", "formatter": "date", "formatoptions": { srcformat: 'd-m-Y H:i', newformat: 'n/j/Y H:i' } },
        { name: "ScheduledEnd", "index": "ScheduledEnd", "sorttype": "datetime", "formatter": "date", "formatoptions": { srcformat: 'd-m-Y H:i', newformat: 'n/j/Y H:i' } },
    ],

    "scrollPaging": true,
    onSelectRow: function (id) {
        window.location = "EditReservation.html?type=" + type + "&Rezervation=" + id;
    },
    "loadError": function (xhr, status, err) {
        try {

            jQuery.jgrid.info_dialog(jQuery.jgrid.errors.errcap, '<div class="ui-state-error">' + xhr.responseText + '</div>', jQuery.jgrid.edit.bClose,
            { buttonalign: 'right' });
        } catch (e) {
            alert(xhr.responseText);
        }
    },
    "pager": "#pager",
 
});




