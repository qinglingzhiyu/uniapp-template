import url from '../url';
import { request } from '@/utils/request'

const login_api = {
	// 登录
	login: async postData => await tui.request({ url: url.login, postData })
}

export default login_api
