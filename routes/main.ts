import { Context, Router } from "@oak/oak";

const router = new Router();
// router.get("/", (context) => {
//     console.log(context.request);
//   context.response.body = { message: "hello from oak and deno" };
// });

router.get("/", async (ctx: Context) => {
  const text = await Deno.readTextFile("./template/index.html");
  ctx.response.headers.set("Content-Type", "text/html");
  ctx.response.body = text;
});

router.post("/", async (context) => {
  const body = await context.request.body.json();
  context.response.body = body;
});

export default router;
