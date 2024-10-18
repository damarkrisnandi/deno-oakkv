// deno-lint-ignore-file no-explicit-any
import { Context, Router } from "@oak/oak";
import { deleteKV, editKV, getAllKV, getKV, saveKV } from "../kv/main.ts";

const usersRouter = new Router();

const prefix = "/users";

/* GET users listing. */
usersRouter.get(prefix, async (context: Context) => {
  context.response.body = await getAllKV("users");
});

usersRouter.get(prefix + "htmx", async (context: Context) => {
  context.response.body = (await getAllKV("users")).map((data) =>
    `<li class="px-5">${data[1].firstName} ${data[1].lastName}</li>`
  ).join("");
});

usersRouter.get(prefix + "/:id", async function (context: Context) {
  context.response.body = await getKV("users", (context as any).params.id);
});

usersRouter.post(prefix, async function (context: Context) {
  const body = await context.request.body.json();
  context.response.body = await saveKV("users", body);
});

usersRouter.put(prefix + "/:id", async function (context: Context) {
  const body = await context.request.body.json();
  context.response.body = await editKV(
    "users",
    (context as any).params.id,
    body,
  );
});

usersRouter.delete(prefix + "/:id", async function (context: Context) {
  context.response.body = await deleteKV("users", (context as any).params.id);
});

export default usersRouter;
