import { SourceMapGenerator, RawSourceMap } from "source-map";
import { Extracted } from "../loaders/types";
import { mm } from "./sourcemap";

interface Concatenated {
  css: string;
  map: RawSourceMap;
}

export default async function (extracted: Extracted[]): Promise<Concatenated> {
  const sm = new SourceMapGenerator({ file: "" });
  const content = [];
  let offset = 0;

  for await (const { css, map } of extracted) {
    content.push(css);

    const consumer = await mm(map).toConsumer();
    if (!consumer) continue;

    consumer.eachMapping(m =>
      sm.addMapping({
        generated: { line: offset + m.generatedLine, column: m.generatedColumn },
        original: { line: m.originalLine, column: m.originalColumn },
        source: m.source,
        name: m.name,
      }),
    );

    if (consumer.sourcesContent) {
      for (let i = 0; i < consumer.sources.length; i++) {
        sm.setSourceContent(consumer.sources[i], consumer.sourcesContent[i]);
      }
    }

    consumer.destroy();
    offset += css.split("\n").length;
  }

  return {
    css: content.join("\n"),
    map: sm.toJSON(),
  };
}
