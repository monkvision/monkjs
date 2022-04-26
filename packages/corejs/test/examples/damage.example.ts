import { CreateDamage } from '../../src/damages/apiTypes';
import { DamageType } from '../../src/damages/entityTypes';
import { PartType } from '../../src/parts/entityTypes';

const damageExample: CreateDamage = {
  damageType: DamageType.BODY_CRACK,
  partType: PartType.IGNORE,
};

export default damageExample;
