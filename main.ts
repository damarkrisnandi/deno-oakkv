import { Application, Context, isHttpError } from "@oak/oak";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import router from "./routes/main.ts";
import usersRouter from "./routes/users.ts";

const app = new Application();
// Enabling CORS for port 5173 on localhost using oakCors
// make sure to initialize oakCors before the routers
app.use(
  oakCors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    methods: "POST, OPTIONS, GET",
  }),
);

// logging
app.use(async (ctx: Context, next) => {
  try {
    console.log(ctx.request.method, ctx.request.url.href);
    await next();
    // deno-lint-ignore no-explicit-any
  } catch (err: any) {
    // You can log error here .. Then handle response
    if (isHttpError(err)) {
      ctx.response.status = err.status;
    } else {
      ctx.response.status = 500;
    }
    ctx.response.body = { error: err.message };
    ctx.response.type = "json";
  }
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(usersRouter.routes());
app.use(usersRouter.allowedMethods());

await app.listen({ port: 8000 });
