import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Turmoil} from '../../turmoil/Turmoil';

export class VoteOfNoConfidence extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.VOTE_OF_NO_CONFIDENCE,
      cardType: CardType.EVENT,
      cost: 5,

      requirements: CardRequirements.builder((b) => b.partyLeaders()),
      metadata: {
        cardNumber: 'T16',
        renderData: CardRenderer.builder((b) => {
          b.minus().chairman().any.asterix();
          b.nbsp.plus().partyLeaders().br;
          b.tr(1);
        }),
        description: 'Requires that you have a Party Leader in any party and that the sitting Chairman is neutral. ' +
          'Remove the NEUTRAL Chairman and move your own delegate (from the reserve) there instead. Gain 1 TR.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (!super.canPlay(player)) {
      return false;
    }
    const turmoil = Turmoil.getTurmoil(player.game);
    if (!turmoil.hasAvailableDelegates(player.id)) return false;

    const chairmanIsNeutral = turmoil.chairman === 'NEUTRAL';
    if (chairmanIsNeutral === false) {
      return false;
    }

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST);
    }
    return true;
  }

  public play(player: Player) {
    const turmoil = Turmoil.getTurmoil(player.game);
    turmoil.chairman = player.id;
    const index = turmoil.delegateReserve.indexOf(player.id);
    if (index > -1) {
      turmoil.delegateReserve.splice(index, 1);
    }
    player.increaseTerraformRating();
    return undefined;
  }
}
