var year = 2023;
var yearStr = '年';
var monthStr = '月';
var fun = (limit) => {
for (var i = 0; i < limit; i++) {
var str = ''.concat(year).concat(yearStr).concat(limit - 1).concat(monthStr);
console.log(str);
}
};
fun(12);