import type { Game } from "../../types/types";

const steamId = import.meta.env.STEAM_ID;
const apiKey = import.meta.env.STEAM_API_KEY;

export const getSteamOwnedGames = async (): Promise<Game[]> => {
  if (!steamId) {
    throw new Error("SteamID is required");
  }

  const gamesUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json&include_appinfo=true&include_played_free_games=true`;

  try {
    const response = await fetch(gamesUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    // Filtrar solo juegos y mapear los datos
    const games: Game[] = (
      data.response.games
        .filter((game: Game) => game.playtime_forever > 1) // Filtrar solo juegos con tiempo de juego
        .map((game: Game) => ({
          ...game,
          img_icon_url: `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`, // URL de la imagen de cabecera
        })) || []
    ).sort((a: Game, b: Game) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente
    return games;
  } catch (error) {
    console.error("Failed to fetch games data", error);
    throw new Error("Failed to fetch games data");
  }
};
