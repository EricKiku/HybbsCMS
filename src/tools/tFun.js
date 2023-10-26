import { ElMessage } from 'element-plus'
import router from "../router/index"
// 1 == 成功    2 == 警告   3 == 错误
export const message = (stats, value) => {
    if (stats == '1') {
        ElMessage({
            message: value,
            type: 'success',
        })
    } else if (stats == '2') {
        ElMessage({
            message: value,
            type: 'warning',
        })
    } else if (stats == '3') {
        ElMessage.error(value)
    }
}

const dragscroll = (el) => {
    console.log("进入滑动");
    el.onmousedown = ev => {
        const disX = ev.clientX;
        const originalScrollLeft = el.scrollLeft;
        const originalScrollBehavior = el.style['scroll-behavior'];
        const originalPointerEvents = el.style['pointer-events'];
        el.style['scroll-behavior'] = 'auto';
        // 鼠标移动事件是监听的整个document，这样可以使鼠标能够在元素外部移动的时候也能实现拖动
        document.onmousemove = dv => {
            dv.preventDefault();
            const distanceX = dv.clientX - disX;
            el.scrollTo(originalScrollLeft - distanceX, 0); // 不需要上下拖拽，y轴值为0
        };
        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
            el.style['scroll-behavior'] = originalScrollBehavior;
            el.style['pointer-events'] = originalPointerEvents;
        };
    };
};


// 返回近几天的日期
export const getDate = (time) => {
    var myDate = new Date(); //获取今天日期
    myDate.setDate(myDate.getDate() - time + 1);
    var dateArray = [];
    var dateTemp;
    var flag = 1;
    for (var i = 0; i < time; i++) {
        let month = 0;
        if (myDate.getMonth() + 1 < 10) {
            month = '0' + (myDate.getMonth() + 1);
        } else {
            month = myDate.getMonth() + 1;
        }
        let day = 0;
        if (myDate.getDate() < 10) {
            day = '0' + myDate.getDate();
        } else {
            day = myDate.getDate();
        }
        dateTemp = myDate.getFullYear() + '/' + month + '/' + day;
        dateArray.push(dateTemp);
        myDate.setDate(myDate.getDate() + flag);
    }
    return dateArray
}

// 设置 路径
export const setPathTol = (value) => {
    console.log(router);
}

// 冒泡排序
export const BubbleSort = (array, type, key) => {
    for (let i = 0; i < array.length; i++) {
        let done = true
        for (let j = 0; j < array.length - i - 1; j++) {
            if (type == 'asc') {
                if (array[j][key] > array[j + 1][key]) {
                    let temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                    done = false
                }
            } else if (type == 'desc') {
                if (array[j][key] < array[j + 1][key]) {
                    let temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                    done = false
                }
            }

        }
        if (done) {
            break;
        }
    }
    return array

}

// 处理嵌套回复
export const replyHandle = (replys) => {
    // 先把所有r_reply == 0 的对象找出来，添加到一个临时数组
    let directReply = []
    let replyToReply = []
    // 分离出直接回复和回复给回复
    for (let i = 0; i < replys.length; i++) {
        if (!replys[i]['r_reply']) {
            directReply.push(replys[i])
        } else {
            replyToReply.push(replys[i])
        }
    }
    // 给所有直接回复添加属性
    for (let r = 0; r < directReply.length; r++) {
        directReply[r].lowerReply = []
    }
    // 遍历间接回复数组
    for (let i = 0; i < replyToReply.length - 1; i++) {
        // 获取到索引后，给该对象添加一个数组属性
        let index = findReply(directReply, replyToReply[i].r_reply)
        directReply[index].lowerReply.push(replyToReply[i])
    }
    return directReply
}
// 找到r_reply对应的对象是多少索引
function findReply(replys, r_id) {
    for (let j = 0; j < replys.length; j++) {
        if (replys[j].r_id == r_id) {
            return j
        }
    }
}
export default dragscroll;