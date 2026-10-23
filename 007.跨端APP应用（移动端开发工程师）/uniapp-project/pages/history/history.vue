<template>
	<view class="container">
		<view class="content">
			<!-- 筛选 -->
			<view class="filter-bar">
				<view class="filter-chip" :class="{active: filterType === ''}" @click="setFilter('')">
					<text>全部</text>
				</view>
				<view class="filter-chip" :class="{active: filterType === 'expense'}" @click="setFilter('expense')">
					<text>支出</text>
				</view>
				<view class="filter-chip" :class="{active: filterType === 'income'}" @click="setFilter('income')">
					<text>收入</text>
				</view>
			</view>

			<!-- 交易列表 -->
			<scroll-view class="transaction-scroll" scroll-y @scrolltolower="loadMore">
				<view v-if="Object.keys(groupedData).length > 0">
					<view v-for="month in monthOrder" :key="month" class="month-group">
						<view class="month-header">{{month}}</view>
						<view class="transaction-list">
							<view v-for="tx in groupedData[month]" :key="tx.id" class="transaction-item" @click="showDetail(tx)">
								<view class="tx-icon-wrapper">
									<text class="tx-icon">{{tx.categoryIcon}}</text>
								</view>
								<view class="tx-info">
									<text class="tx-category">{{tx.categoryName}}</text>
									<text class="tx-account">{{tx.accountName}}</text>
								</view>
								<view class="tx-right">
									<text class="tx-amount" :class="tx.type">{{tx.type === 'income' ? '+' : '-'}}¥{{formatAmount(tx.amount)}}</text>
									<text class="tx-date">{{tx.day}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="empty">
					<text>暂无记录</text>
				</view>

				<!-- 加载提示 -->
				<view class="load-tip" v-if="loading">
					<text>加载中...</text>
				</view>
				<view class="load-tip" v-if="!hasMore && transactions.length > 0">
					<text>没有更多了</text>
				</view>
			</scroll-view>
		</view>

		<!-- 悬浮按钮 -->
		<view class="fab-button" @click="goToAdd">
			<text class="fab-icon">+</text>
		</view>

		<!-- 详情弹窗 -->
		<view class="modal-overlay" v-if="showDetailModal" @click="showDetailModal = false">
			<view class="modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">交易详情</text>
					<text class="modal-close" @click="showDetailModal = false">×</text>
				</view>
				<view class="modal-body">
					<view class="detail-row">
						<text class="detail-label">类型</text>
						<text class="detail-value" :class="currentTx.type">{{currentTx.type === 'income' ? '收入' : '支出'}}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">分类</text>
						<text class="detail-value">{{currentTx.categoryIcon}} {{currentTx.categoryName}}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">账户</text>
						<text class="detail-value">{{currentTx.accountIcon}} {{currentTx.accountName}}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">金额</text>
						<text class="detail-value" :class="currentTx.type">{{currentTx.type === 'income' ? '+' : '-'}}¥{{formatAmount(currentTx.amount)}}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">日期</text>
						<text class="detail-value">{{currentTx.date}}</text>
					</view>
					<view class="detail-row" v-if="currentTx.remark">
						<text class="detail-label">备注</text>
						<text class="detail-value">{{currentTx.remark}}</text>
					</view>
				</view>
				<view class="modal-actions">
					<button class="btn-delete" @click="confirmDelete(currentTx.id)">删除</button>
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
			filterType: '',
			transactions: [],
			groupedData: {},
			monthOrder: [],
			page: 1,
			pageSize: 20,
			hasMore: true,
			loading: false,
			showDetailModal: false,
			currentTx: {}
		}
	},
	onShow: function() {
		this.transactions = []
		this.groupedData = {}
		this.monthOrder = []
		this.page = 1
		this.hasMore = true
		this.loadTransactions()
	},
	methods: {
		formatAmount: function(amount) {
			var num = parseFloat(amount) || 0
			return num.toLocaleString('zh-CN')
		},
		setFilter: function(type) {
			this.filterType = type
			this.transactions = []
			this.groupedData = {}
			this.monthOrder = []
			this.page = 1
			this.hasMore = true
			this.loadTransactions()
		},
		loadTransactions: function() {
			var that = this
			if (this.loading) return
			this.loading = true

			API.getTransactions(this.page, this.pageSize, this.filterType || null, null).then(function(res) {
				that.loading = false
				console.log('API返回:', JSON.stringify(res))
				var list = []
				if (res.transactions && res.transactions.length > 0) {
					list = res.transactions.map(function(tx) {
						var date = tx.transaction_date ? new Date(tx.transaction_date) : new Date()
						return {
							id: tx.id,
							categoryName: tx.category_name,
							categoryIcon: tx.category_icon,
							accountName: tx.account_name,
							accountIcon: tx.account_icon,
							amount: tx.amount,
							type: tx.type_name,
							date: tx.transaction_date ? tx.transaction_date.substring(0, 10) : '',
							day: (date.getMonth() + 1) + '/' + date.getDate(),
							remark: tx.remark
						}
					})
				}

				if (that.page === 1) {
					that.transactions = list
				} else {
					that.transactions = that.transactions.concat(list)
				}

				// 按月份分组
				that.groupTransactions()
				that.hasMore = list.length >= that.pageSize
			}).catch(function(err) {
				that.loading = false
				console.error('加载交易记录失败:', err)
			})
		},
		groupTransactions: function() {
			var grouped = {}
			var that = this

			this.transactions.forEach(function(tx) {
				var date = tx.date ? new Date(tx.date) : new Date()
				var monthKey = date.getFullYear() + '年' + (date.getMonth() + 1) + '月'
				if (!grouped[monthKey]) {
					grouped[monthKey] = []
				}
				grouped[monthKey].push(tx)
			})

			// 按月份倒序排列
			var monthKeys = Object.keys(grouped).sort()
			that.monthOrder = monthKeys.reverse()

			this.groupedData = grouped
		},
		loadMore: function() {
			if (!this.hasMore || this.loading) return
			this.page++
			this.loadTransactions()
		},
		showDetail: function(tx) {
			this.currentTx = tx
			this.showDetailModal = true
		},
		confirmDelete: function(id) {
			var that = this
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这条交易记录吗？',
				success: function(res) {
					if (res.confirm) {
						API.deleteTransaction(id).then(function() {
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
							that.showDetailModal = false
							that.transactions = []
							that.groupedData = {}
							that.monthOrder = []
							that.page = 1
							that.loadTransactions()
						}).catch(function() {
							uni.showToast({
								title: '删除失败',
								icon: 'none'
							})
						})
					}
				}
			})
		},
		goToAdd: function() {
			uni.navigateTo({
				url: '/pages/add/add'
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
	height: 100vh;
	display: flex;
	flex-direction: column;
}

.filter-bar {
	display: flex;
	gap: 8px;
	margin-bottom: 12px;
	flex-shrink: 0;
}

.filter-chip {
	flex: 1;
	padding: 10px;
	text-align: center;
	border-radius: 20px;
	font-size: 14px;
	background: #fff;
	color: #666;
	border: 1px solid #EFEDED;
}

.filter-chip.active {
	background: #FFB7C5;
	color: #fff;
	border-color: #FFB7C5;
}

.transaction-scroll {
	flex: 1;
	height: 0;
}

.month-group {
	margin-bottom: 16px;
}

.month-header {
	font-size: 14px;
	color: #8E8E8E;
	margin-bottom: 8px;
	padding-left: 4px;
}

.transaction-list {
	background: #fff;
	border-radius: 16px;
	overflow: hidden;
	box-shadow: 0 4px 12px rgba(255, 183, 197, 0.15);
}

.transaction-item {
	display: flex;
	align-items: center;
	padding: 14px;
	border-bottom: 1px solid #EFEDED;
}

.transaction-item:last-child {
	border-bottom: none;
}

.tx-icon-wrapper {
	width: 40px;
	height: 40px;
	background: #FFF0F3;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 12px;
}

.tx-icon {
	font-size: 20px;
}

.tx-info {
	flex: 1;
}

.tx-category {
	font-size: 14px;
	font-weight: 500;
}

.tx-account {
	font-size: 12px;
	color: #8E8E8E;
	margin-top: 2px;
	display: block;
}

.tx-right {
	text-align: right;
}

.tx-amount {
	font-size: 14px;
	font-weight: 600;
	display: block;
}

.tx-amount.income {
	color: #7DD3C0;
}

.tx-amount.expense {
	color: #FFA09B;
}

.tx-date {
	font-size: 12px;
	color: #ccc;
	margin-top: 2px;
	display: block;
}

.empty {
	padding: 60px;
	text-align: center;
	color: #ccc;
}

.load-tip {
	padding: 16px;
	text-align: center;
	color: #999;
	font-size: 12px;
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
	max-width: 320px;
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

.detail-row {
	display: flex;
	justify-content: space-between;
	padding: 12px 0;
	border-bottom: 1px solid #f5f5f5;
}

.detail-label {
	font-size: 14px;
	color: #999;
}

.detail-value {
	font-size: 14px;
	color: #2D2D2D;
}

.detail-value.income {
	color: #7DD3C0;
}

.detail-value.expense {
	color: #FFA09B;
}

.modal-actions {
	padding: 16px;
	border-top: 1px solid #eee;
}

.btn-delete {
	width: 100%;
	padding: 12px;
	background: #FF6B6B;
	color: #fff;
	border-radius: 8px;
	border: none;
	font-size: 15px;
}
</style>