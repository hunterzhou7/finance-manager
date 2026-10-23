/**
 * UniApp Platform Tests
 *
 * 作用：测试UniApp跨端应用在不同平台的兼容性
 *
 * 测试平台：
 * - iOS
 * - Android
 * - 微信小程序
 *
 * 特殊测试项：
 * - Canvas图表渲染
 * - scroll-view事件
 * - 存储API
 * - 网络请求
 */

export default {
    description: 'UniApp跨端平台兼容性测试',
    platforms: ['ios', 'android', 'mp-weixin'],

    // 测试用例
    testCases: [
        {
            id: 'PLAT-001',
            name: 'Canvas饼图渲染',
            platform: 'all',
            status: 'pending'
        },
        {
            id: 'PLAT-002',
            name: 'Canvas折线图渲染',
            platform: 'all',
            status: 'pending'
        },
        {
            id: 'PLAT-003',
            name: 'scroll-view上拉加载',
            platform: 'mp-weixin',
            status: 'pending'
        },
        {
            id: 'PLAT-004',
            name: 'uni.getStorageSync',
            platform: 'all',
            status: 'pending'
        },
        {
            id: 'PLAT-005',
            name: 'uni.request网络请求',
            platform: 'all',
            status: 'pending'
        }
    ],

    // 平台特定配置
    platformConfig: {
        'mp-weixin': {
            canvasType: '2d', // 移除type属性使用默认渲染
            scrollEvent: 'scrolltolower'
        }
    }
};