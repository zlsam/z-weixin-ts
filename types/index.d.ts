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
    function error(fn: (res) => void): void;

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
    type ShareTypes = "link" | "music" | "video";

    interface ShareBaseParams {
        title: string; // 分享标题
        link: string; // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: string; // 分享图标
        success():void;
        cancel?():void;
    }
    interface MostShareParams extends ShareBaseParams{
        desc: string; // 分享描述
    }
    interface SpecialShareParams extends ShareBaseParams{
        type: ShareTypes; // 分享类型,music、video或link，不填默认为link
        dataUrl: string; // 如果type是music或video，则要提供数据链接，默认为空
    }

    // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
    function updateAppMessageShareData(shareParams:MostShareParams): void;
    // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
    function updateTimelineShareData(shareParams:ShareBaseParams): void;
    // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
    function onMenuShareTimeline(shareParams:ShareBaseParams): void;
    // 获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
    function onMenuShareAppMessage(shareParams:SpecialShareParams): void;
    // 获取“分享到QQ”按钮点击状态及自定义分享内容接口（即将废弃）
    function onMenuShareQQ(shareParams:MostShareParams): void;
    // 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
    function onMenuShareWeibo(shareParams:MostShareParams): void;
    // 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口（即将废弃）
    function onMenuShareQZone(shareParams:MostShareParams): void;
}

export default weChatSDK;