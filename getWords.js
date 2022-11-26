

var str = ""




function word() {
    var arr = text.value.match(/[\w\-]+/g) || [];
    console.log(arr);
    var k = {}, p = {};
    for (var i = 0; i < arr.length; i++) {
        var v = arr[i].toLowerCase();
        if (k[v]) {
            k[v]++;
        } else {
            k[v] = 1;
        }
    }
    function sortObj(obj) {
        var arr = [];
        for (var i in obj) {
            arr.push([obj[i],i]);
        };
        arr.sort(function (a,b) {
            return b[0] - a[0];
        });
        var len = arr.length,
            obj = {};
        for (var i = 0; i < len; i++) {
            obj[arr[i][1]] = arr[i][0];
        }
        return obj;
    }
    k = sortObj(k);


    // console.log(k);
}


