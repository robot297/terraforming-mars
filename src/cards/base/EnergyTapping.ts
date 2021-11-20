import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class EnergyTapping extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ENERGY_TAPPING,
      tags: [Tags.ENERGY],
      cost: 3,
      victoryPoints: -1,

      metadata: {
        cardNumber: '201',
        description: 'Decrease any Energy production 1 step and increase your own 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1, {all}).br;
            pb.plus().energy(1);
          });
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, 1);
    player.game.defer(new DecreaseAnyProduction(player, Resources.ENERGY, 1));
    return undefined;
  }
}
