import axios from "axios";


export const api = axios.create({
    baseURL: "http://:8000", 
});
