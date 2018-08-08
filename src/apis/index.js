import service from './../utils/fetch'

// 登录
export function login(data) {
    return service({
        url: '',
        method: 'post',
        data:data
    });
}