type Header = {
  name: string;
  type: "float" | "string" | "int";
};

type HeaderWithIndex = Header & { index: number };

export const parseCsv = (csv_string: string, headers: Header[]) => {
  const lines = csv_string.split("\n");
  const header_line = lines.shift()!.split(",");

  const headers_with_index = headers.map((header) => ({
    ...header,
    index: header_line.findIndex((header_text) => header_text === header.name),
  })) as HeaderWithIndex[];

  return lines.map((line) => {
    const obj = {} as Record<string, any>;

    const splitted_line = line.split(",");

    for (let header of headers_with_index) {
      let parsed: any;
      const value = splitted_line[header.index];

      switch (header.type) {
        case "string":
          parsed = value;
          break;
        case "int":
          parsed = parseInt(value);
          break;
        case "float":
          parsed = parseFloat(value);
      }

      obj[header.name] = parsed;
    }

    return obj;
  });
};
