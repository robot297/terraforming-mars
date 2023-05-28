
import {ColonyName} from '../common/colonies/ColonyName';
import {PlayerId} from '../common/Types';

export type SerializedColony = {
    name: ColonyName;
    colonies: Array<PlayerId>;
    isActive: boolean;
    trackPosition: number;
    visitor: undefined | PlayerId;
}

