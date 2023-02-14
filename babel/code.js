const year = 2023;
const yearStr = '年';
const monthStr = '月';
const fun = (limit) => {
	for (let i = 0; i < limit; i++) {
    const str = `${year}${yearStr}${limit - 1}${monthStr}`;
    console.log(str)
  }
}
fun(12);