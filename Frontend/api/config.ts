import axios from "axios";

//Instancia do axios
export const api = axios.create({
    baseURL: "http://192.168.0.212:8000", //URL do servidor
    });
