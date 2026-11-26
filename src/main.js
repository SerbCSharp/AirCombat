import { InitGame } from "./application/InitGame.js";
import { MoveAircraft } from "./application/MoveAircraft.js";
import { ScenePresenter } from "./adapters/ScenePresenter.js";
import { Scene } from "./presentation/three/Scene.js";
import { BoardMesh } from "./presentation/three/BoardMesh.js";
import { AircraftMesh } from "./presentation/three/AircraftMesh.js";
import { MoveMarkersMesh } from "./presentation/three/MoveMarkersMesh.js";
import { RaycasterInput } from "./presentation/three/RaycasterInput.js";

const gameState = new InitGame().build();
const moveAircraft = new MoveAircraft(gameState);
const presenter = new ScenePresenter(2);

const app = new Scene();
const boardMesh = new BoardMesh();
const aircraftMesh = new AircraftMesh();
const moveMarkersMesh = new MoveMarkersMesh();

function render() {
  const view = presenter.present(gameState);
  aircraftMesh.sync(view.units);
  moveMarkersMesh.sync(view.moveMarkers);
  return view;
}

const initialView = render();
app.add(boardMesh.build(initialView.board));
app.add(aircraftMesh.group);
app.add(moveMarkersMesh.group);

new RaycasterInput({
  camera: app.camera,
  domElement: app.renderer.domElement,
  aircraftTargets: aircraftMesh.group.children,
  markerTargets: moveMarkersMesh.group.children,
  onAircraftClick: (unitId) => {
    if (gameState.selectUnit(unitId)) {
      render();
    }
  },
  onMoveMarkerClick: (move) => {
    if (moveAircraft.execute(move)) {
      render();
    }
  },
});

app.runAnimation((dt) => {
  aircraftMesh.update(dt);
});

