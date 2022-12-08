export default class RoleUtil {

    static isAdmin(roles) {
        return roles ? roles.includes("ROLE_ADMIN") : false
    }
}