/**
 * Is is deeply-encoded in a stupid manner in plugins.js
 * 
 * The changes here are:
 * - quarterWidth = statusWidth / (the number of languages)
 * - the appended string rendering
 */

var rect = this.itemRectForText(index);
var statusWidth = this.statusWidth();
var titleWidth = rect.width - statusWidth - 140;
var quarterWidth = statusWidth / 3;
this.resetTextColor();
this.changePaintOpacity(this.isCommandEnabled(index));
this.drawOptionsName(index);

var symbol = this.commandSymbol(index);
var value = this.getConfigValue(symbol);

this.changePaintOpacity(value === 0);
var text = "EN";
this.drawText(text, titleWidth + quarterWidth * 1, rect.y, quarterWidth, 'center');

this.changePaintOpacity(value === 1);
var text = "JP";
this.drawText(text, titleWidth + quarterWidth * 2, rect.y, quarterWidth, 'center');

this.changePaintOpacity(value === 2);
var text = "FR";
this.drawText(text, titleWidth + quarterWidth * 3, rect.y, quarterWidth, 'center');
