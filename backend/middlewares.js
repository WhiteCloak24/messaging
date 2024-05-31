import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

export function bodyParserMiddleWare(app) {
  app.use(bodyParser.json());
}
export function corsMiddleWare(app) {
  app.use(cors({ credentials: true, origin: ["http://localhost:3000", "http://192.168.29.209:3000"] }));
}
export function cookieParserMiddleWare(app) {
  app.use(cookieParser());
}
