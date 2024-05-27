import bodyParser from "body-parser";
import cors from "cors";

export function bodyParserMiddleWare(app) {
  app.use(bodyParser.json());
}
export function corsMiddleWare(app) {
  app.use(cors());
}
