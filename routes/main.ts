import { Router } from "@oak/oak";

const router = new Router();
router.get("/", (context) => {
    console.log(context.request);
  context.response.body = { message: "hello from oak and deno" };
});

router.post("/", async (context) => {
  const body = await context.request.body.json();
  context.response.body = body;
});

export default router;
