//判断是否为空
const isEmpty = (s) => {
    return s === '' || s == null || typeof (s) == 'undefined';
}
const isNotEmpty = (s) => {
    return !isEmpty(s)
}

export default {
    isEmpty,
    isNotEmpty
}



