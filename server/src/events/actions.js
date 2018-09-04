import App from "../app";
import { pubsub } from "../helpers/subscriptionManager.js";
import uuid from "uuid";
import { randomFromList } from "../classes/generic/damageReports/constants";
App.on("triggerAction", args => {
  args.stationId = args.stationId || "all";
  let clients = [];
  let stations = [];
  console.log(args);
  const bridgeStations = App.simulators
    .find(s => s.id === args.simulatorId)
    .stations.map(s => s.name);
  switch (args.stationId) {
    case "all":
      clients = App.clients
        .filter(c => c.simulatorId === args.simulatorId)
        .map(c => c.id);
      stations = App.simulators
        .find(s => s.id === args.simulatorId)
        .stations.map(s => s.name)
        .concat("Viewscreen");
      break;
    case "bridge":
      stations = bridgeStations;
      clients = App.clients
        .filter(
          c =>
            c.simulatorId === args.simulatorId &&
            bridgeStations.indexOf(c.station) > -1
        )
        .map(c => c.id);
      break;
    case "random":
      clients = [
        randomFromList(
          App.clients.filter(
            c =>
              c.simulatorId === args.simulatorId &&
              bridgeStations.indexOf(c.station) > -1
          )
        ).map(c => c.id)
      ];
      stations = [
        randomFromList(
          App.simulators
            .find(s => s.id === args.simulatorId)
            .stations.map(s => s.name)
        )
      ];
      break;
    case "viewscreen":
      clients = App.clients
        .filter(
          c => c.simulatorId === args.simulatorId && c.station === "Viewscreen"
        )
        .map(c => c.id);
      stations = ["Viewscreen"];
      break;
    default:
      clients = App.clients
        .filter(
          c =>
            (c.simulatorId === args.simulatorId &&
              c.station === args.stationId) ||
            c.id === args.clientId
        )
        .map(c => c.id);
      stations = App.simulators
        .find(s => s.id === args.simulatorId)
        .stations.filter(s => s.name === args.stationId);
      break;
  }
  // In some cases, we need to change the client
  switch (args.action) {
    case "online":
      clients.forEach(c =>
        App.handleEvent({ client: c.id, state: null }, "clientOfflineState")
      );
      break;
    case "blackout":
    case "offline":
    case "power":
    case "lockdown":
    case "maintenance":
    case "soviet":
      clients.forEach(c =>
        App.handleEvent(
          { client: c.id, state: args.action },
          "clientOfflineState"
        )
      );
      break;
    case "sound":
      App.handleEvent(
        {
          sound: { asset: args.asset },
          station: args.stationId,
          simulatorId: args.simulatorId,
          clients
        },
        "playSound"
      );
      break;
    case "movie":
      clients.forEach(c =>
        App.handleEvent(
          { client: c.id, movie: args.message },
          "clientMovieState"
        )
      );
      break;
    case "message":
      stations.forEach(s => {
        pubsub.publish("notify", {
          id: uuid.v4(),
          simulatorId: args.simulatorId,
          station: s,
          title: args.message,
          body: "",
          color: "info"
        });
      });
      break;
    default:
      pubsub.publish("actionsUpdate", { ...args, stations, clients });
      break;
  }
});
