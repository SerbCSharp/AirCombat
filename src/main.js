import { InitGame } from "./application/InitGame.js";
import { MoveAircraft } from "./application/MoveAircraft.js";
import { BotPlayer } from "./application/BotPlayer.js";
import { ScenePresenter } from "./adapters/ScenePresenter.js";
import { Scene } from "./presentation/three/Scene.js";
import { BoardMesh } from "./presentation/three/BoardMesh.js";
import { AircraftMesh } from "./presentation/three/AircraftMesh.js";
import { MoveMarkersMesh } from "./presentation/three/MoveMarkersMesh.js";
import { RaycasterInput } from "./presentation/three/RaycasterInput.js";
import { TurnHud } from "./presentation/ui/TurnHud.js";
import { StructuresMesh } from "./presentation/three/StructuresMesh.js";
import { RulesModal } from "./presentation/ui/RulesModal.js";

let gameState = new InitGame().build();
let moveAircraft = new MoveAircraft(gameState);
const presenter = new ScenePresenter(2);

const app = new Scene();
const boardMesh = new BoardMesh();
const aircraftMesh = new AircraftMesh();
const moveMarkersMesh = new MoveMarkersMesh();
const structuresMesh = new StructuresMesh();

const botPlayer = new BotPlayer({
  gameState,
  moveAircraft,
  botTeam: "BLUE",
  enabled: true,
  onStateChanged: () => render(),
});

const rulesModal = new RulesModal();

const turnHud = new TurnHud({
  onToggleMode: () => {
    botPlayer.setEnabled(!botPlayer.enabled);
    render();
  },
  onNewGame: () => {
    gameState = new InitGame().build();
    moveAircraft = new MoveAircraft(gameState);
    botPlayer.reset(gameState, moveAircraft);
    render();
  },
  onOpenRules: () => rulesModal.open(),
});

function render() {
  const view = presenter.present(gameState);
  turnHud.sync({ ...view.turn, vsBot: botPlayer.enabled });
  aircraftMesh.sync(view.units);
  moveMarkersMesh.sync(view.moveMarkers);
  botPlayer.scheduleIfBotTurn();
  return view;
}

const initialView = render();
app.add(boardMesh.build(initialView.board));
app.add(structuresMesh.build(initialView.structures));
app.add(aircraftMesh.group);
app.add(moveMarkersMesh.group);

new RaycasterInput({
  camera: app.camera,
  domElement: app.renderer.domElement,
  aircraftTargets: aircraftMesh.group.children,
  markerTargets: moveMarkersMesh.group.children,
  onAircraftClick: (unitId) => {
    if (botPlayer.isThinking) return;
    if (gameState.selectUnit(unitId)) {
      render();
    }
  },
  onMoveMarkerClick: (move) => {
    if (botPlayer.isThinking) return;
    if (moveAircraft.execute(move)) {
      render();
    }
  },
});

app.runAnimation((dt) => {
  aircraftMesh.update(dt);
});

