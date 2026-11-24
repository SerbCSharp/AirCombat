import { InitGame } from './application/InitGame.js';
import { ScenePresenter } from './adapters/ScenePresenter.js';
import { Scene } from './presentation/three/Scene.js';
import { BoardMesh } from './presentation/three/BoardMesh.js';
import { AircraftMesh } from './presentation/three/AircraftMesh.js';

const initState = new InitGame().build();
const viewModel = new ScenePresenter(2).present(initState);

const app = new Scene();
app.add(new BoardMesh().build(viewModel.cells));
app.add(new AircraftMesh().build(viewModel.units));
app.runAnimation();