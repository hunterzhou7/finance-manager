<template>
	<view class="container">
		<view class="content">
			<!-- 类型选择 -->
			<view class="type-tabs">
				<view class="type-tab expense" :class="{selected: type === 'expense'}" @click="type = 'expense'">
					<text>支出</text>
				</view>
				<view class="type-tab income" :class="{selected: type === 'income'}" @click="type = 'income'">
					<text>收入</text>
				</view>
			</view>

			<!-- 金额输入 -->
			<view class="amount-card">
				<text class="amount-label">{{type === 'expense' ? '支出金额' : '收入金额'}}</text>
				<view class="amount-input-wrapper">
					<text class="currency">¥</text>
					<input class="amount-input" type="digit" v-model="amount" placeholder="0.00" @focus="clearError" />
				</view>
			</view>

			<!-- 分类选择 -->
			<view class="form-card">
				<view class="form-title">选择分类</view>
				<view class="category-grid">
					<view v-for="cat in categories" :key="cat.id" class="category-item" :class="{selected: selectedCategory && selectedCategory.id === cat.id}" @click="selectCategory(cat)">
						<text class="category-icon">{{cat.icon}}</text>
						<text class="category-name">{{cat.name}}</text>
					</view>
				</view>
			</view>

			<!-- 账户选择 -->
			<view class="form-card">
				<view class="form-title">账户</view>
				<view class="account-chips">
					<view v-for="account in accounts" :key="account.id" class="account-chip" :class="{selected: selectedAccount && selectedAccount.id === account.id}" @click="selectAccount(account)">
						<text>{{account.icon}} {{account.name}}</text>
					</view>
				</view>
			</view>

			<!-- 备注 -->
			<view class="form-card">
				<view class="form-row">
					<text class="form-label">备注</text>
					<input class="form-input-right" type="text" v-model="remark" placeholder="添加备注（可选）" />
				</view>
			</view>

			<!-- 快捷金额 -->
			<view class="quick-card" v-if="type === 'expense'">
				<view class="form-title">快捷金额</view>
				<view class="quick-grid">
					<view v-for="amt in quickAmounts" :key="amt" class="quick-item" @click="amount = String(amt)">
						<text>¥{{amt}}</text>
					</view>
				</view>
			</view>

			<!-- 错误提示 -->
			<view class="error-message" v-if="errorMessage">
				<text>{{errorMessage}}</text>
			</view>

			<!-- 保存按钮 -->
			<button class="save-btn" @click="handleSubmit" :loading="loading">
				<text>{{loading ? '保存中...' : '保存'}}</text>
			</button>
		</view>
	</view>
</template>

<script>
import API from '../../js/api.js'

