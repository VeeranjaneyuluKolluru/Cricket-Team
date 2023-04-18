const convertDBtoRO = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    PlayerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};
const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const intializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server started");
    });
  } catch (e) {
    console.log(`DBError:${e.message}`);
    process.exit(1);
  }
};
intializeDbAndServer();

//get api

app.get("/players/", async (request, response) => {
  const getplayersq = `select * from cricket_team;`;
  const playerArray = await db.all(getplayersq);
  response.send(playerArray.map((eachPlayer) => convertDBtoRO(eachPlayer)));
});

//post api
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addplayerq = `insert into cricket_team (playerName, jerseyNumber, role)
  values ('${playername}',${jerseyNumber},'${role}');`;
  const dbResponse = await db.run(addplayerq);
  response.send("Player Added to Team");
});

//get api by playerId
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQ = `select * from cricket_team where playerId =${playerId};`;
  const playerResult = await db.get(getPlayerQ);
  response.send(playerResult);
});

//put api

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerq = `update cricket_team set playerName='${playerName}', jerseyNumber=${jerseyNumber}, role='${role}  where playerId=${playerId};`;
  await db.run(updatePlayerq);
  response.send("Player Details Updated");
});

//delete api

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerq = `delete from cricket_team where playerId=${playerId};`;
  await db.run(deletePlayerq);
  response.send("Player Removed");
});

//complete
module.exports = app;
