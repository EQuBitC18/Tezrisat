import http from "../http-common";

class MicrocourseDataService {
    getAll() {
        return http.get("/api/tutorials");
    }
}

export default new MicrocourseDataService();