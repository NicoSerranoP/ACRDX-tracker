import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const saveAsJSONFile = async (filename: string, data: any): Promise<void> => {
  const publicDir = path.resolve(process.cwd(), "public");
  const filePath = path.join(publicDir, filename);

  await mkdir(publicDir, { recursive: true });

  const serializedJSON = JSON.stringify(data, (_, value) => (typeof value === "bigint" ? value.toString() : value), 2);
  await writeFile(filePath, serializedJSON, "utf8");
};

export default saveAsJSONFile;
