import { html } from "../utils/html.js";

import { DifficultyDecoration } from "./DifficultyDecoration.js";
import { map } from 'https://cdn.skypack.dev/ramda';

import cm from 'https://cdn.skypack.dev/classnames';


const formatter = new Intl.ListFormat('en', { style: 'short', type: 'conjunction' });

const bpmText = (maxBPM, minBPM) => maxBPM === minBPM ? `${maxBPM} BPM` : `${minBPM}-${maxBPM} BPM`;

export function LevelBox({level, expanded, _class}) {
	return html`
		<div class=${cm("lb", _class, {"expanded!lb": expanded})}>
			<div class="lb_image1">
				<div class="lb_image2">
                    <img class="lb_image3" src=${level.thumb} />
                </div>
			</div>
			<div class="lb_info">
				<${DifficultyDecoration} _class="lb_decorator" difficulty=${level.difficulty} />
				<div class="lb_info2">
					<h2 class="lb_artist">${level.artist}</h2>
					<h1 class="lb_song">${level.song}</h1>
					<div class="lb_icons1">
						<ul class="lb_icons2">
							<li class="lb_icon">
								<i class="fad fa-pencil-alt"></i>
								<span>${formatter.format(level.authors)}</span>
							</li>
							<li class="lb_icon">
								<i class="fad fa-triangle-music"></i>
								<span>${bpmText(level.max_bpm, level.min_bpm)}</span>
							</li>
							<li class="lb_icon">
								<i class="fab fa-discord"></i>
								<span>Rhythm Doctor Lounge</span>
							</li>
						</ul>
					</div>
					<div class="lb_spacer"></div>
					<div class="lb_tags1">
						<ul class="lb_tags2">
							${map(
								tag => html`<span class="lb_tag">${tag}</span>`,
								level.tags
							)}
						</ul>
					</div>
				</div>
			</div>
		</div>
	`
}