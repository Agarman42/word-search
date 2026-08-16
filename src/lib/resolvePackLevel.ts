import { getCuratedLevelConfig } from './curatedPacks';
import { getPackLevelConfig, type PackLevelConfig } from './packLevels';

/** Curated family packs use the full word list and a large enough grid. */
export function resolvePackLevelConfig(packId: string, level: number): PackLevelConfig {
  return getCuratedLevelConfig(packId) ?? getPackLevelConfig(packId, level);
}
