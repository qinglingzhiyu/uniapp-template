import index_api from '@/api/modules/index'

const tui = {
	// 封装toast 弹窗
	toast: (title, duration = 2000, success = false) => {
		uni.showToast({
			title,
			duration,
			icon: success ? 'success' : 'none'
		})
	},
	
	// 是否在微信
	isInWeiXin: () => navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1,
	
	// 判断是否是不为空数组
	isNotEmptyArray: value => value && Object.prototype.toString.call(value) == '[object Array]' && value.length > 0 ? true: false,
	
	// 判断是否是不为空字符串
	isNotEmptyString: value => value && typeof(value) !== 'undefined' && value !== 'undefined' && value !== 'null' ? true : false,
	
	// 判断是否是小数
	isFloat: value => /^([0-9]*[.]?[0-9])[0-9]{0,1}$/.test(value),
	
	// 判断是否是全为数字
	isAllNum: value => /^[0-9]+$/.test(value),
	
	// 密码为8~20位数字和字母组合
	checkPwd: value => /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(value),
	
	// 去空格
	trim: value => value.replace(/(^\s*)|(\s*$)/g, ""),
	
	// 是否为手机号
	isMobile: value => /^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(value),
	
	//格式化手机号码
	formatNum: num => this.isMobile(num) ? num.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') : num,
	
	// 是否是身份证号
	isIDCard: ID => /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(ID),
	
	//  金额格式化
	rmoney: money => {
		if (!money) return '0.00'
		return parseFloat(money).toFixed(2).toString().split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(/\,$/, '').split('').reverse().join('');
	},
	
	// rpx 转px
	px: num => uni.upx2px(num) + 'px',
	
	// 获取当前位置
	getLocation: function(type, geocode) {
		return new Promise((resolve, reject) => {
			uni.getLocation({
				type: type,
				geocode: geocode,
				success: (res) => {
					resolve(res)
				},
				fail: (res) => {
					reject(res)
				}
			});
		})
	},

	// 睡眠
	sleep: ms => {
		return new Promise(resolve => {
			const timer = setTimeout( () => {
				clearTimeout(timer)
				resolve()
			}, ms)
		})
	},
	
	isHighForCurrentVersion: (ver,currentVer) => {
		var verArr = ver.split(".");
		var curArr = currentVer.split(".");
		var result = false
		var minL = Math.min(verArr.length, curArr.length)
		for(let i=0;i < minL; i++){
			if(curArr[i] < verArr[i]){
				result = true;
				break;
			}else if(curArr[i] > verArr[i]){
				result = false;
				break;
			}else{
				
			}
		}
		return result;
	},
	
	//日期格式化
	formatDate: function(formatStr = 'y-m-d h:i:s', fdate = '') {
		if (~fdate.indexOf('.')) {
			fdate = fdate.substring(0, fdate.indexOf('.'));
		}
		var fStr = 'ymdhis';
		fdate = fdate.toString().replace('T', ' ').replace(/\-/g, '/');
		let fTime = fdate ? new Date(fdate) : new Date();
		var month = fTime.getMonth() + 1;
		var day = fTime.getDate();
		var hours = fTime.getHours();
		var minu = fTime.getMinutes();
		var second = fTime.getSeconds();
		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		hours = hours < 10 ? ('0' + hours) : hours;
		minu = minu < 10 ? '0' + minu : minu;
		second = second < 10 ? '0' + second : second;
		var formatArr = [
			fTime.getFullYear().toString(),
			month.toString(),
			day.toString(),
			hours.toString(),
			minu.toString(),
			second.toString()
		]
		for (var i = 0; i < formatArr.length; i++) {
			formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
		}
		return formatStr;
	},
	
	// 深拷贝
	deepCopy: (obj) => {
		var result = Array.isArray(obj) ? [] : {};
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (typeof obj[key] === 'object' && obj[key] !== null) {
					result[key] = utils.deepCopy(obj[key]); //递归复制
				} else {
					result[key] = obj[key];
				}
			}
		}
		return result;
	},
	
	/**
	 *  将一维数组根据属性值相同 转为2维数组
	 * 	arr 数组
	 *  ym 要比较的属性
	 */
	trans: (arr, ym) => {
		let cache = {}
		return arr.reduce((sum, cur) => {
			let index = cache[cur[ym]]
			if (index !== undefined) {
				sum[index].push(cur)
			} else {
				sum.push([cur])
				cache[cur[ym]] = sum.length - 1
			}
			return sum
		}, [])
	},
	
	oneOf: (value, validList) => {
		for (let i = 0; i < validList.length; i++) {
		  if (value === validList[i]) {
			return true;
		  }
		}
		throw new Error('mode无效，请选择有效的mode!');
		return false;
	},

	// 判断页面是否登录 仅在微信小程序有效
	isAuthByOtherPages: async (fn) => {
		try {
			const [err, res] = await uni.getStorage({
				key: 'isAuth'
			})
			if (res.data) {
				return true
			}
			return false
		} catch (error) {
			return false
		}
	},

	// 小程序 先获取token后执行其他方法
	executeFnByToken: async (payload, fn) => {
		// #ifdef MP-WEIXIN
		const [ err, res ] = await uni.login()
		if (err || res.errMsg !== 'login:ok') return this.tui.toast('操作过于频繁,请重试')
		const result = await mpAuthToken({
			code: res.code,
			superiorUserId: payload.superiorUserId
		});
		uni.setStorageSync("token", result.body.token);
		uni.setStorageSync("isAuth", result.body.isAuth)
		fn()
		// #endif

		// #ifdef MP-ALIPAY
		let alipayAuthResult = await uni.login();
		if (alipayAuthResult[1]) {
			let alipayAuthTokenResult = await alipayAuthToken({
				code: alipayAuthResult[1].code
			});
			
			if (!alipayAuthTokenResult.body.token) {
				uni.reLaunch({
					url: "/pages/login/login"
				});
				return;
			} else {
				uni.setStorageSync("token", alipayAuthTokenResult.body.token);
				fn()
			}
		} else return this.tui.toast('操作过于频繁,请重试')
		// #endif
		
		fn()
	},
};
export default tui;