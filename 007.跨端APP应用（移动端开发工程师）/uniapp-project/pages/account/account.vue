<template>
	<view class="container">
		<view class="content">
			<!-- 账户总余额 -->
			<view class="balance-card">
				<text class="balance-label">账户总余额</text>
				<text class="balance-amount">¥{{totalBalanceFormatted}}</text>
			</view>

			<!-- 账户列表 -->
			<view class="account-list" v-if="accounts.length > 0">
				<view v-for="account in accounts" :key="account.id" class="account-item">
					<text class="account-icon">{{account.icon}}</text>
					<view class="account-info">
						<text class="account-name">{{account.name}}</text>
						<text class="account-type">{{account.type}}</text>
					</view>
					<view class="account-right">
						<text class="account-balance">¥{{formatAmount(account.balance)}}</text>
						<view class="account-actions">
							<text class="action-btn" @click="editAccount(account)">编辑</text>
							<text class="action-btn delete" @click="confirmDelete(account.id)">删除</text>
						</view>
					</view>
				</view>
			</view>
			<view v-else class="empty">
				<text>暂无账户，点击下方添加</text>
			</view>

			<!-- 添加按钮 -->
			<button class="add-btn" @click="showAddModal = true">
				<text>添加账户</text>
			</button>
		</view>

		<!-- 添加/编辑弹窗 -->
		<view class="modal-overlay" v-if="showAddModal" @click="closeModal">
			<view class="modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">{{editingAccount ? '编辑账户' : '添加账户'}}</text>
					<text class="modal-close" @click="closeModal">×</text>
				</view>
				<view class="modal-body">
					<view class="form-item">
						<text class="form-label">图标</text>
						<input class="form-input" type="text" v-model="formData.icon" placeholder="如: 💰" />
					</view>
					<view class="form-item">
						<text class="form-label">名称</text>
						<input class="form-input" type="text" v-model="formData.name" placeholder="如: 现金" />
					</view>
					<view class="form-item">
						<text class="form-label">类型</text>
						<input class="form-input" type="text" v-model="formData.type" placeholder="如: 现金、银行卡、支付宝" />
					</view>
					<view class="form-item" v-if="!editingAccount">
						<text class="form-label">初始余额</text>
						<input class="form-input" type="digit" v-model="formData.balance" placeholder="0" />
					</view>
				</view>
				<view class="modal-actions">
					<button class="cancel-btn" @click="closeModal">取消</button>
					<button class="save-btn" @click="saveAccount">保存</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import API from '../../js/api.js'

export default {
	data() {
		return {
			accounts: [],
			totalBalance: 0,
			showAddModal: false,
			editingAccount: null,
			formData: {
				icon: '',
				name: '',
				type: '',
				balance: '0'
			}
		}
	},
	computed: {
		totalBalanceFormatted() {
			return this.formatAmount(this.totalBalance)
		}
	},
	onShow() {
		this.loadAccounts()
	},
	methods: {
		formatAmount(amount) {
			const num = parseFloat(amount) || 0
			return num.toLocaleString('zh-CN')
		},
		async loadAccounts() {
			try {
				const data = await API.getAccounts()
				this.accounts = data || []
				this.totalBalance = this.accounts.reduce((sum, a) => sum + (a.balance || 0), 0)
			} catch (err) {
				console.error('加载账户失败:', err)
			}
		},
		editAccount(account) {
			this.editingAccount = account
			this.formData = {
				icon: account.icon,
				name: account.name,
				type: account.type,
				balance: String(account.balance || 0)
			}
			this.showAddModal = true
		},
		confirmDelete(id) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除该账户吗？',
				success: (res) => {
					if (res.confirm) {
						this.deleteAccount(id)
					}
				}
			})
		},
		async deleteAccount(id) {
			try {
				await API.deleteAccount(id)
				uni.showToast({
					title: '删除成功',
					icon: 'success'
				})
				this.loadAccounts()
			} catch (err) {
				uni.showToast({
					title: '删除失败',
					icon: 'none'
				})
			}
		},
		closeModal() {
			this.showAddModal = false
			this.editingAccount = null
			this.formData = {
				icon: '',
				name: '',
				type: '',
				balance: '0'
			}
		},
		async saveAccount() {
			if (!this.formData.name) {
				uni.showToast({
					title: '请填写名称',
					icon: 'none'
				})
				return
			}

			const data = {
				icon: this.formData.icon,
				name: this.formData.name,
				type: this.formData.type,
				balance: parseFloat(this.formData.balance) || 0
			}

			try {
				if (this.editingAccount) {
					await API.updateAccount(this.editingAccount.id, data)
				} else {
					await API.addAccount(data)
				}
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				})
				this.closeModal()
				this.loadAccounts()
			} catch (err) {
				uni.showToast({
					title: '保存失败',
					icon: 'none'
				})
			}
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

