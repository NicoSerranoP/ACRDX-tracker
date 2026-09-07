import { writeFile } from "node:fs/promises";

const saveAsJSONFile = async (filename: string, data: any): Promise<void> => {
  const serializedJSON = JSON.stringify(data, (_, value) => (typeof value === "bigint" ? value.toString() : value), 2);
  await writeFile(filename, serializedJSON);
};

export default saveAsJSONFile;
