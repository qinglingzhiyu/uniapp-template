import Vue from 'vue'

Vue.filter('NumberFormat', function(value, isRMB = 'false') {
	if (!value) return '0'
	const [int, decimal] = value.toString().split('.')
	const intPartFormat = int.replace(/(\d)(?=(\d{3})+$)/g, '$1,') // 将整数部分逢三一断
	if (isRMB && decimal) return `￥ ${intPartFormat}.${decimal}`
	else if (!isRMB && decimal) return `${intPartFormat}.${decimal}`
	else if (isRMB && !decimal) return `￥ ${intPartFormat}`
	else return `${intPartFormat}`
})

Vue.filter('Stringify', function(obj) {
	return JSON.stringify(obj)
})

Vue.filter('rmoney', function(money) {
	if (!money) return '0.00'
	//金额格式化
	return parseFloat(money).toFixed(2).toString().split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(
		/\,$/, '').split('').reverse().join('');
})

Vue.filter('rmoneyByArray', function(money, index) {
	if (!money && !index) return '0'
	if (!money && index) return '00'
	const result = parseFloat(money).toFixed(2).toString().split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(/\,$/, '').split('').reverse().join('').split('.')
	return result[index]
})

Vue.filter('rateFilter', function(star, index) {
	const result = String(star).split('.')
	if(result.length === 0) return 0
	else if (result.length === 1) return index === 1? 0: Number(result[0])
	return index === 0? Number(result[0]) : `0.${Number(result[1])}`
})

// 格式化数字为W(万)单位
Vue.filter('numberFormatFilter',function (e) {
	return e > 10000 ? (e / 10000) + 'W' : e
});