.balance-card {
	background: linear-gradient(135deg, #FFB7C5 0%, #FF8FA3 100%);
	border-radius: 16px;
	padding: 24px;
	margin-bottom: 16px;
}

.balance-label {
	font-size: 14px;
	color: rgba(255, 255, 255, 0.9);
}

.balance-amount {
	font-size: 28px;
	font-weight: 700;
	color: #fff;
	margin-top: 8px;
	display: block;
}

.account-list {
	background: #fff;
	border-radius: 16px;
	overflow: hidden;
	margin-bottom: 16px;
}

.account-item {
	display: flex;
	align-items: center;
	padding: 16px;
	border-bottom: 1px solid #f5f5f5;
}

.account-item:last-child {
	border-bottom: none;
}

.account-icon {
	font-size: 28px;
	margin-right: 12px;
}

.account-info {
	flex: 1;
}

.account-name {
	font-size: 15px;
	color: #2D2D2D;
	display: block;
}

.account-type {
	font-size: 13px;
	color: #999;
	margin-top: 2px;
}

.account-right {
	text-align: right;
}

.account-balance {
	font-size: 15px;
	font-weight: 600;
	color: #FF8FA3;
	display: block;
}

.account-actions {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	margin-top: 4px;
}

.action-btn {
	font-size: 13px;
	color: #FF8FA3;
}

.action-btn.delete {
	color: #FF6B6B;
}

.empty {
	padding: 40px;
	text-align: center;
	color: #ccc;
}

.add-btn {
	width: 100%;
	padding: 14px;
	background: linear-gradient(135deg, #FFB7C5, #FF8FA3);
	color: #fff;
	font-weight: 600;
	border-radius: 12px;
	border: none;
	font-size: 16px;
}

.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.modal {
	background: #fff;
	border-radius: 16px;
	width: 85%;
	max-width: 300px;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px;
	border-bottom: 1px solid #eee;
}

.modal-title {
	font-size: 16px;
	font-weight: 600;
}

.modal-close {
	font-size: 24px;
	color: #999;
}

.modal-body {
	padding: 16px;
}

.form-item {
	margin-bottom: 16px;
}

.form-label {
	font-size: 14px;
	color: #999;
	display: block;
	margin-bottom: 8px;
}

.form-input {
	width: 100%;
	padding: 12px;
	background: #f5f5f5;
	border-radius: 8px;
	font-size: 15px;
}

.modal-actions {
	display: flex;
	gap: 12px;
	padding: 16px;
	border-top: 1px solid #eee;
}

.cancel-btn {
	flex: 1;
	padding: 12px;
	background: #f5f5f5;
	color: #999;
	border-radius: 8px;
	border: none;
	font-size: 15px;
}

.save-btn {
	flex: 1;
	padding: 12px;
	background: linear-gradient(135deg, #FFB7C5, #FF8FA3);
	color: #fff;
	border-radius: 8px;
	border: none;
	font-size: 15px;
}
</style>