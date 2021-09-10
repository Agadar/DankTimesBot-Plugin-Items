# DankTimesBot-Plugin-Items
An items and shop plugin for the DankTimesBot. Very much WIP.

## TODO:
1. Persisting everything to files (partly need DankTimesBot update for hourly persistence)
2. Allowing other plugins to put items in the shop via custom plugin events (need DankTimesBot update for that first)
3. Implement usage of the various flags given to Item
4. Round calculated prices to max 3 non-0 numbers so they look better (e.g. 35748 becomes 35700)
5. Ease-of-use stuff e.g. allow to see sell price before selling, allow to enter quantity when buying/selling, etc.

## Installation

1. Git clone this repository into your DankTimesBot/plugins directory or unzip it in there;
2. Add `DankTimesBot-Plugin-Items` to your `/data/config.json`'s plugins list;
3. Re-launch DankTimesBot.

## Usage

Send the `/items` command to the bot to receive help.
