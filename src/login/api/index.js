import request from "../../api/request"

export const loginReq = (code, card, pwd) => {
    console.log(code, card, pwd);
    return request({
        url: "/lor/login",
        method: "POST",
        data: {
            code,
            card,
            pwd
        }
    })
}

//  获取编号
export const getCodesReq = ()=>{
    return request({
        url:"/lor/codes",
        method:"GET"
    })
}