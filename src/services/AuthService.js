import decoder from 'jwt-decode';

class AuthService {
    static authenticateUser(token) {
        localStorage.setItem('token', token);
    }

    static isUserAuthenticated() {
        return localStorage.getItem('token') !== null;
    }

    static deauthenticateUser() {
        localStorage.removeItem('token');
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static getPayload(token = AuthService.getToken()) {
        return decoder(token);
    }

    static getAuthToken() {
        return `Bearer ${localStorage.getItem('token')}`;
    }

    static isAdmin() {
        return (AuthService.getPayload())? AuthService.getPayload().Roles.includes("Administrator"): false;
    }
}

export default AuthService;