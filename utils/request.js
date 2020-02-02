import common from '@/utils/common'
import tui from '@/utils/tui'

const contentTypeMap = {
	GET: 'application/x-www-form-urlencoded',
	POST: 'application/json'
}

// 获取本地的token 
const getToken = () => uni.getStorageSync("token") || ''

// 接口请求
const request = ({url = '', postData = {}, method = 'GET', hideLoading = false, isSpecJson = false, isToken = false}) => {
	if (!hideLoading) {
		uni.showLoading({
			mask: true,
			title: '请稍候...'
		})
	}
	return new Promise ((resolve, reject) => {
		uni.request({
			url: `${common.interface}${url}`,
			data: postData,
			header: {
				'content-type': isSpecJson ? 'application/x-www-form-urlencoded' : contentTypeMap[method.toLocaleUpperCase()],
				'Authorization': isToken ? getToken() : '',
				// #ifdef APP-PLUS
				'loginType': 'APP',
				// #endif
				// #ifdef MP-WEIXIN
				'loginType': 'MP_WECHAT',
				// #endif
				// #ifdef MP-ALIPAY
				'loginType': 'MP_ALIPAY',
				// #endif
				// #ifdef MP-BAIDU
				'loginType': 'MP_BAIDU',
				// #endif
				// #ifdef MP-QQ
				'loginType': 'MP_QQ',
				// #endif
				// #ifdef H5
				'loginType': 'H5',
				// #endif
			},
			method, //'GET','POST'
			dataType: 'json',
			success: (res) => {
				resolve(res.data)
			},
			fail: (err) => {
				tui.toast("操作过于频繁,请重试")
				reject(err)
			},
			complete: () => {
				!hideLoading && uni.hideLoading()
			}
		})
	})
}

// 上传图片
const uploadFile = src => {
	uni.showLoading({
		title: '请稍候...'
	})
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url:  `${common.interface}/v1/image/upload`,
			filePath: src,
			name: 'file',
			header: {
				'Authorization': getToken()
			},
			formData: {},
			success: (res) => {
				let d = JSON.parse(res.data)
				if (d.status === 200) {
					//文件上传成功后把图片路径数据提交到服务器，数据提交成功后，再进行下张图片的上传
					resolve(d.body.qiNiuPutRet)
				} else {
					tui.toast(d.message);
				}
			},
			fail: err => {
				reject(err)
				tui.toast(err.message);
			},
			complete: () => {
				uni.hideLoading()
			}
		})
	})
}

export { request,  uploadFile }