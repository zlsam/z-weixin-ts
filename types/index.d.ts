declare namespace weChatSDK {

    // 1.6.0 所有JS接口
    // onMenuShareTimeline（即将废弃）
    // onMenuShareAppMessage（即将废弃）
    // onMenuShareQQ（即将废弃）
    type API = "updateAppMessageShareData" | "updateTimelineShareData"
        | "onMenuShareTimeline" | "onMenuShareAppMessage" | "onMenuShareQQ"
        | "onMenuShareWeibo" | "onMenuShareQZone" | "startRecord"
        | "stopRecord" | "onVoiceRecordEnd" | "playVoice"
        | "pauseVoice" | "stopVoice" | "onVoicePlayEnd"
        | "uploadVoice" | "downloadVoice"
        | "chooseImage" | "previewImage"
        | "uploadImage" | "downloadImage"
        | "translateVoice" | "getNetworkType"
        | "openLocation" | "getLocation"
        | "hideOptionMenu" | "showOptionMenu"
        | "hideMenuItems" | "showMenuItems"
        | "hideAllNonBaseMenuItem" | "showAllNonBaseMenuItem"
        | "closeWindow" | "scanQRCode"
        | "chooseWXPay" | "openProductSpecificView"
        | "addCard" | "chooseCard" | "openCard";

    // 1.6.0 所有JS接口
    type jsApiList = API[];

    // 定义key: value参数别名
    type keyValue = { [key: string]: any };

    interface Configs {
        debug?: boolean; // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: string; // 必填，公众号的唯一标识
        timestamp: number; // 必填，生成签名的时间戳
        nonceStr: string, // 必填，生成签名的随机串
        signature: string,// 必填，签名
        jsApiList: jsApiList // 必填，需要使用的JS接口列表
    }

    // 注入配置信息
    function config(conf: Configs): void;

    /* config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，
     * 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
     * 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。*/
    function ready(fn: () => void): void;

    /* config信息验证失败会执行error函数，如签名过期导致验证失败，
     * 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。*/
    function error(fn: (...args: any[]) => void): void;

    // 通用接口调用参数
    interface CallFnParams {
        success?(...args: any[]): void;  //接口调用成功时执行的回调函数
        fail?(...args: any[]): void;     //接口调用失败时执行的回调函数
        complete?(...args: any[]): void; //接口调用完成时执行的回调函数，无论成功或失败都会执行
        cancel?(...args: any[]): void;   //用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到
        trigger?(...args: any[]): void;  //监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口
    }

    /*******************************************************************************************
     *                                      基础接口                                            *
     *******************************************************************************************/
    // 判断当前客户端版本是否支持指定JS接口
    interface checkParams extends CallFnParams {
        jsApiList: jsApiList, // 需要检测的JS接口列表
        // 以键值对的形式返回，可用的api值true，不可用为false
        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        success(res: {
            checkResult: keyValue;
            errMsg: string;
        }): void;
    }
    function checkJsApi(params: checkParams): void;

    /*******************************************************************************************
     *                                      分享接口                                            *
     *******************************************************************************************/

    /**
     * 原有的 wx.onMenuShareTimeline、wx.onMenuShareAppMessage、wx.onMenuShareQQ、wx.onMenuShareQZone 接口，即将废弃。
     * 请尽快迁移使用客户端6.7.2及JSSDK 1.4.0以上版本支持的 wx.updateAppMessageShareData、wx.updateTimelineShareData接口
     */
    type shareTypes = "link" | "music" | "video";

    interface ShareBaseParams {
        title: string; // 分享标题
        link: string; // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: string; // 分享图标
        success(): void;
        cancel?(): void;
    }
    interface MostShareParams extends ShareBaseParams {
        desc: string; // 分享描述
    }
    interface SpecialShareParams extends ShareBaseParams {
        type: shareTypes; // 分享类型,music、video或link，不填默认为link
        dataUrl: string; // 如果type是music或video，则要提供数据链接，默认为空
    }

    // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
    function updateAppMessageShareData(shareParams: MostShareParams): void;

    // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
    function updateTimelineShareData(shareParams: ShareBaseParams): void;

    // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
    function onMenuShareTimeline(shareParams: ShareBaseParams): void;

    // 获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
    function onMenuShareAppMessage(shareParams: SpecialShareParams): void;

    // 获取“分享到QQ”按钮点击状态及自定义分享内容接口（即将废弃）
    function onMenuShareQQ(shareParams: MostShareParams): void;

    // 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
    function onMenuShareWeibo(shareParams: MostShareParams): void;

    // 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口（即将废弃）
    function onMenuShareQZone(shareParams: MostShareParams): void;

    /*******************************************************************************************
     *                                      图像接口                                            *
     *******************************************************************************************/
    type sizeType = 'original' | 'compressed';
    type sourceType = 'album' | 'camera';

    type sizeTypeList = sizeType[];
    type sourceTypeList = sourceType[];

    interface ChooseParams {
        count: number;                    // 默认9
        sizeType: sizeTypeList;           // 可以指定是原图还是压缩图，默认二者都有
        sourceType: sourceTypeList;       // 可以指定来源是相册还是相机，默认二者都有
        success(...args: any[]): void;    // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
    }

    // 拍照或从手机相册中选图接口
    function chooseImage(params: ChooseParams): void;

    // 预览图片接口
    interface PreviewParams {
        current: string;    // 当前显示图片的http链接
        urls: string[];     // 需要预览的图片http链接列表
    }
    function previewImage(params: PreviewParams): void;

    // 上传图片接口
    // 上传图片有效期3天，可用微信多媒体接口下载图片到自己的服务器，此处获得的 serverId 即 media_id
    interface UploadParams {
        localId: string;                 // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: number;      // 默认为1，显示进度提示
        success(...args: any[]): void;   // 返回图片的服务器端ID
    }
    function uploadImage(params: UploadParams): void;

    // 下载图片接口
    interface DowmloadParams {
        serverId: string;                   // 需要下载的图片的服务器端ID，由uploadImage接口获得
        isShowProgressTips: number;         // 默认为1，显示进度提示
        success(...args: any[]): void;      // 返回图片下载后的本地ID
    }
    function downloadImage(params: DowmloadParams): void;

    // 获取本地图片接口
    /* 此接口仅在 iOS WKWebview 下提供，用于兼容 iOS WKWebview 不支持 localId 直接显示图片的问题。
     * 具体可参考《iOS WKWebview网页开发适配指南》(https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/iOS_WKWebview.html)
     */
    interface ImgParams {
        localId: string;                 // 图片的localID
        success(...args: any[]): void;   // localData是图片的base64数据，可以用img标签显示
    }
    function getLocalImgData(params: ImgParams): void;

    /*******************************************************************************************
     *                                      音频接口                                            *
     *******************************************************************************************/
    // 开始录音接口
    function startRecord(): void;

    // 停止录音接口
    function stopRecord(params: CallFnParams): void;

    // 监听录音自动停止接口
    function onVoiceRecordEnd(params: CallFnParams): void;

    // 播放语音接口
    function playVoice(params: {
        localId: string; // 需要播放的音频的本地ID，由stopRecord接口获得
    }): void;

    // 暂停播放接口
    function pauseVoice(params: {
        localId: string; // 需要暂停的音频的本地ID，由stopRecord接口获得
    }): void;

    // 停止播放接口
    function stopVoice(params: {
        localId: string; // 需要停止的音频的本地ID，由stopRecord接口获得
    }): void;

    // 监听语音播放完毕接口
    function onVoicePlayEnd(params: CallFnParams): void;
    // 上传语音接口
    /**
     * 备注：上传语音有效期3天，可用微信多媒体接口下载语音到自己的服务器，此处获得的 serverId 即 media_id，参考文档 .
     * 目前多媒体文件下载接口的频率限制为10000次/天，如需要调高频率，请登录微信公众平台，在开发 - 接口权限的列表中，申请提高临时上限。
     */
    interface BaseVoiceParams {
        isShowProgressTips: number;     // 默认为1，显示进度提示
        success(...args: any[]): void;  // 返回音频的服务器端/本地ID
    }
    interface VoiceParams extends BaseVoiceParams {
        localId: string; // 需要上传的音频的本地ID，由stopRecord接口获得
    }
    function uploadVoice(params: VoiceParams): void;

    // 下载语音接口
    interface DownloadVoiceParams extends BaseVoiceParams {
        serverId: string; // 需要下载的音频的服务器端ID，由uploadVoice接口获得
    }
    function downloadVoice(params: DownloadVoiceParams): void;

    /*******************************************************************************************
     *                                      智能接口                                            *
     *******************************************************************************************/
    interface TrVoiceParams {
        localId: string;            // 需要识别的音频的本地Id，由录音相关接口获得
        isShowProgressTips: number; // 默认为1，显示进度提示
        success(res: {
            translateResult: string;    // 语音识别的结果
        }): void;
    }
    //  识别音频并返回识别结果接口

    function translateVoice(params: TrVoiceParams): void;

    /*******************************************************************************************
     *                                      设备信息                                            *
     *******************************************************************************************/
    // 获取网络状态接口
    function getNetworkType(params: {
        success(res: {
            networkType: string;    // 返回网络类型2g，3g，4g，wifi
        }): void;
    }): void;

    /*******************************************************************************************
     *                                      地理位置                                            *
     *******************************************************************************************/
    type loactionType = 'wgs84' | 'gcj02';
    interface LocationParams {
        latitude: number;   // 纬度，浮点数，范围为90 ~ -90
        longitude: number;  // 经度，浮点数，范围为180 ~ -180。
        name: string;       // 位置名
        address: string;    // 地址详情说明
        scale: number;      // 地图缩放级别,整形值,范围从1~28。默认为最大
        infoUrl: string;    // 在查看位置界面底部显示的超链接,可点击跳转
    }
    interface GetLocationParams {
        type: loactionType; // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success(res: {
            latitude: number;   // 纬度，浮点数，范围为90 ~ -90
            longitude: number;  // 经度，浮点数，范围为180 ~ -180。
            speed: number;      // 速度，以米/每秒计
            accuracy: number;   // 位置精度
        }): void;
    }
    // 使用微信内置地图查看位置接口
    function openLocation(params: LocationParams): void;

    // 获取地理位置接口
    function getLocation(params: GetLocationParams): void;

    /*******************************************************************************************
     *                                      摇一摇                                              *
     *******************************************************************************************/
    // 如需接入摇一摇周边功能，请参考：申请开通摇一摇周边
    // 以下摇一摇周边接口使用注意事项及更多返回结果说明，请参考：摇一摇周边获取设备信息

    interface BeaconsParams {
        ticket?: string;       // 摇周边的业务ticket, 系统自动添加在摇出来的页面链接后面,使用于startSearchBeacons接口
        complete(...args: any[]): void;
    }
    // 开启查找周边ibeacon设备接口
    // complete: 开启查找完成后的回调函数
    function startSearchBeacons(params: BeaconsParams): void;

    // 关闭查找周边ibeacon设备接口
    // complete: 关闭查找完成后的回调函数
    function stopSearchBeacons(params: BeaconsParams): void;

    // 监听周边ibeacon设备接口
    // complete: 回调函数，可以数组形式取得该商家注册的在周边的相关设备列表
    function onSearchBeacons(params: BeaconsParams): void;

    /*******************************************************************************************
     *                                     界面操作                                              *
     *******************************************************************************************/
    // 基本类
    /**
     * 举报: "menuItem:exposeArticle" | 调整字体: "menuItem:setFont" | 日间模式: "menuItem:dayMode"
     * | 夜间模式: "menuItem:nightMode" | 刷新: "menuItem:refresh" | 查看公众号（已添加）: "menuItem:profile"
     * | 查看公众号（未添加）: "menuItem:addContact"
     */
    type BaseMenuItems = "menuItem:exposeArticle" | "menuItem:setFont"
        | "menuItem:dayMode" | "menuItem:nightMode"
        | "menuItem:refresh" | "menuItem:profile"
        | "menuItem:addContact";
    // 传播类
    /**
     * 发送给朋友: "menuItem:share:appMessage" | 分享到朋友圈: "menuItem:share:timeline"
     * | 分享到QQ: "menuItem:share:qq" | 分享到Weibo: "menuItem:share:weiboApp"
     * | 收藏: "menuItem:favorite" | 分享到FB: "menuItem:share:facebook" | 分享到 QQ 空间 "menuItem:share:QZone"
     */
    type SpreadMenuItems = "menuItem:share:appMessage" | "menuItem:share:timeline" | "menuItem:share:qq"
        | "menuItem:share:weiboApp" | "menuItem:favorite" | "menuItem:share:facebook"
        | "menuItem:share:QZone";
    // 保护类
    /**
     * 编辑标签: "menuItem:editTag" | 删除: "menuItem:delete" | 复制链接: "menuItem:copyUrl"
     * | 原网页: "menuItem:originPage" | 阅读模式: "menuItem:readMode" | 在QQ浏览器中打开: "menuItem:openWithQQBrowser"
     * | 在Safari中打开: "menuItem:openWithSafari" | 邮件: "menuItem:share:email" | 一些特殊公众号: "menuItem:share:brand"
     */
    type GuardMenuItems = "menuItem:editTag" | "menuItem:delete" | "menuItem:copyUrl"
        | "menuItem:originPage" | "menuItem:readMode" | "menuItem:openWithQQBrowser"
        | "menuItem:openWithSafari" | "menuItem:share:email" | "menuItem:share:brand"
    type MenuItems = BaseMenuItems[] & SpreadMenuItems[] & GuardMenuItems[];
    interface MenuItemParams {
        menuList: MenuItems
    }
    // 关闭当前网页窗口接口
    function closeWindow(): void;

    // 批量隐藏功能按钮接口
    function hideMenuItems(params: MenuItemParams): void;

    // 批量显示功能按钮接口
    function showMenuItems(params: MenuItemParams): void;

    // 隐藏所有非基础按钮接口
    function hideAllNonBaseMenuItem(): void;

    // 显示所有功能按钮接口
    function showAllNonBaseMenuItem(): void;

    /*******************************************************************************************
     *                                      扫一扫                                              *
     *******************************************************************************************/
    type scanTypes = "qrCode" | "barCode";
    type scanTypeArray = scanTypes[];
    interface ScanQRParams {
        needResult: number;         // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: scanTypeArray;    // 可以指定扫二维码还是一维码，默认二者都有
        success(res: {
            resultStr: string;      // 当needResult 为 1 时，扫码返回的结果
        }): void;
    }
    // 调起微信扫一扫
    function scanQRCode(params: ScanQRParams): void;

    /*******************************************************************************************
     *                                      微信小店                                            *
     *******************************************************************************************/
    interface SpecificViewParams {
        productId: string; // 商品id
        viewType: string; // 0.默认值，普通商品详情页1.扫一扫商品详情页2.小店商品详情页
    }
    // 跳转微信商品页接口
    function openProductSpecificView(params: SpecificViewParams): void;

    // 拉取适用卡券列表并获取用户选择信息
    interface ChooseCardParams {
        shopId: string;     // 门店Id
        cardType: string;   // 卡券类型
        cardId: string;     // 卡券Id
        timestamp: number;  // 卡券签名时间戳
        nonceStr: string;   // 卡券签名随机串
        signType: string;   // 签名方式，默认'SHA1'
        cardSign: string;   // 卡券签名
        success(res: {
            cardList: any[];// 用户选中的卡券列表信息
        }): void;
    }
    function chooseCard(params: ChooseCardParams): void;

    // 批量添加卡券接口
    type CardParams = {
        cardId: string;
        cardExt?: string;   // 批量添加卡券接口使用
        code?: string;      // 查看微信卡包中的卡券接口使用
    }
    type CardParamsArrays = CardParams[];
    interface AddCardParams {
        cardList: CardParamsArrays;
        success(res: {
            cardList: any[]
        }): void;
    }
    function addCard(params: AddCardParams): void;

    // 查看微信卡包中的卡券接口
    function openCard(params: {
        cardList: CardParamsArrays;
    }): void;

    /*******************************************************************************************
     *                                      微信支付                                            *
     *******************************************************************************************/
    // 发起一个微信支付请求
    // 微信支付开发文档：https://pay.weixin.qq.com/wiki/doc/api/index.html
    interface ChooseWXPayParams {
        timestamp: number;  // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: string;   // 支付签名随机串，不长于 32 位
        package: string;    // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        signType: string;   // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: string;    // 支付签名
        success(res: {
            err_msg: string; // 使用以上方式判断前端返回,微信团队郑重提示： res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
        }): void;  // 支付成功后的回调函数
    }
    function chooseWXPay(params: ChooseWXPayParams): void;

    /*******************************************************************************************
     *                                      快速输入                                            *
     *******************************************************************************************/
    // 共享收货地址接口
    /**
     * 微信地址共享使用的数据字段包括：
     * 收货人姓名
     * 地区，省市区三级
     * 详细地址
     * 邮编
     * 联系电话 其中，地区对应是国标三级地区码，如“广东省-广州市-天河区”，对应的邮编是是510630。
     * 详情参考链接：http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/201401/t20140116_501070.html
     */
    interface AddressParams {
        userName: string; // 收货人姓名
        postalCode: string; // 邮编
        provinceName: string; // 国标收货地址第一级地址（省）
        cityName: string; // 国标收货地址第二级地址（市）
        countryName: string; // 国标收货地址第三级地址（国家）
        detailInfo: string; // 详细收货地址信息
        nationalCode: string; // 收货地址国家码
        telNumber: string; // 收货人手机号码
    }
    function openAddress(params: {
        success(res: AddressParams): void;
    }): void;
}

// 使用ES Module导出
declare module 'z-weixin-ts' {
    export default weChatSDK;
}
