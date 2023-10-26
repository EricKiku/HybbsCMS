import request from "../../api/request"

// 获取所有的分区
export const getZonesReq = () => {
    return request({
        url: "/zoneData/zones",
        method: "GET"
    })
}

// 获取分区数据
export const getMessageReq = (zId) => {
    return request({
        url: "/zoneData/getMessage",
        method: "GET",
        params: {
            zId
        }
    })
}

// 模糊查询分区
export const getZonesLike = (key) => {
    return request({
        url: "/zoneData/zonesLike",
        method: "GET",
        params: {
            key
        }
    })
}

// 删除分区
export const deleteZoneReq = (z_id) => {
    return request({
        url: "/zoneData/deleteZone",
        method: "DELETE",
        data: {
            z_id
        }
    })
}

// 更新分区
export const updateZone = (z_id, z_name, z_introduce) => {
    return request({
        url: "/zoneData/updateZone",
        method: "PUT",
        data: {
            z_id,
            z_name,
            z_introduce
        }
    })
}

// 获取分区帖子
export const getPostsReq = (z_id) => {
    return request({
        url: "/zoneData/posts",
        method: "GET",
        params: {
            z_id
        }
    })
}

// 获取所有分区的帖子数和关注数
export const getzonesPostsAndFollowsReq = () => {
    return request({
        url: "/zoneData/zonesPostsAndFollows",
        method: "GET"
    })
}
// 获取分区的帖子发布频率
export const getPostMessageReq = (z_id) => {
    return request({
        url: "/zoneData/postPublishMessage",
        method: "GET",
        params: {
            z_id
        }
    })
}
// 置顶分区
export const toTopZoneReq = (z_id) => {
    return request({
        url: "/zoneData/toTop",
        method: "PUT",
        data: {
            z_id
        }
    })
}

// 取消分区
export const canceltoTopZoneReq = (z_id) => {
    return request({
        url: "/zoneData/cancelTop",
        method: "PUT",
        data: {
            z_id
        }
    })
}






//  获取所有post
export const getAllPost = () => {
    return request({
        url: "/post/allPost",
        method: "GET"
    })
}
// 模糊查询帖子
export const getPostsLikeReq = (keyWord) => {
    return request({
        url: "/post/getPostLike",
        method: "GET",
        params: {
            keyWord
        }
    })
}
// 回复帖子回复
export const getReplysReq = (p_id) => {
    return request({
        url: "/post/replys",
        method: "GET",
        params: {
            p_id
        }
    })
}

// 删除帖子
export const deletePostReq = (p_id) => {
    return request({
        url: "/post/post",
        method: "DELETE",
        data: {
            p_id
        }
    })
}
// 置顶或取消置顶帖子
export const topOrNoTopReq = (p_id, opType) => {
    return request({
        url: "/post/topOrNoTop",
        method: "PUT",
        data: {
            p_id,
            opType
        }
    })
}




// 获取用户
export const getUserReq = ()=>{
    return request({
        url:"/user/user",
        method:"GET"
    })
}