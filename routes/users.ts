// deno-lint-ignore-file no-explicit-any
import { Context, Router } from "@oak/oak";
import { deleteKV, editKV, getAllKV, getKV, saveKV } from "../kv/main.ts";

const usersRouter = new Router();

const apiPrefix = "/api/users";
const htmxPrefix = "/htmx/users";
const templatePrefix = "/templ/users";

usersRouter.get(templatePrefix, async (ctx: Context) => {
  const text = await Deno.readTextFile("./template/users.html");
  ctx.response.headers.set("Content-Type", "text/html");
  ctx.response.body = text;
});

/* GET users listing. */
usersRouter.get(apiPrefix, async (context: Context) => {
  context.response.body = await getAllKV("users");
});

usersRouter.get(htmxPrefix + "/:element", async (context: Context) => {
  const element = (context as any).params.element;
  context.response.body = (await getAllKV("users")).map((data) =>
    `<${element} class="px-5">${(data[1] as any).firstName} ${
      (data[1] as any).lastName
    }
    </${element}>`
  ).join("");
});

usersRouter.post(htmxPrefix, async (context: Context) => {
  const { element, className } = await (context as any).request.body.json();
  context.response.body = (await getAllKV("users")).map((data) =>
    `<${element} class="${className} flex items-center" id="data-${data[0]}">
    <div class="w-[300px]">
    ${(data[1] as any).firstName} ${(data[1] as any).lastName} [${data[0]}]
    </div>
    <button class="text-red-500"
      id="deleteButton"
      hx-put="/htmx/users/delete/${data[0]}"
      hx-ext="json-enc"
      hx-vals='js:{element: "${element}", className: "${className}"}'
      hx-target="#loader"
      hx-trigger="click"
    >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
    </button>
    </${element}>`
  ).join("");
});

usersRouter.get(apiPrefix + "/:id", async function (context: Context) {
  context.response.body = await getKV("users", (context as any).params.id);
});

usersRouter.post(apiPrefix, async function (context: Context) {
  const body = await context.request.body.json();
  context.response.body = " User id:" + await saveKV("users", body) +
    " Created!";
});

usersRouter.put(apiPrefix + "/:id", async function (context: Context) {
  const body = await context.request.body.json();
  context.response.body = await editKV(
    "users",
    (context as any).params.id,
    body,
  );
});

usersRouter.delete(apiPrefix + "/:id", async function (context: Context) {
  console.log((context as any).params.id);
  await deleteKV("users", (context as any).params.id);
  context.response.body = ``;
});

usersRouter.put(htmxPrefix + "/delete/:id", async function (context: Context) {
  console.log((context as any).params.id);
  await deleteKV("users", (context as any).params.id);
  const { element, className } = await (context as any).request.body.json();
  context.response.body = (await getAllKV("users")).map((data) =>
    `<${element} class="${className} flex items-center" id="data-${data[0]}">
    <div class="w-[300px]">
    ${(data[1] as any).firstName} ${(data[1] as any).lastName} [${data[0]}]
    </div>
    <button class="text-red-500"
      id="deleteButton"
      hx-put="/htmx/users/delete/${data[0]}"
      hx-target="#loader"
      hx-trigger="click"
    >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
    </button>
    </${element}>
    `
  ).join("");
});

export default usersRouter;
