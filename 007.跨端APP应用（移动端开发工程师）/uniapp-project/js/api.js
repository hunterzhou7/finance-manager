// API服务
const API = {
	baseURL: 'http://119.45.94.26:88',

	// 请求封装
	request(url, method = 'GET', data = {}) {
		return new Promise((resolve, reject) => {
			const token = uni.getStorageSync('token')
			const header = {
				'Content-Type': 'application/json'
			}
			if (token) {
				header['Authorization'] = 'Bearer ' + token
			}

			console.log('API请求:', method, url, data)

			uni.request({
				url: this.baseURL + url,
				method,
				data,
				header,
				success: (res) => {
					console.log('API响应:', JSON.stringify(res.data))
					if (res.data.success) {
						resolve(res.data.data)
					} else {
						reject(res.data.message || '请求失败')
					}
				},
				fail: (err) => {
					reject(err.errMsg || '网络错误')
				}
			})
		})
	},

	// 登录
	login(username, password) {
		return this.request('/api/login', 'POST', { username, password })
	},

	// 注册
	register(username, password, nickname) {
		return this.request('/api/register', 'POST', { username, password, nickname })
	},

	// 验证Token
	verify() {
		return this.request('/api/verify', 'GET')
	},

	// 获取用户信息
	getUserInfo() {
		return this.request('/api/user', 'GET')
	},

	// 更新用户信息
	updateUserInfo(data) {
		return this.request('/api/user', 'PUT', data)
	},

	// 获取账户列表
	getAccounts() {
		return this.request('/api/accounts', 'GET')
	},

	// 添加账户
	addAccount(data) {
		return this.request('/api/accounts', 'POST', data)
	},

	// 更新账户
	updateAccount(id, data) {
		return this.request('/api/accounts/' + id, 'PUT', data)
	},

	// 删除账户
	deleteAccount(id) {
		return this.request('/api/accounts/' + id, 'DELETE')
	},

	// 获取分类列表
	getCategories(type) {
		let url = '/api/categories'
		if (type) url += '?type=' + type
		return this.request(url, 'GET')
	},

	// 添加分类
	addCategory(data) {
		return this.request('/api/categories', 'POST', data)
	},

	// 更新分类
	updateCategory(id, data) {
		return this.request('/api/categories/' + id, 'PUT', data)
	},

	// 删除分类
	deleteCategory(id) {
		return this.request('/api/categories/' + id, 'DELETE')
	},

	// 获取首页数据
	getHomeData(year, month) {
		let url = '/api/home'
		if (year || month) {
			url += '?'
			if (year) url += 'year=' + year
			if (month) url += '&month=' + month
		}
		return this.request(url, 'GET')
	},

	// 获取统计数据
	getStatistics(year) {
		let url = '/api/statistics'
		if (year) url += '?year=' + year
		return this.request(url, 'GET')
	},

	// 获取交易记录
	getTransactions(page = 1, pageSize = 20, type, month) {
		let url = '/api/transactions?page=' + page + '&pageSize=' + pageSize
		if (type) url += '&type=' + type
		if (month) url += '&month=' + month
		return this.request(url, 'GET')
	},

	// 添加交易记录
	addTransaction(data) {
		return this.request('/api/transactions', 'POST', data)
	},

	// 删除交易记录
	deleteTransaction(id) {
		return this.request('/api/transactions/' + id, 'DELETE')
	},

	// 获取账户类型
	getAccountTypes() {
		return this.request('/api/account-types', 'GET')
	},

	// 获取分类类型
	getCategoryTypes() {
		return this.request('/api/category-types', 'GET')
	}
}

export default API