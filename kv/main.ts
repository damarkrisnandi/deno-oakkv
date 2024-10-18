// deno-lint-ignore-file
const kv = await Deno.openKv();

// main methods

function generateId(): string {
  return Math.random().toString(36).slice(2);
}

export async function saveKV(prefix: string, value: string): Promise<string> {
  const id = generateId();
  await kv.set([prefix, id], value);
  return id;
}

export async function editKV(
  prefix: string,
  id: string,
  value: string,
): Promise<string | null> {
  const content: unknown | null | string = await kv.get([prefix, id]);
  if (!content) {
    return null;
  }
  await kv.set([prefix, id], value);
  return id;
}
export async function deleteKV(prefix: string, id: string): Promise<string> {
  await kv.delete([prefix, id]);
  return "/";
}
export async function getKV(
  prefix: string,
  id: string,
): Promise<string | null> {
  const res: any = await kv.get([prefix, id]);
  return res.value;
}

export async function getAllKV(prefix: string): Promise<[string, string][]> {
  const returns: [string, string][] = [];
  for await (
    const { key, value } of kv.list<string>(
      { prefix: [prefix] },
      {
        limit: 30,
      },
    )
  ) {
    // kv.delete(["todo", key[1]]);
    returns.push([key[1] as string, value]);
  }

  return returns;
}
