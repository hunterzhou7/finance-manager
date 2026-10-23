<template>
	<view class="register-container">
		<view class="header">
			<text class="title">注册账号</text>
		</view>

		<view class="form">
			<input class="input-field" type="text" v-model="username" placeholder="请输入用户名" @focus="clearError" />
			<input class="input-field" type="text" v-model="nickname" placeholder="请输入昵称（可选）" />
			<input class="input-field" type="password" v-model="password" placeholder="请输入密码" @focus="clearError" />
			<input class="input-field" type="password" v-model="confirmPassword" placeholder="请再次输入密码" @focus="clearError" @confirm="handleRegister" />

			<view class="error-message" v-if="errorMessage">
				<text>{{ errorMessage }}</text>
			</view>

			<button class="btn btn-primary" @click="handleRegister" :loading="loading">
				<text v-if="!loading">注册</text>
				<text v-else>注册中...</text>
			</button>

			<view class="login-link" @click="goToLogin">
				<text>已有账号？立即登录</text>
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
			nickname: '',
			password: '',
			confirmPassword: '',
			errorMessage: '',
			loading: false
		}
	},
	methods: {
		clearError() {
			this.errorMessage = ''
		},
		async handleRegister() {
			if (!this.username) {
				this.errorMessage = '请输入用户名'
				return
			}
			if (!this.password) {
				this.errorMessage = '请输入密码'
				return
			}
			if (this.password !== this.confirmPassword) {
				this.errorMessage = '两次密码输入不一致'
				return
			}

			this.loading = true
			try {
				await API.register(this.username, this.password, this.nickname)
				uni.showToast({
					title: '注册成功',
					icon: 'success'
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			} catch (err) {
				this.errorMessage = err
			} finally {
				this.loading = false
			}
		},
		goToLogin() {
			uni.navigateBack()
		}
	}
}
</script>

<style>
.register-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #FFB7C5 0%, #FF8FA3 50%, #C9B8E8 100%);
	padding: 40px;
}

.header {
	margin-bottom: 40px;
}

.title {
	font-size: 28px;
	font-weight: 700;
	color: #fff;
}

.form {
	background: #fff;
	border-radius: 24px;
	padding: 32px 24px;
}

.input-field {
	width: 100%;
	padding: 14px 16px;
	background: #F5F3F3;
	border-radius: 12px;
	border: 1px solid #E5E5E5;
	font-size: 16px;
	margin-bottom: 16px;
}

.input-field:focus {
	border-color: #FFB7C5;
}

.error-message {
	background: rgba(255, 107, 107, 0.1);
	color: #FF6B6B;
	padding: 12px;
	border-radius: 8px;
	margin-bottom: 16px;
	text-align: center;
}

.btn {
	width: 100%;
	padding: 14px;
	background: linear-gradient(135deg, #FFB7C5, #FF8FA3);
	color: #fff;
	font-weight: 600;
	border-radius: 12px;
	border: none;
	font-size: 16px;
	margin-bottom: 16px;
}

.login-link {
	text-align: center;
	color: #FF8FA3;
}
</style>