import { PreRenderedChunk, RenderedChunk, OutputChunk, PluginContext } from "rollup";

type Chunk = PreRenderedChunk | RenderedChunk | OutputChunk;
type InfoFn = PluginContext["getModuleInfo"];

export const getIds = (chunk: Chunk, infoFn: InfoFn): string[] =>
  Object.keys(chunk.modules)
    .map(m => infoFn(m))
    .reduce<string[]>(
      (acc, info) => [...acc, info.id, ...info.importedIds, ...info.dynamicallyImportedIds],
      [],
    );
