# Weather-Forecast
Simple website which provides a 7-day forecast for a given address.

Features:
- User can input an address in the input box and click the find weather button to display the forecast.
- After a short period of not typing into the input box, a dropdown of potential addresses appear.
- User can click on any address in the dropdown box to automatically display the weather for the respective address.
- User can also select an address from the dropdown box by using the up/down arrow keys and pressing enter.
- If no address is selected and the user presses enter (while using the input box), then the first address in the dropdown box is displayed.

Forecast Display:
- The forecast is displayed as 7 cards, with each card being one day.
- The day of the week and the day of the month is displayed at the top of each card.
- The expected weather and a corresponding emoji is displayed on each card.
- The expected temperature range is displayed on each card.

API calls:
- To populate the dropdown box and provide specific coordinates for a given address: https://photon.komoot.io/
- To get the weather forecast given specific coordinates: https://open-meteo.com/
