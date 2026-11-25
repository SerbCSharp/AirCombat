import { InitGame } from "./application/InitGame.js";
import { ScenePresenter } from "./adapters/ScenePresenter.js";
import { Scene } from "./presentation/three/Scene.js";
import { BoardMesh } from "./presentation/three/BoardMesh.js";
import { AircraftMesh } from "./presentation/three/AircraftMesh.js";

const gameState = new InitGame().build();
const presenter = new ScenePresenter(2);
const initialView = presenter.present(gameState);

const app = new Scene();
const boardMesh = new BoardMesh();
const aircraftMesh = new AircraftMesh();

app.add(boardMesh.build(initialView.board));
app.add(aircraftMesh.sync(initialView.units));
app.runAnimation();
