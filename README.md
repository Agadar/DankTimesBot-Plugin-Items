# DankTimesBot-Plugin-Items
An items and shop plugin for the DankTimesBot. Very much WIP.

## TODO:
1. Updating medians and refreshing prices on bot startup and nightly reset
2. Persisting everything to files (partly need DankTimesBot update for hourly persistence)
3. Allowing other plugins to put items in the shop via custom plugin events (need DankTimesBot update for that first)
4. Implement usage of the various flags given to Item
5. Round calculated prices to max 3 non-0 numbers so they look better (e.g. 35748 becomes 35700)

## Installation

1. Git clone this repository into your DankTimesBot/plugins directory or unzip it in there;
2. Add `DankTimesBot-Plugin-Items` to your `/data/config.json`'s plugins list;
3. Re-launch DankTimesBot.

## Usage

Send the `/items` command to the bot to receive help.
