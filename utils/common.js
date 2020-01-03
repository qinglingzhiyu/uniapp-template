//接口地址	
const interfaceUrl = () => {

	// return "https://mallapi.1chex.com"; // 生产环境
	return "https://1chex.eicp.vip/b"; // 测试环境
	// return "http://192.168.1.131:8866" // wangtian
	// return "http://192.168.1.219:8866" // 张佳玉
},

// 小程序 appid : 原始ID
const originIDMap = {
	wx478c74d348859b45: 'gh_4b8ae4f23e5f', // 一车独秀
	wxc09b6f8459436eb5: 'gh_1fe8211b7a8d', // 一车独秀步步换
	wx092776e02ebf899c: 'gh_1f1479dc0656', // 一车独秀商城
}

const common = {
	interface: interfaceUrl(), 	// 域名
	miniProgramType: 0, //微信小程序版本类型，可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0
	originIDMap
}

export default common
