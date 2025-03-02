import { Button } from "./components/Button";
import "./App.css";

function App() {
  return (
    <div>
      <h1>Olá, React com Vite!</h1>
      <Button text="Clique aqui" onClick={() => alert("Botão clicado!")} />
    </div>
  );
}

export default App;
