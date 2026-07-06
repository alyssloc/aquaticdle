import type { Species } from '../components/types';
import { BELUGA_WHALE_DATA } from './beluga_whale.ts';
import { DOLPHIN_DATA } from './dolphins.ts';
import { DUGONG_DATA } from './dugongs.ts';
import { FRESHWATER_DATA } from './freshwater.ts';
import { FUR_SEAL_DATA } from './fur_seals.ts';
import { MANATEE_DATA } from './manatees.ts';
import { NARWHAL_DATA } from './narwhal.ts';
import { OTTER_DATA } from './otters.ts';
import { POLAR_BEAR_DATA } from './polar_bears.ts';
import { PORPOISE_DATA } from './porpoises.ts';
import { SEA_LION_DATA } from './sea_lions.ts';
import { SEAL_DATA } from './seals.ts';
import { WALRUS_DATA } from './walruses.ts';
import { WHALE_DATA } from './whales.ts';


export const SPECIES_DATA: Species [] = [
    ...BELUGA_WHALE_DATA,
    ...DOLPHIN_DATA,
    ...DUGONG_DATA,
    ...FRESHWATER_DATA,
    ...FUR_SEAL_DATA,
    ...MANATEE_DATA,
    ...NARWHAL_DATA,
    ...OTTER_DATA,
    ...POLAR_BEAR_DATA,
    ...PORPOISE_DATA,
    ...SEA_LION_DATA,
    ...SEAL_DATA,
    ...WALRUS_DATA,
    ...WHALE_DATA
]