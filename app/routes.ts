import type { RouteConfig } from "@react-router/dev/routes";
import { index, route } from "@react-router/dev/routes";

const routes: RouteConfig = [
  index("./routes/_index.tsx"),
  route("api/chats", "./routes/api.chats.tsx"),
  route("api/chat/message", "./routes/api.chat.message.tsx"),
  route("api/promo-code", "./routes/api.promo-code.tsx"),
  route("api/openrouter", "./routes/api.openrouter.tsx"),
  route("api/user-key", "./routes/api.user-key.tsx"),
];

export default routes;
