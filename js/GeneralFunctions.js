
function dateToWcf(input) {
    debugger;
    if (input == null || input == undefined || input == "" || input == " ") {
        return;
    }

    var dateandtime = input.toString().split(" ");

    var datepart = dateandtime[0].split('/');
    var timepart = dateandtime[1].split(':');

    var d = new Date(datepart[2], parseInt(datepart[1]) - 1, datepart[0], timepart[0], timepart[1], 0);
    if (isNaN(d)) return null;
    return '\/Date(' + d.getTime() + '-0000)\/';
}

function dateWithoutTimeToWcf(input) {
   
    if (input == null || input == undefined || input == "" || input == " ") {
        return;
    }

    var dateandtime = input.toString().split(" ");

    var datepart = dateandtime[0].split('/');


    var d = new Date(datepart[2], parseInt(datepart[1]) - 1, datepart[0],0,0,0);
    if (isNaN(d)) return null;
    return '\/Date(' + d.getTime() + '-0000)\/';
}
function getUrlVars(url) {
    var vars = [], hash;
    var hashes = url.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function stripQueryStringAndHashFromPath(url) {
    return url.split("?")[0].split("#")[0];
}
//''
function ChangeWcfDateTime(ds) {
    var D, dtime, T, tz, off,
       dobj = ds.match(/(\d+)|([+-])|(\d{4})/g);
    T = parseInt(dobj[0]);
    tz = dobj[1];
    off = dobj[2];
    if (off) {
        off = (parseInt(off.substring(0, 2), 10) * 3600000) +
(parseInt(off.substring(2), 10) * 60000);
        if (tz == '-') off *= -1;
    }
    else off = 0;
    return new Date(T += off);
}

function Formatting(inputFormat) {
    var d = new Date(inputFormat);
    return [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/');
}