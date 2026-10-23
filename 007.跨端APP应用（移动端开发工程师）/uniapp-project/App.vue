<script>
export default {
	onLaunch: function() {
		console.log('App Launch')
		// 检查登录状态
		const token = uni.getStorageSync('token')
		if (!token) {
			uni.reLaunch({
				url: '/pages/login/login'
			})
		}
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	},
	globalData: {
		userInfo: null,
		API_BASE: 'http://119.45.94.26:88/'
	}
}
</script>

<style>
	/* 通用样式 */
	page {
		font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background-color: #FFF9F5;
		color: #2D2D2D;
		font-size: 14px;
	}

	/* 粉色主题变量 */
	:root {
		--primary: #FFB7C5;
		--primary-dark: #FF8FA3;
		--income: #7DD3C0;
		--expense: #FFA09B;
		--accent: #C9B8E8;
		--bg-cream: #FFF9F5;
	}

	/* 悬浮按钮定位 */
	.fab-button {
		position: fixed;
		bottom: 70px;
		z-index: 99;
	}
</style>