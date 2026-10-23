<template>
	<view class="login-container">
		<view class="logo">
			<text class="logo-title">财务管家</text>
			<text class="logo-subtitle">个人财务管理应用</text>
		</view>

		<view class="form">
			<view class="input-wrapper">
				<input class="input-field" type="text" v-model="username" placeholder="请输入用户名" @focus="clearError" />
			</view>
			<view class="input-wrapper">
				<input class="input-field" type="password" v-model="password" placeholder="请输入密码" @focus="clearError" @confirm="handleLogin" />
			</view>

			<view class="error-message" v-if="errorMessage">
				<text>{{ errorMessage }}</text>
			</view>

			<button class="btn btn-primary" @click="handleLogin" :loading="loading">
				<text v-if="!loading">登录</text>
				<text v-else>登录中...</text>
			</button>

			<view class="register-link" @click="goToRegister">
				<text>还没有账号？立即注册</text>
			</view>
		</view>
	</view>
</template>

<script>
import API from '../../js/api.js'

export default {
	data() {
		return {
			username: '',
			password: '',
			errorMessage: '',
			loading: false
		}
	},
	methods: {
		clearError() {
			this.errorMessage = ''
		},
		async handleLogin() {
			if (!this.username) {
				this.errorMessage = '请输入用户名'
				return
			}
			if (!this.password) {
				this.errorMessage = '请输入密码'
				return
			}

			this.loading = true
			try {
				const data = await API.login(this.username, this.password)
				uni.setStorageSync('token', data.token)
				uni.setStorageSync('userInfo', {
					userId: data.userId,
					username: data.username,
					nickname: data.nickname
				})
				uni.reLaunch({
					url: '/pages/index/index'
				})
			} catch (err) {
				this.errorMessage = err
			} finally {
				this.loading = false
			}
		},
		goToRegister() {
			uni.navigateTo({
				url: '/pages/register/register'
			})
		}
	}
}
</script>

<style>
.login-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #FFB7C5 0%, #FF8FA3 50%, #C9B8E8 100%);
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 40px;
}

.logo {
	text-align: center;
	margin-bottom: 40px;
}

.logo-title {
	font-family: 'ZCOOL KuaiLe', cursive;
	font-size: 36px;
	color: #fff;
	display: block;
}

.logo-subtitle {
	font-size: 14px;
	color: rgba(255, 255, 255, 0.8);
	margin-top: 8px;
}

.form {
	background: #fff;
	border-radius: 24px;
	padding: 24px;
	width: 100%;
	max-width: 320px;
	margin: 0 auto;
	box-sizing: border-box;
}

.input-wrapper {
	width: 100%;
	margin-bottom: 12px;
}

.input-field {
	width: 100%;
	height: 44px;
	padding: 0 14px;
	background: #F5F3F3;
	border-radius: 12px;
	border: 1px solid #E5E5E5;
	font-size: 15px;
	box-sizing: border-box;
	outline: none;
}

.input-field:focus {
	border-color: #FFB7C5;
}

.error-message {
	background: rgba(255, 107, 107, 0.1);
	color: #FF6B6B;
	padding: 10px;
	border-radius: 8px;
	margin-bottom: 12px;
	text-align: center;
	font-size: 13px;
}

.btn {
	width: 100%;
	height: 44px;
	line-height: 44px;
	background: linear-gradient(135deg, #FFB7C5 0%, #FF8FA3);
	color: #fff;
	font-weight: 600;
	border-radius: 12px;
	border: none;
	font-size: 15px;
	margin-bottom: 12px;
	text-align: center;
}

.btn-primary {
	color: #fff;
}

.register-link {
	text-align: center;
	color: #FF8FA3;
	font-size: 13px;
}
</style>