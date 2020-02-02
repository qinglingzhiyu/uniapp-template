//接口地址	
const interfaceUrl = () => {

	return "https://mallapi.1chex.com"; // 生产环境
	// return "https://1chex.eicp.vip/b"; // 测试环境
	// return "http://192.168.1.131:8866" // wangtian
	// return "http://192.168.1.219:8866" // 张佳玉
}

const weChatMap = { // originID 指原始id
	wx478c74d348859b45: { // 一车独秀
		originID: 'gh_4b8ae4f23e5f',
		classifyUrl: 'https://qiniu.1chex.com/f54640d5-ca72-4f95-b4a4-0fc2407e62c7.png?e=3155179499126&token=aW1VHuq3y2Xr5-kypNWSzT-2rr8frO-HB_103tWL:edcaiOl1S-JxkT2gABzCUN_A4C4='
	},
	wxc09b6f8459436eb5: { // 一车独秀步步换
		originID: 'gh_1fe8211b7a8d',
		classifyUrl: 'https://qiniu.1chex.com/b7c5beab-b193-4e7f-ae94-46eb2d69fa62.png?e=3155179499141&token=aW1VHuq3y2Xr5-kypNWSzT-2rr8frO-HB_103tWL:V1c20fOHJBwnu5zRoLE8C_EqPiI='
	},
	wx092776e02ebf899c: { // 一车独秀商城
		originID: 'gh_1f1479dc0656',
		classifyUrl: 'https://qiniu.1chex.com/e2e9110e-a772-4e87-a44b-e9402435dc1d.png?e=3155179499157&token=aW1VHuq3y2Xr5-kypNWSzT-2rr8frO-HB_103tWL:mCEMUoxABTJpwyZjRAaPn3E3Gpc='
	}
}

const common = {
	interface: interfaceUrl(), 	// 域名
	miniProgramType: 0, //微信小程序版本类型，可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0
	weChatMap,
}

export default common
