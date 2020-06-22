export default class RoleUtil {

    static isAdmin(roles) {
        let isAdmin = false;

        roles.forEach(function (role) {
            if (role == "ROLE_ADMIN") {
                isAdmin = true;
            }
        });

        return isAdmin;
    }
}