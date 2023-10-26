import request from "../../api/request"

// 获取分区创建次数的最近五个日期
export const getZoneCreateMessageGroupByDateReq = () => {
    return request({
        url: "/home/zoneCreateMessageGroupByDate",
        method: "GET"
    })
}

// 获取最多帖子的五个分区
export const getPostsBestFive = () => {
    return request({
        url: "/home/getPostBestFive",
        method: "GET"
    })
}
// 获取用户签到数据
export const getUserSigninMessageForFive = () => {
    return request({
        url: "/home/getUserSignin",
        method: "GET"
    })
}
// 获取评论最多的分区的近期评论数据
export const getReplyMessageForZoneBestReplyRes = () => {
    return request({
        url: "/home/getReplyMessageForZoneBestReply",
        method: "GET"
    })
}
// 获取聊天频率最高的三个频道
export const getRoomBestChatReq = () => {
    return request({
        url: "/home/getRoomBestChat",
        method: "GET"
    })
}
//  获取所有用户
export const getAdminersReq = () => {
    return request({
        url: "/home/getAdminers",
        method: "GET"
    })
}


// 获取频道聊天数据
export const getRoomChatMessageReq = () => {
    return request({
        url: "/home/getRoomsChatMessage",
        method: "GET"
    })
}
// 获取聊天用户
export const getChatToGroup = () => {
    return request({
        url: "/home/getChatToGroup",
        method: "GET"
    })
}




// 测试
export const test = () => {
    return request({
        url: "/login",
        method: "GET"
    })
}

