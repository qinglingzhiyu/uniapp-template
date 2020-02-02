import url from '../url';
import { request } from '@/utils/request'

const login_api = {
	// 验证码
	sendSms: async postData => await request({ url: url.sendSms, postData }),
	
}

export default login_api