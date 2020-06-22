export default class TagUtil {

    static isNotEmptyTag(string) {
        return !(new RegExp("<(\\w+)>(\\s|&nbsp;)*</\\1>").test(string));
    }
}