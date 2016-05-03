import {Component} from "angular2/core";
import {Assistant} from "../../models/Assistant";
import {R_BUTTON} from "../../ui/r-button.component";
import {R_STEPPER} from "../../ui/r-stepper.component";
import {R_DIALOG} from "../../ui/r-dialog";
import {R_INPUT} from "../../ui/r-input-text.component";
import {R_DROPDOWN} from "../../ui/r-dropdown";
import {R_DL} from "../../ui/r-dl";


@Component({
    selector: 'r-assistant-panel-options',
    template: `
    <dl r-dl>
        <dt>Lorem Ipsum</dt>
        <dd>A boring dummy text.</dd>
        <dt>Cat Ipsum</dt>
        <dd>
            Hide when guests come over. Chase mice hate dog, so mew leave hair
            everywhere, but intently sniff hand. Hunt by meowing loudly at 5am next
            to human slave food dispenser attack dog, run away and pretend to be
            victim. Always hungry see owner, run in terror. Nap all day. Chase
            after silly colored fish toys around the house flop over, yet hopped
            up on catnip caticus cuteicus. Missing until dinner time shove bum in
            owner's face like camera lens and poop in litter box, scratch the walls
            so flop over meow love to play with owner's hair tie yet play riveting
            piece on synthesizer keyboard. Love to play with owner's hair tie drink
            water out of the faucet. Burrow under covers eat from dog's food. Attack
            feet chase red laser dot and need to chase tail. Hide head under blanket
            so no one can see claw drapes missing until dinner time, or need to
            chase tail, or asdflkjaertvlkjasntvkjn (sits on keyboard) shove bum in
            owner's face like camera lens i like big cats and i can not lie. Jump
            launch to pounce upon little yarn mouse, bare fangs at toy run hide in
            litter box until treats are fed have secret plans but find empty spot.
        </dd>
    </dl>
    `,
    styleUrls: ['app/assistant-panel/options/assistant-panel-options.css'],
    directives: [R_BUTTON, R_STEPPER, R_DIALOG, R_INPUT, R_DROPDOWN, R_DL]
})

export class AssistantPanelOptionsComponent {

    assistant: Assistant;

    val: Array<string> = ["a", "b", "c", "d"];

}