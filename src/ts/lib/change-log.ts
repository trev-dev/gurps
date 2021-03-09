import MarkdownIt from 'markdown-it';
import { SemanticVersion } from "./semver";

export class ChangeLogWindow extends FormApplication {
  md: MarkdownIt

  constructor(lastVersion) {
    super({}, {});
    
    this.lastVersion = lastVersion;
    this.md = new MarkdownIt()
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    return mergeObject(options, {
      id: "changelog",
      classes: ["gurps", "changelog"],
      template: "systems/gurps/templates/changelog.html",
      width: 700,
      submitOnChange: true,
      closeOnSubmit: false,
    });
  }

  get title() {
    return `${game.i18n.localize("GURPS.title")} ~ ${game.i18n.localize("GURPS.changelog")}`;
  }

  async getData() {
    let data = await super.getData();

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "systems/gurps/README.md");

    let promise = new Promise(resolve => {
      xhr.onload = () => {
        if (xhr.status === 200) {
          data.changelog = this._processChangelog(xhr.response);
          resolve(data);
        }
      };
    });
    xhr.send(null);

    return promise;
  }

  _processChangelog(raw: string) {
		const md = raw.replace(/<a href=.*<\/a>/g,"");	// Remove HTML link from internal changelog display

    // Cut off irrelevant changelog entries
    let lines = md.split(/[\n\r]/);
    if (this.lastVersion) {
      for (let a = 0; a < lines.length; a++) {
        let line = lines[a];
        if (line.match(/##\s+([0-9]+\.[0-9]+\.[0-9]+)/)) {
          const version = SemanticVersion.fromString(RegExp.$1);
          if (!version.isHigherThan(this.lastVersion)) {
            lines = lines.slice(0, a);
            break;
          }
        }
      }
    }

    return this.md.render(lines.join("\n"));
  }
}