export default {
	data() {
		return {
			type: 'expense',
			amount: '',
			selectedCategory: null,
			selectedAccount: null,
			remark: '',
			categories: [],
			accounts: [],
			errorMessage: '',
			loading: false,
			quickAmounts: [10, 20, 50, 100, 200, 500, 1000, 2000]
		}
	},
	onLoad() {
		this.loadCategories()
		this.loadAccounts()
	},
	methods: {
		clearError() {
			this.errorMessage = ''
		},
		async loadCategories() {
			try {
				const data = await API.getCategories(this.type)
				this.categories = data || []
				if (this.categories.length > 0 && !this.selectedCategory) {
					this.selectedCategory = this.categories[0]
				}
			} catch (err) {
				console.error('加载分类失败:', err)
			}
		},
		async loadAccounts() {
			try {
				const data = await API.getAccounts()
				this.accounts = data || []
				if (this.accounts.length > 0 && !this.selectedAccount) {
					this.selectedAccount = this.accounts[0]
				}
			} catch (err) {
				console.error('加载账户失败:', err)
			}
		},
		selectCategory(cat) {
			this.selectedCategory = cat
		},
		selectAccount(account) {
			this.selectedAccount = account
		},
		async handleSubmit() {
			if (!this.amount || parseFloat(this.amount) <= 0) {
				this.errorMessage = '请输入有效金额'
				return
			}
			if (!this.selectedCategory) {
				this.errorMessage = '请选择分类'
				return
			}
			if (!this.selectedAccount) {
				this.errorMessage = '请选择账户'
				return
			}

			this.loading = true
			try {
				await API.addTransaction({
					type: this.type,
					category_id: this.selectedCategory.id,
					account_id: this.selectedAccount.id,
					amount: parseFloat(this.amount),
					remark: this.remark
				})
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				})
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}, 1500)
			} catch (err) {
				this.errorMessage = err || '保存失败'
			} finally {
				this.loading = false
			}
		}
	},
	watch: {
		type() {
			this.selectedCategory = null
			this.loadCategories()
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
}

.type-tabs {
	display: flex;
	gap: 12px;
	margin-bottom: 16px;
}

.type-tab {
	flex: 1;
	padding: 14px;
	text-align: center;
	border-radius: 12px;
	font-size: 16px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
	border: none;
}

.type-tab.expense {
	background: rgba(255, 160, 155, 0.2);
	color: #FFA09B;
}

.type-tab.expense.selected {
	background: #FFA09B;
	color: #fff;
}

.type-tab.income {
	background: rgba(125, 211, 192, 0.2);
	color: #7DD3C0;
}

.type-tab.income.selected {
	background: #7DD3C0;
	color: #fff;
}

.amount-card {
	background: #fff;
	border-radius: 16px;
	padding: 24px;
	margin-bottom: 16px;
	box-shadow: 0 4px 12px rgba(255, 183, 197, 0.15);
}

.amount-label {
	font-size: 14px;
	color: #999;
}

.amount-input-wrapper {
	display: flex;
	align-items: center;
	margin-top: 8px;
}

.currency {
	font-size: 28px;
	color: #2D2D2D;
}

.amount-input {
	flex: 1;
	font-size: 36px;
	font-weight: 700;
	color: #2D2D2D;
	margin-left: 4px;
}

.form-card {
	background: #fff;
	border-radius: 16px;
	padding: 16px;
	margin-bottom: 16px;
	box-shadow: 0 4px 12px rgba(255, 183, 197, 0.15);
}

.form-title {
	font-size: 14px;
	font-weight: 600;
	color: #2D2D2D;
	margin-bottom: 12px;
}

.category-grid {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 8px;
}

.category-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
	padding: 12px 8px;
	background: #FFF0F3;
	border-radius: 12px;
}

.category-item.selected {
	background: #FFB7C5;
}

.category-item.selected .category-name {
	color: #fff;
}

.category-icon {
	font-size: 22px;
}

.category-name {
	font-size: 11px;
	color: #666;
	margin-top: 2px;
}

.account-chips {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.account-chip {
	padding: 8px 16px;
	background: #FFF0F3;
	border-radius: 10px;
	font-size: 14px;
	color: #666;
}

.account-chip.selected {
	background: #FFB7C5;
	color: #fff;
}

.form-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 0;
	border-bottom: 1px solid #f5f5f5;
}

.form-row:last-child {
	border-bottom: none;
}

.form-label {
	font-size: 15px;
	color: #2D2D2D;
}

.form-input-right {
	text-align: right;
	font-size: 15px;
	color: #666;
}

.quick-card {
	margin-bottom: 16px;
}

.quick-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.quick-item {
	width: calc(25% - 6px);
	padding: 12px 0;
	text-align: center;
	background: #fff;
	border-radius: 8px;
	font-size: 14px;
	color: #FF8FA3;
}

.error-message {
	background: rgba(255, 107, 107, 0.1);
	color: #FF6B6B;
	padding: 12px;
	border-radius: 8px;
	margin-bottom: 16px;
	text-align: center;
	font-size: 14px;
}

.save-btn {
	width: 100%;
	padding: 16px;
	background: linear-gradient(135deg, #FFB7C5 0%, #FF8FA3 100%);
	color: #fff;
	font-weight: 600;
	border-radius: 12px;
	border: none;
	font-size: 16px;
}
</style>