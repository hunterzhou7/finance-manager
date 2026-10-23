<template>
	<view class="container">
		<view class="content">
			<!-- 用户信息 -->
			<view class="user-card">
				<view class="user-avatar">
					<text>{{userInfo.nickname ? userInfo.nickname.charAt(0) : userInfo.username.charAt(0)}}</text>
				</view>
				<view class="user-info">
					<text class="user-name">{{userInfo.nickname || userInfo.username}}</text>
					<text class="user-date">注册于 {{formatDate(userInfo.created_at)}}</text>
				</view>
			</view>

			<!-- 菜单列表 -->
			<view class="menu-card">
				<view class="menu-item" @click="goToCategory">
					<text class="menu-label">分类管理</text>
					<text class="menu-arrow">›</text>
				</view>
				<view class="menu-item" @click="goToAccount">
					<text class="menu-label">账户管理</text>
					<text class="menu-arrow">›</text>
				</view>
			</view>

			<view class="menu-card">
				<view class="menu-item logout" @click="handleLogout">
					<text class="menu-label">退出登录</text>
				</view>
			</view>

			<!-- 版本信息 -->
			<view class="version">
				<text>财务管家 v1.0</text>
			</view>
		</view>

		<!-- 悬浮按钮 -->
		<view class="fab-button" @click="goToAdd">
			<text class="fab-icon">+</text>
		</view>
	</view>
</template>

<script>
import API from '../../js/api.js'

export default {
	data() {
		return {
			userInfo: {}
		}
	},
	onShow() {
		this.loadUserInfo()
	},
	methods: {
		loadUserInfo() {
			var that = this
			var stored = uni.getStorageSync('userInfo')
			if (stored) {
				this.userInfo = stored
			}
			API.getUserInfo().then(function(data) {
				if (data) {
					that.userInfo.created_at = data.created_at
				}
			}).catch(function(err) {
				console.error('获取用户信息失败:', err)
			})
		},
		formatDate(dateStr) {
			if (!dateStr) return ''
			var date = new Date(dateStr)
			var year = date.getFullYear()
			var month = date.getMonth() + 1
			var day = date.getDate()
			return year + '年' + month + '月' + day + '日'
		},
		goToCategory() {
			uni.navigateTo({
				url: '/pages/category/category'
			})
		},
		goToAccount() {
			uni.navigateTo({
				url: '/pages/account/account'
			})
		},
		goToAdd() {
			uni.navigateTo({
				url: '/pages/add/add'
			})
		},
		handleLogout() {
			uni.showModal({
				title: '确认退出',
				content: '确定要退出登录吗？',
				success: function(res) {
					if (res.confirm) {
						uni.removeStorageSync('token')
						uni.removeStorageSync('userInfo')
						uni.reLaunch({
							url: '/pages/login/login'
						})
					}
				}
			})
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #FFF9F5;
}

.content {
	padding: 20px;
	margin-top: -20px;
}

.user-card {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 16px;
	padding: 24px;
	margin-bottom: 16px;
	box-shadow: 0 4px 12px rgba(255, 183, 197, 0.15);
}

.user-avatar {
	width: 56px;
	height: 56px;
	background: linear-gradient(135deg, #FFB7C5 0%, #FF8FA3 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.user-avatar text {
	font-size: 24px;
	color: #fff;
}

.user-info {
	margin-left: 16px;
}

.user-name {
	font-size: 18px;
	font-weight: 600;
	color: #2D2D2D;
	display: block;
}

.user-id {
	font-size: 13px;
	color: #999;
	margin-top: 4px;
	display: block;
}

.user-date {
	font-size: 12px;
	color: #ccc;
	margin-top: 4px;
	display: block;
}

.menu-card {
	background: #fff;
	border-radius: 16px;
	margin-bottom: 16px;
	overflow: hidden;
	box-shadow: 0 4px 12px rgba(255, 183, 197, 0.15);
}

.menu-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px;
	border-bottom: 1px solid #EFEDED;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-label {
	font-size: 15px;
	color: #2D2D2D;
}

.menu-label.logout {
	color: #FF6B6B;
}

.menu-arrow {
	color: #ccc;
}

.version {
	text-align: center;
	color: #ccc;
	font-size: 12px;
	margin-top: 40px;
}

.fab-button {
	position: fixed;
	bottom: 0px;
	left: 50%;
	transform: translateX(-50%);
	width: 56px;
	height: 56px;
	background: linear-gradient(135deg, #FFB7C5 0%, #FF8FA3 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8px 20px rgba(255, 143, 163, 0.4);
	z-index: 100;
}

.fab-icon {
	font-size: 28px;
	color: #fff;
	font-weight: 300;
}
</style>